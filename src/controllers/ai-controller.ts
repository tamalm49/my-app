import type { Request, Response } from 'express';
import { getOllamaReply, streamOllamaReply } from '../services/generate-ai-response.js';
import { asyncHandler } from '../cores/request-handler.js';
export async function streamChat(req: Request, res: Response) {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required." });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        for await (const text of streamOllamaReply(prompt)) {
            res.write(text);
        }

        return res;
    } catch (error) {
        console.error(error);
        res.write("\n\n[Unable to generate a response.]");

        return res;
    } finally {
        res.end();
    }
}
export const getAiResponse = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Prompt is required." });
    }
    const chatReply = await getOllamaReply(prompt);
    res.status(200).json({ message: chatReply });
});