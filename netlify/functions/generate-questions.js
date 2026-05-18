/**
 * netlify/functions/generate-questions.js
 *
 * Serverless proxy that keeps GROQ_API_KEY on the server.
 * Set GROQ_API_KEY in: Netlify → Site → Environment variables
 */

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Parse the request body
  let jobTitle;
  try {
    ({ jobTitle } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!jobTitle || typeof jobTitle !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "jobTitle is required" }),
    };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GROQ_API_KEY is not set in environment variables" }),
    };
  }

  const prompt =
    `Generate exactly 3 thoughtful and professional interview questions for a ` +
    `candidate applying for the role of ${jobTitle}. Keep the questions concise, ` +
    `practical, and specific to the role. Return only the numbered list, no extra commentary.`;

  // Forward the request to Groq
  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       "llama-3.3-70b-versatile",
      messages:    [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens:  512,
    }),
  });

  const data = await groqResponse.json();

  return {
    statusCode: groqResponse.status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};
