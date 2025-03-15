import OpenAI from "openai";
const openai = new OpenAI({ apiKey: `${process.env.OPENAPI_KEY}` });
export async function POST(req: Request) {
  const { quote } = await req.json();
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `background image for this passage : ${quote}`,
    n: 1,
    size: "512x512",
  });
  console.log(response);
  return Response.json(response.data);
}
