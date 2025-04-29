import Mustache from "mustache";
import crypto from "crypto";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

import formHTML from "./templates/form.html";
import cardHTML from "./templates/card.html";
import updateCardHTML from "./templates/update_card.html";
import cardPinHTML from "./templates/card_pin.html";
import incorrectPinHTML from "./templates/incorrect_pin.html";

async function getBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  return base64;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      if (request.method === "GET") {
        return new Response(formHTML, {
          headers: { "Content-Type": "text/html" },
        });
      } else if (request.method === "POST") {
        console.log("post started"); // Log success
        const formData = await request.formData();
        const name = formData.get("name");
        const photoFile = formData.get("photo"); // Get the File object
        const markdownContent = formData.get("markdownContent");
        const pin = formData.get("pin");
        const bloodType = formData.get("bloodType");
        const allergies = formData.get("allergies");
        const medications = formData.get("medications");
        const medicalConditions = formData.get("medicalConditions");
        const emergencyContactName = formData.get("emergencyContactName");
        const emergencyContactPhone = formData.get("emergencyContactPhone");
        const emergencyContactRelationship = formData.get(
          "emergencyContactRelationship",
        );
        console.log("const setup");

        let photoBase64 = null;
        let photoContentType = null;

        // Inside your POST request handler:
        if (photoFile instanceof File && photoFile.size > 0) {
          if (photoFile.size <= MAX_FILE_SIZE) {
            photoBase64 = await getBase64(photoFile);
            photoContentType = photoFile.type;
          } else {
            return new Response(
              "File size too large (max 1MB). Please upload a smaller image.",
              { status: 400 },
            );
          }
        }

        const profileData = {
          name,
          photo: photoBase64,
          markdownContent,
          pin,
          bloodType,
          allergies,
          medications,
          medicalConditions,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelationship,
          creationTimestamp: new Date().toISOString(),
          profileId: crypto
            .createHash("sha256")
            .update(JSON.stringify(formData))
            .digest("hex"),
        };

        console.log("pre mustache"); // Log success
        const html = Mustache.render(cardHTML, profileData);
        const filename = `${profileData.profileId}-${pin}.html`;

        console.log("post mustache worked"); // Log success
        try {
          const r2Result = await env.R2.put(filename, html, {
            contentType: "text/html",
          });
          console.log("R2 Put Result (Success):", JSON.stringify(r2Result)); // Log success
          return Response.redirect(
            `${url.origin}/card/${profileData.profileId}?pin=${pin}`,
            303,
          );
        } catch (error) {
          console.error("Error saving to R2:", error); // Log the error object if put fails
          return new Response("Error saving Rescue Card", { status: 500 });
        }
      }
    } else if (url.pathname.startsWith("/favicon.png")) {
      try {
        const object = await env.R2.get("favicon.png");
        if (object === null) {
          return new Response("favicon not found in R2", { status: 404 });
        }
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Content-Type", "image/png"); // Set the correct content type
        return new Response(object.body, {
          headers,
        });
      } catch (error) {
        console.error("Error fetching favicon from R2:", error);
        return new Response("Error fetching favicon", { status: 500 });
      }
    } else if (url.pathname.startsWith("/card/")) {
      const parts = url.pathname.split("/");
      const contentHash = parts[2];
      const pin = url.searchParams.get("pin");
      const filename = `${contentHash}-${pin}.html`;
      const r2Object = await env.R2.get(filename);

      if (!pin) {
        // Serve a PIN entry form
        const cardPinHtml = Mustache.render(cardPinHTML, {
          contentHash,
        });
        return new Response(cardPinHtml, {
          headers: { "Content-Type": "text/html" },
        });
      } else {
        if (r2Object && r2Object.body) {
          const htmlContent = await new Response(r2Object.body).text();
          return new Response(htmlContent, {
            headers: { "Content-Type": "text/html" },
          });
        } else {
          const htmlContent = Mustache.render(incorrectPinHTML);
          return new Response(htmlContent, {
            status: 404,
            "Content-Type": "text/html",
          });
        }
      }
    } else if (url.pathname.startsWith("/")) {
      const profileId = url.pathname.split("/")[2];
      const htmlContent = Mustache.render(updateCardHTML);
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
