import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, attachments, systemInstruction, model, temperature } = req.body;

  if (!message && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ error: "Message or attachment is required" });
  }

  // Set Gemini API Key
  const gkey = process.env.GEMINI_API_KEY;
  if (!gkey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server. Please check your environment variables." });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: gkey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Strict Model validation (Default to gemini-3.5-flash as recommended)
    let modelName = model || "gemini-3.5-flash";
    if (modelName === "gemini-2.0-flash") {
      modelName = "gemini-3.5-flash";
    }

    // Configure SSE response headers for chunk streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    // Format history to match GoogleGenAI format
    const formattedHistory = (history || []).map((m: any) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.parts?.[0]?.text || m.content || "" }]
    }));

    const chatSession = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction || "You are a helpful AI assistant.",
        temperature: typeof temperature === "number" ? temperature : 0.7
      },
      history: formattedHistory
    });

    // Construct message payload supporting text and base64 image attachments
    let messagePayload: any = message;

    if (attachments && attachments.length > 0) {
      messagePayload = [];
      attachments.forEach((att: string) => {
        try {
          const parts = att.split(",");
          if (parts.length >= 2) {
            const header = parts[0];
            const base64Data = parts[1];
            const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
            messagePayload.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            });
          }
        } catch (e) {
          console.error("Failed to parse attachment data:", e);
        }
      });
      messagePayload.push({ text: message || "এই ছবিটিতে কি আছে তা বর্ণনা করো।" });
    }

    const responseStream = await chatSession.sendMessageStream({ message: messagePayload });

    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Gemini API error in Vercel handler:", error);
    res.write(`data: ${JSON.stringify({ error: error.message || "An error occurred with the AI model" })}\n\n`);
    res.end();
  }
}
