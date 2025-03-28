/**
 * OpenAI API Proxy for Chrome Extension
 *
 * This Cloudflare Worker acts as a secure proxy between your Chrome extension
 * and the OpenAI API, keeping your API key secure on the server side.
 */

// The OpenAI API key will be stored as a secret in the Cloudflare dashboard
// You'll set this up when deploying the Worker

export default {
  async fetch(request, env, ctx) {
    // Allow CORS for your extension
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Basic validation of request origin
    const origin = request.headers.get("Origin") || "";

    // You can restrict to your extension's ID once you know it
    // if (!origin.includes("chrome-extension://your-extension-id")) {
    //   return new Response("Unauthorized", { status: 403 });
    // }

    try {
      // Parse the incoming request
      const requestData = await request.json();

      // Validate the required parameters
      if (!requestData.prompt) {
        return new Response(
          JSON.stringify({ error: "Missing required parameter: prompt" }),
          { status: 400, headers: corsHeaders() }
        );
      }

      // Optional: Add rate limiting here if needed

      // Format the request for OpenAI
      const openAIRequest = {
        model: requestData.model || "gpt-3.5-turbo", // Default model
        messages: [{ role: "user", content: requestData.prompt }],
        max_tokens: requestData.max_tokens || 1000,
        temperature: requestData.temperature || 0.7,
      };

      // Make the request to OpenAI API
      const openAIResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(openAIRequest),
        }
      );

      // Get the response data
      const responseData = await openAIResponse.json();

      // Return the response to the client
      return new Response(
        JSON.stringify({
          success: true,
          data: responseData,
        }),
        {
          status: 200,
          headers: corsHeaders(),
        }
      );
    } catch (error) {
      // Handle any errors
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "An error occurred",
        }),
        {
          status: 500,
          headers: corsHeaders(),
        }
      );
    }
  },
};

// Helper function for CORS headers
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Update this to be more restrictive in production
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
}

// Handle CORS preflight requests
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
