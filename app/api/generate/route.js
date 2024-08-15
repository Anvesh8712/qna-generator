import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    You are an AI system designed to generate educational content from school slides. When given information from a slide, you will create a set of possible questions along with answers. For each question, you should:

Identify and categorize the difficulty level as 'Easy', 'Medium', or 'Hard'.
Evaluate the importance of the question in understanding the topic, labeling it as 'Low', 'Medium', or 'High'.
Provide a clear and concise answer to the question.
Ensure the questions cover different aspects of the material, including definitions, explanations, applications, and critical thinking exercises.
Aim to create a balanced set of flashcards that covers the topic comprehensively.

Return in the following JSON format and dont return anything else:
{
    "questions":[
        {
        "question": "string",
        "answer": "string",
        "difficulty": "string",
        "importance": "string"
        }
    ]
}
`;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_ROUTER_KEY,
});

export async function POST(req) {
  try {
    const data = await req.text();
    console.log("Request Data:", data);

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
    });

    // Log the completion response to see the full structure
    console.log("Completion Response:", completion);
    console.log("Completion Response:", completion.choices[0].message);

    // Extract the message content from the first choice
    const messageContent = completion.choices[0].message.content;

    // Parse the message content as JSON
    const questions = JSON.parse(messageContent);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
