import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]).describe("Overall sentiment of the text"),
  confidence: z.number().min(0).max(1).describe("Confidence score between 0 and 1"),
  emotions: z
    .array(z.string())
    .describe("Array of detected emotions like joy, sadness, anger, fear, surprise, calm, etc."),
  moodScore: z.number().min(1).max(10).describe("Calculated mood score from 1-10 based on the text sentiment"),
  keyPhrases: z.array(z.string()).describe("Key phrases that influenced the sentiment analysis"),
  insights: z.string().describe("Brief insight or observation about the emotional state"),
  recommendations: z.array(z.string()).describe("Wellness recommendations based on the analysis"),
})

function generateMockAnalysis(text: string, userMoodRating: number) {
  const positiveWords = ["happy", "good", "great", "amazing", "wonderful", "excited", "joy", "love", "peaceful"]
  const negativeWords = ["sad", "bad", "terrible", "awful", "angry", "frustrated", "stressed", "worried", "anxious"]

  const textLower = text.toLowerCase()
  const positiveCount = positiveWords.filter((word) => textLower.includes(word)).length
  const negativeCount = negativeWords.filter((word) => textLower.includes(word)).length

  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  let emotions = ["calm", "reflective"]
  let moodScore = userMoodRating

  if (positiveCount > negativeCount) {
    sentiment = "positive"
    emotions = ["content", "optimistic", "peaceful"]
    moodScore = Math.min(10, userMoodRating + 1)
  } else if (negativeCount > positiveCount) {
    sentiment = "negative"
    emotions = ["concerned", "thoughtful", "processing"]
    moodScore = Math.max(1, userMoodRating - 1)
  }

  return {
    sentiment,
    confidence: 0.75,
    emotions,
    moodScore,
    keyPhrases: text.split(" ").slice(0, 3),
    insights: `Based on your entry, you seem to be in a ${sentiment} emotional state. Your self-rating of ${userMoodRating}/10 aligns with the tone of your writing.`,
    recommendations: [
      "Take a few deep breaths and practice mindfulness",
      "Consider journaling about what's on your mind",
      "Remember to be kind to yourself during this time",
    ],
  }
}

function generateMockChatResponse(text: string) {
  const responses = [
    "Thank you for sharing that with me. It sounds like you're processing some important feelings. How are you taking care of yourself today?",
    "I hear you, and your feelings are completely valid. Sometimes it helps to take things one moment at a time. What's one small thing that might bring you comfort right now?",
    "It's really meaningful that you're taking time to reflect on your emotions. That shows great self-awareness. Have you tried any breathing exercises or gentle movement today?",
    "Your willingness to explore your feelings is a strength. Remember that it's okay to have difficult emotions - they're part of being human. What usually helps you feel more grounded?",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: Request) {
  try {
    const { text, userMoodRating, isChat } = await request.json()

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0

    if (isChat) {
      if (!hasApiKey) {
        return Response.json({
          chatResponse: generateMockChatResponse(text),
          isDemo: true,
        })
      }

      const { text: chatResponse } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `You are a compassionate AI wellness assistant for Mind Haven, a mental health tracking app. You help users understand their emotions, provide coping strategies, and offer supportive guidance.

User's message: "${text}"

Respond as a caring mental health companion. You should:
1. Be empathetic and understanding
2. Provide practical wellness advice when appropriate
3. Ask thoughtful follow-up questions to encourage reflection
4. Suggest healthy coping mechanisms
5. Validate their feelings
6. Keep responses concise but meaningful (2-3 sentences)
7. If they mention serious mental health concerns, gently suggest professional help

Remember: You're not a replacement for professional therapy, but a supportive companion for daily wellness.`,
      })

      return Response.json({ chatResponse })
    }

    if (!hasApiKey) {
      return Response.json({
        ...generateMockAnalysis(text, userMoodRating),
        isDemo: true,
      })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: sentimentSchema,
      prompt: `Analyze the sentiment and emotions in this journal entry. Consider both the text content and the user's self-reported mood rating of ${userMoodRating}/10.

Journal entry: "${text}"

Provide:
1. Overall sentiment (positive, negative, or neutral)
2. Confidence score for the sentiment analysis
3. Detected emotions (be specific - joy, contentment, anxiety, stress, etc.)
4. A calculated mood score from 1-10 that considers both text sentiment and user rating
5. Key phrases that influenced your analysis
6. A brief, empathetic insight about their emotional state
7. 2-3 personalized wellness recommendations

Be compassionate and supportive in your analysis. Focus on mental wellness and emotional understanding.`,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    const { text, userMoodRating } = await request.json() // Declare variables here
    if (error instanceof Error && error.message.includes("API key")) {
      return Response.json({
        ...generateMockAnalysis(text || "", userMoodRating || 5),
        isDemo: true,
        error: "Demo mode: Connect OpenAI API for full AI features",
      })
    }
    return Response.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
