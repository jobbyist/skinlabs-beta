import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeSkinQuiz(answers: any) {
  try {
    const prompt = `You are an expert dermatologist and skincare specialist. Based on the following quiz answers from a South African user, provide personalized skincare recommendations.

Quiz Answers:
${JSON.stringify(answers, null, 2)}

Please provide a comprehensive analysis with the following structure:
1. A brief skin profile summary (2-3 sentences)
2. A daily skincare routine (morning and evening steps)
3. Specific product recommendations available in South Africa (include category, product name, key ingredients, and approximate price range in Rand)
4. Lifestyle tips specific to their concerns and environment

Format the response as JSON with the following structure:
{
  "profile": "Brief description of their skin type and main concerns",
  "routine": {
    "morning": "Step-by-step morning routine",
    "evening": "Step-by-step evening routine"
  },
  "products": [
    {
      "category": "Cleanser/Moisturizer/etc",
      "product": "Product name and brand",
      "ingredients": "Key active ingredients",
      "price": "Price range in Rand"
    }
  ],
  "tips": ["Lifestyle tip 1", "Lifestyle tip 2", "etc"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional dermatologist providing personalized skincare advice for South African users. Focus on products and brands available in South Africa. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing skin quiz:", error);
    throw new Error("Failed to analyze skin quiz");
  }
}

export async function generateSkincareAdvice(query: string, context?: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are SKYNN AI, a knowledgeable skincare assistant specializing in South African skincare. Provide helpful, accurate advice about skincare routines, products, and concerns. Keep responses concise and actionable."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating skincare advice:", error);
    throw new Error("Failed to generate skincare advice");
  }
}