import ollama from 'ollama'
import { writeFileSync } from "node:fs";
import OpenAI from "openai";
export async function* streamOllamaReply(prompt: string) {
    // Simulate generating an AI response based on the promp
    const stream = await ollama.chat({
        model: 'llama3.2',
        messages: [
            {
                role: "system",
                content: "You are a helpful, concise assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.message.content);
        yield chunk.message.content;
    }
};

export async function getOllamaReply(prompt: string): Promise<string> {
    const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant for generating concise responses to user prompts without any additional commentary or explanations. Your responses should be clear, direct, and a straightforward manner.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    return response.message.content;
}
export const texttospeech = async () => {
    const openai = new OpenAI();

    // Generate an audio response to the given prompt
    const response = await openai.chat.completions.create({
        model: "gpt-audio-1.5",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
            {
                role: "user",
                content: "Is a golden retriever a good family dog?",
            },
        ],
        store: true,
    });

    // Inspect returned data
    console.log(response.choices[0]);

    // Write audio data to a file
    const audioData = response.choices[0]?.message.audio?.data;
    if (audioData) {
        writeFileSync(
            "dog.wav",
            Buffer.from(audioData, "base64"),
            { encoding: "utf-8" }
        );
    }
}