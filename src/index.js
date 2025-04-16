import Handlebars from "handlebars"; // You'll need to install this via npm

// Initialize R2 client (you might need to adapt this based on a specific R2 library for Workers)
// For now, we'll assume a direct fetch-based approach for simplicity.
const r2 = {
  put: async (key, value, options) => {
    // Implement R2 PUT logic using fetch and the S3-compatible API
    // You'll need to construct the correct headers and request body, including signing.
    // This is a simplified placeholder.
    console.log(`Simulating R2 PUT for key: ${key}`);
    console.log(`Value: ${value}`);
    return { ok: true }; // Replace with actual R2 interaction
  },
  get: async (key) => {
    // Implement R2 GET logic using fetch and the S3-compatible API
    // You'll need to construct the correct headers and handle the response.
    // This is a simplified placeholder.
    console.log(`Simulating R2 GET for key: ${key}`);
    return { ok: false, body: null }; // Replace with actual R2 interaction
  },
};

// Handlebars template (move your HTML template string here)
const cardTemplateSource = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rescue Card</title>
      <style>/* Your CSS */</style>
  </head>
  <body>
      <div class="card">
          <h1>{{name}}</h1>
          {{#if photo}}
          <img src="{{photo}}" alt="Profile Photo">
          {{/if}}
          <div class="medical-section"><h2>Emergency Contact</h2><p><strong>Name:</strong> {{emergencyContactName}}</p><p><strong>Phone:</strong> {{emergencyContactPhone}}</p><p><strong>Relationship:</strong> {{emergencyContactRelationship}}</p></div>
          <div class="medical-section"><h2>Medical Information</h2><p><strong>Blood Type:</strong> {{bloodType}}</p><p><strong>Allergies:</strong> {{allergies}}</p><p><strong>Medications:</strong> {{medications}}</p><p><strong>Medical Conditions:</strong> {{medicalConditions}}</p></div>
          <pre>{{markdownContent}}</pre>
          <footer>Created: {{creationTimestamp}}<br><a href="/generator/{{profileId}}">Update Profile</a></footer>
      </div>
  </body>
  </html>
`;
const cardTemplate = Handlebars.compile(cardTemplateSource);

// Basic HTML for the generator form (you can expand on this)
const generatorFormHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rescue Card Generator</title>
      <style>/* Your form CSS */</style>
  </head>
  <body>
      <div class="card">
          <h1>Rescue Card Generator</h1>
          <form method="POST" action="/generator">
              <label for="name">Name:</label><input type="text" id="name" name="name" required><br>
              <label for="photo">Photo URL:</label><input type="url" id="photo" name="photo"><br>
              <label for="markdownContent">Markdown Content:</label><textarea id="markdownContent" name="markdownContent" rows="5"></textarea><br>
              <label for="pin">PIN:</label><input type="password" id="pin" name="pin" required><br>
              <label for="bloodType">Blood Type:</label><input type="text" id="bloodType" name="bloodType"><br>
              <label for="allergies">Allergies:</label><input type="text" id="allergies" name="allergies"><br>
              <label for="medications">Medications:</label><input type="text" id="medications" name="medications"><br>
              <label for="medicalConditions">Medical Conditions:</label><input type="text" id="medicalConditions" name="medicalConditions"><br>
              <label for="emergencyContactName">Emergency Contact Name:</label><input type="text" id="emergencyContactName" name="emergencyContactName"><br>
              <label for="emergencyContactPhone">Emergency Contact Phone:</label><input type="text" id="emergencyContactPhone" name="emergencyContactPhone"><br>
              <label for="emergencyContactRelationship">Emergency Contact Relationship:</label><input type="text" id="emergencyContactRelationship" name="emergencyContactRelationship"><br>
              <button type="submit">Generate Rescue Card</button>
          </form>
      </div>
  </body>
  </html>
`;

export default {
  async fetch(request, env) {
    // Environment variables (set in Cloudflare Pages settings)
    const R2_BUCKET_NAME = env.R2_BUCKET_NAME;
    const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
    const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;

    const url = new URL(request.url);

    if (url.pathname === "/generator") {
      if (request.method === "GET") {
        return new Response(generatorFormHTML, {
          headers: { "Content-Type": "text/html" },
        });
      } else if (request.method === "POST") {
        const formData = await request.formData();
        const name = formData.get("name");
        const photo = formData.get("photo");
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

        const profileData = {
          name,
          photo,
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
            .digest("hex"), // Simplified profile ID
        };
        const html = cardTemplate(profileData);
        const contentHash = crypto
          .createHash("sha256")
          .update(html)
          .digest("hex");
        const filename = `${contentHash}-${pin}.html`;

        const r2Result = await r2.put(filename, html, {
          contentType: "text/html",
        });
        if (r2Result.ok) {
          return Response.redirect(`/card/${contentHash}?pin=${pin}`, 303);
        } else {
          return new Response("Error saving Rescue Card", { status: 500 });
        }
      }
    } else if (url.pathname.startsWith("/card/")) {
      const parts = url.pathname.split("/");
      const contentHash = parts[2];
      const pin = url.searchParams.get("pin");
      const filename = `${contentHash}-${pin}.html`;
      const r2Object = await r2.get(filename);

      if (r2Object && r2Object.body) {
        const htmlContent = await r2Object.body.text();
        return new Response(htmlContent, {
          headers: { "Content-Type": "text/html" },
        });
      } else {
        return new Response("Rescue Card Not Found", { status: 404 });
      }
    } else if (url.pathname.startsWith("/generator/")) {
      // Logic for the update form
      const profileId = url.pathname.split("/generator/")[2];
      // You'll need to fetch the data from R2 based on the profileId and populate the form
      return new Response(
        `<h1>Update Form for ${profileId} (To be implemented)</h1>`,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Default response for other paths
    return new Response("Not Found", { status: 404 });
  },
};
