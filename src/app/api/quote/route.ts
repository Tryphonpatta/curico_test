import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: `${process.env.DEEPSEEK_API}`,
});

export async function POST(req: Request) {
  const { quote } = await req.json();
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that will extract the quote for this passage for an image for their memory for 5 -10 words.",
      },
      {
        role: "user",
        content: quote,
      },
    ],
    model: "deepseek-chat",
  });
  console.log(completion.choices[0].message.content);
  return Response.json({ quote: completion.choices[0].message.content });
}
