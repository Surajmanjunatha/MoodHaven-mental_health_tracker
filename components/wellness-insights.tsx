"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, AlertTriangle, TrendingUp, Heart } from "lucide-react"

interface JournalEntry {
  mood: number
  sentiment: string
  date: string
  emotions: string[]
}

interface Insight {
  type: "warning" | "positive" | "neutral"
  title: string
  description: string
  icon: any
}

export function WellnessInsights() {
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    const generateInsights = () => {
      const savedEntries: JournalEntry[] = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")

      if (savedEntries.length === 0) return

      const newInsights: Insight[] = []

      // Recent mood trend analysis
      const recentEntries = savedEntries.slice(0, 5)
      const avgRecentMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length

      if (avgRecentMood < 4) {
        newInsights.push({
          type: "warning",
          title: "Low Mood Pattern",
          description:
            "Your recent mood scores have been below 4/10. Consider reaching out to someone or practicing self-care.",
          icon: AlertTriangle,
        })
      } else if (avgRecentMood > 7) {
        newInsights.push({
          type: "positive",
          title: "Great Mood Streak",
          description: "You've been feeling great lately! Keep up the positive momentum.",
          icon: TrendingUp,
        })
      }

      // Negative sentiment streak
      const recentNegative = recentEntries.filter((entry) => entry.sentiment === "negative").length
      if (recentNegative >= 3) {
        newInsights.push({
          type: "warning",
          title: "Negative Sentiment Alert",
          description:
            "You've had several negative entries recently. Consider talking to a mental health professional.",
          icon: AlertTriangle,
        })
      }

      // Positive patterns
      const positiveEntries = savedEntries.filter((entry) => entry.sentiment === "positive").length
      const positiveRatio = positiveEntries / savedEntries.length

      if (positiveRatio > 0.7) {
        newInsights.push({
          type: "positive",
          title: "Positive Outlook",
          description: `${Math.round(positiveRatio * 100)}% of your entries show positive sentiment. Great job maintaining a positive mindset!`,
          icon: Heart,
        })
      }

      // Journaling consistency
      const daysSinceFirst = Math.floor(
        (Date.now() - new Date(savedEntries[savedEntries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24),
      )
      const entriesPerDay = savedEntries.length / Math.max(daysSinceFirst, 1)

      if (entriesPerDay > 0.8) {
        newInsights.push({
          type: "positive",
          title: "Consistent Journaling",
          description:
            "You're maintaining great journaling consistency. This habit supports your mental wellness journey.",
          icon: Lightbulb,
        })
      }

      // Emotion diversity
      const allEmotions = savedEntries.flatMap((entry) => entry.emotions || [])
      const uniqueEmotions = new Set(allEmotions).size

      if (uniqueEmotions > 10) {
        newInsights.push({
          type: "neutral",
          title: "Emotional Awareness",
          description: `You've expressed ${uniqueEmotions} different emotions. This shows good emotional awareness and vocabulary.`,
          icon: Lightbulb,
        })
      }

      setInsights(newInsights.slice(0, 4)) // Show max 4 insights
    }

    generateInsights()
    window.addEventListener("entrySaved", generateInsights)
    return () => window.removeEventListener("entrySaved", generateInsights)
  }, [])

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-red-200 dark:border-red-800"
      case "positive":
        return "border-green-200 dark:border-green-800"
      default:
        return "border-blue-200 dark:border-blue-800"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-red-600 dark:text-red-400"
      case "positive":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  return (
    <Card className="frosted-glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Wellness Insights
        </CardTitle>
        <CardDescription>AI-powered insights about your mental wellness patterns</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No insights available yet</p>
            <p className="text-sm text-muted-foreground">Keep journaling to unlock personalized wellness insights!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} className={`frosted-glass border ${getInsightColor(insight.type)}`}>
                <insight.icon className={`h-4 w-4 ${getIconColor(insight.type)}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getIconColor(insight.type)} border-current`}>
                      {insight.type}
                    </Badge>
                  </div>
                  <AlertDescription className="text-xs leading-relaxed">{insight.description}</AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
