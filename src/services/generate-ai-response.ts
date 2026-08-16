import ollama from 'ollama'
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
                content: "You are a helpful, concise assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    return response.message.content;
}