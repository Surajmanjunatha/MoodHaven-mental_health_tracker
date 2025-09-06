"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, TrendingDown, Brain, ChevronDown, ChevronUp } from "lucide-react"

interface JournalEntry {
  id: number
  content: string
  mood: number
  date: string
  sentiment: string
  emotions: string[]
  moodScore?: number
  confidence?: number
  insights?: string
  recommendations?: string[]
}

const moodEmojis = [
  { value: 1, emoji: "😢" },
  { value: 2, emoji: "😞" },
  { value: 3, emoji: "😔" },
  { value: 4, emoji: "😕" },
  { value: 5, emoji: "😐" },
  { value: 6, emoji: "🙂" },
  { value: 7, emoji: "😊" },
  { value: 8, emoji: "😄" },
  { value: 9, emoji: "😁" },
  { value: 10, emoji: "🤩" },
]

export function RecentEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

  useEffect(() => {
    const loadEntries = () => {
      const savedEntries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
      setEntries(savedEntries.slice(0, 5)) // Show last 5 entries
    }

    loadEntries()

    // Listen for new entries
    const handleEntrySaved = () => loadEntries()
    window.addEventListener("entrySaved", handleEntrySaved)

    return () => window.removeEventListener("entrySaved", handleEntrySaved)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMoodEmoji = (mood: number) => {
    return moodEmojis.find((m) => m.value === mood)?.emoji || "😐"
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 dark:text-green-400"
      case "negative":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  return (
    <Card className="frosted-glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Recent Entries
        </CardTitle>
        <CardDescription>Your latest journal entries and AI insights</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No entries yet</p>
            <p className="text-sm text-muted-foreground">Start by writing your first journal entry!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="frosted-glass p-4 rounded-lg border border-border/30 hover-lift gentle-fade"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{entry.mood}/10</span>
                      {entry.moodScore && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          AI: {entry.moodScore.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {entry.sentiment === "positive" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : entry.sentiment === "negative" ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                    )}
                    <Badge variant="outline" className={`text-xs ${getSentimentColor(entry.sentiment)} border-current`}>
                      {entry.sentiment}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{entry.content}</p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 flex-wrap">
                    {entry.emotions.slice(0, 3).map((emotion) => (
                      <Badge key={emotion} variant="secondary" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                    {entry.emotions.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{entry.emotions.length - 3}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                </div>

                {/* AI Insights Toggle */}
                {entry.insights && (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="text-xs p-1 h-auto"
                    >
                      {expandedEntry === entry.id ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Hide AI Insights
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Show AI Insights
                        </>
                      )}
                    </Button>

                    {expandedEntry === entry.id && (
                      <div className="mt-2 p-3 bg-muted/30 rounded-md">
                        <p className="text-xs text-muted-foreground leading-relaxed">{entry.insights}</p>
                        {entry.confidence && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Confidence: {Math.round(entry.confidence * 100)}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
