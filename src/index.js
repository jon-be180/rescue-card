import Mustache from "mustache";
import crypto from "crypto";

// Your template string
const cardTemplateSource = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rescue Card</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100 flex justify-center items-center min-h-screen">
      <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 class="text-2xl font-bold mb-4 text-center text-red-600">{{name}}</h1>
          {{#if photo}}
          <img src="data:{{photoContentType}};base64,{{photo}}" alt="Profile Photo" class="w-32 h-32 rounded-full object-cover mx-auto mb-4">
          {{/if}}
          <div class="mb-4 border-t border-gray-200 pt-4">
              <h2 class="text-lg font-semibold mb-2 text-gray-800">Emergency Contact</h2>
              <p><strong class="font-semibold">Name:</strong> {{emergencyContactName}}</p>
              <p><strong class="font-semibold">Phone:</strong> {{emergencyContactPhone}}</p>
              <p><strong class="font-semibold">Relationship:</strong> {{emergencyContactRelationship}}</p>
          </div>
          <div class="mb-4 border-t border-gray-200 pt-4">
              <h2 class="text-lg font-semibold mb-2 text-gray-800">Medical Information</h2>
              <p><strong class="font-semibold">Blood Type:</strong> {{bloodType}}</p>
              <p><strong class="font-semibold">Allergies:</strong> {{allergies}}</p>
              <p><strong class="font-semibold">Medications:</strong> {{medications}}</p>
              <p><strong class="font-semibold">Medical Conditions:</strong> {{medicalConditions}}</p>
          </div>
          <div class="mb-4 border-t border-gray-200 pt-4">
              <h2 class="text-lg font-semibold mb-2 text-gray-800">Additional Information</h2>
              <pre class="whitespace-pre-wrap text-sm text-gray-700">{{markdownContent}}</pre>
          </div>
          <footer class="text-center text-gray-500 text-sm mt-4 border-t border-gray-200 pt-4">
              Created: {{creationTimestamp}}<br>
              <a href="/{{profileId}}" class="text-blue-500 hover:underline">Update Profile</a>
          </footer>
      </div>
  </body>
  </html>
`;

const cardPinTemplateSource = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Enter PIN</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="bg-gray-100 flex justify-center items-center min-h-screen">
              <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                  <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Enter PIN</h1>
                  <form method="GET" action="/card/${contentHash}">
                      <div class="mb-4">
                          <label for="pin" class="block text-gray-700 text-sm font-bold mb-2">PIN:</label>
                          <input type="password" id="pin" name="pin" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      </div>
                      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Card</button>
                  </form>
                  <p class="mt-4 text-gray-600 text-sm">If you've lost your PIN, please contact the card creator.</p>
              </div>
          </body>
          </html>
        `;

// Basic HTML for the generator form (you can expand on this)
const generatorFormHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rescue Card Generator</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100 flex justify-center items-center min-h-screen">
      <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Rescue Card Generator</h1>
          <form id="generatorForm" method="POST" action="/" enctype="multipart/form-data">
              <div class="mb-4">
                  <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                  <input type="text" id="name" name="name" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="photo" class="block text-gray-700 text-sm font-bold mb-2">Profile Photo:</label>
                  <input type="file" id="photo" name="photo" accept="image/*" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="markdownContent" class="block text-gray-700 text-sm font-bold mb-2">Markdown Content:</label>
                  <textarea id="markdownContent" name="markdownContent" rows="5" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
              </div>
              <div class="mb-4">
                  <label for="pin" class="block text-gray-700 text-sm font-bold mb-2">PIN:</label>
                  <input type="password" id="pin" name="pin" minlength="4" maxlength="4" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="bloodType" class="block text-gray-700 text-sm font-bold mb-2">Blood Type:</label>
                  <input type="text" id="bloodType" name="bloodType" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="allergies" class="block text-gray-700 text-sm font-bold mb-2">Allergies:</label>
                  <input type="text" id="allergies" name="allergies" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="medications" class="block text-gray-700 text-sm font-bold mb-2">Medications:</label>
                  <input type="text" id="medications" name="medications" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="medicalConditions" class="block text-gray-700 text-sm font-bold mb-2">Medical Conditions:</label>
                  <input type="text" id="medicalConditions" name="medicalConditions" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="emergencyContactName" class="block text-gray-700 text-sm font-bold mb-2">Emergency Contact Name:</label>
                  <input type="text" id="emergencyContactName" name="emergencyContactName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="emergencyContactPhone" class="block text-gray-700 text-sm font-bold mb-2">Emergency Contact Phone:</label>
                  <input type="text" id="emergencyContactPhone" name="emergencyContactPhone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="emergencyContactRelationship" class="block text-gray-700 text-sm font-bold mb-2">Emergency Contact Relationship:</label>
                  <input type="text" id="emergencyContactRelationship" name="emergencyContactRelationship" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Generate Rescue Card</button>
          </form>
      </div>
  </body>
  </html>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      if (request.method === "GET") {
        return new Response(generatorFormHTML, {
          headers: { "Content-Type": "text/html" },
        });
      } else if (request.method === "POST") {
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

        let photoBase64 = null;
        let photoContentType = null;

        if (photoFile instanceof File && photoFile.size > 0) {
          const arrayBuffer = await photoFile.arrayBuffer();
          const base64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer)),
          );
          photoBase64 = base64;
          photoContentType = photoFile.type;
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
        const html = Mustache.render(cardTemplateSource, profileData);
        const contentHash = crypto
          .createHash("sha256")
          .update(html)
          .digest("hex");
        const filename = `${contentHash}-${pin}.html`;

        try {
          const r2Result = await env.R2.put(filename, html, {
            contentType: "text/html",
          });
          console.log("R2 Put Result (Success):", JSON.stringify(r2Result)); // Log success
          return Response.redirect(
            `${url.origin}/card/${contentHash}?pin=${pin}`,
            303,
          );
        } catch (error) {
          console.error("Error saving to R2:", error); // Log the error object if put fails
          return new Response("Error saving Rescue Card", { status: 500 });
        }
      }
    } else if (url.pathname.startsWith("/card/")) {
      const parts = url.pathname.split("/");
      const contentHash = parts[2];
      const pin = url.searchParams.get("pin");
      const filename = `${contentHash}-${pin}.html`;
      const r2Object = await env.R2.get(filename);

      if (!pin) {
        // Serve a PIN entry form
        return new Response(cardPinTemplateSource, {
          headers: { "Content-Type": "text/html" },
        });
      } else {
        if (r2Object && r2Object.body) {
          const htmlContent = await new Response(r2Object.body).text();
          return new Response(htmlContent, {
            headers: { "Content-Type": "text/html" },
          });
        } else {
          return new Response("Rescue Card Not Found", { status: 404 });
        }
      }
    } else if (url.pathname.startsWith("/")) {
      const profileId = url.pathname.split("/")[2];
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Update Rescue Card</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 flex justify-center items-center min-h-screen">
            <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Update Rescue Card</h1>
                <p>Update form for profile ID: ${profileId} (Functionality to be implemented)</p>
                <a href="/" class="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Back to Generator</a>
            </div>
        </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};
