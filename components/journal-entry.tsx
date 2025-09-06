"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Sparkles, Brain, Heart, Lightbulb } from "lucide-react"

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Terrible" },
  { value: 2, emoji: "😞", label: "Very Bad" },
  { value: 3, emoji: "😔", label: "Bad" },
  { value: 4, emoji: "😕", label: "Poor" },
  { value: 5, emoji: "😐", label: "Okay" },
  { value: 6, emoji: "🙂", label: "Good" },
  { value: 7, emoji: "😊", label: "Great" },
  { value: 8, emoji: "😄", label: "Very Good" },
  { value: 9, emoji: "😁", label: "Excellent" },
  { value: 10, emoji: "🤩", label: "Amazing" },
]

interface AnalysisResult {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  emotions: string[]
  moodScore: number
  keyPhrases: string[]
  insights: string
  recommendations: string[]
}

export function JournalEntry() {
  const [entry, setEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleSave = async () => {
    if (!entry.trim() || selectedMood === null) return

    setIsAnalyzing(true)
    setShowAnalysis(false)

    try {
      // Call AI sentiment analysis API
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: entry,
          userMoodRating: selectedMood,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment")
      }

      const analysis = await response.json()
      setAnalysisResult(analysis)

      const newEntry = {
        id: Date.now(),
        content: entry,
        mood: selectedMood,
        date: new Date().toISOString(),
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        moodScore: analysis.moodScore,
        confidence: analysis.confidence,
        keyPhrases: analysis.keyPhrases,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
      }

      // Save to localStorage
      const existingEntries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
      existingEntries.unshift(newEntry)
      localStorage.setItem("mind-haven-entries", JSON.stringify(existingEntries))

      setShowAnalysis(true)

      // Trigger a custom event to update recent entries
      window.dispatchEvent(new CustomEvent("entrySaved"))
    } catch (error) {
      console.error("Analysis failed:", error)
      // Fallback to basic save without AI analysis
      const newEntry = {
        id: Date.now(),
        content: entry,
        mood: selectedMood,
        date: new Date().toISOString(),
        sentiment: "neutral",
        emotions: ["reflective"],
      }

      const existingEntries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
      existingEntries.unshift(newEntry)
      localStorage.setItem("mind-haven-entries", JSON.stringify(existingEntries))

      window.dispatchEvent(new CustomEvent("entrySaved"))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewEntry = () => {
    setEntry("")
    setSelectedMood(null)
    setAnalysisResult(null)
    setShowAnalysis(false)
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
    <div className="space-y-6">
      <Card className="frosted-glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Today's Journal Entry
          </CardTitle>
          <CardDescription>
            Share your thoughts and feelings. Our AI will help you understand your emotional patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showAnalysis ? (
            <>
              {/* Mood Rating */}
              <div className="space-y-3">
                <Label className="text-base font-medium">How are you feeling today? (1-10)</Label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {moodEmojis.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      className={`frosted-glass aspect-square p-2 flex flex-col items-center justify-center hover-lift gentle-fade ${
                        selectedMood === mood.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent hover:bg-accent/10"
                      }`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.value}</span>
                    </Button>
                  ))}
                </div>
                {selectedMood && (
                  <p className="text-sm text-muted-foreground text-center">
                    You selected: {moodEmojis.find((m) => m.value === selectedMood)?.emoji}{" "}
                    {moodEmojis.find((m) => m.value === selectedMood)?.label}
                  </p>
                )}
              </div>

              {/* Journal Text */}
              <div className="space-y-3">
                <Label htmlFor="journal-entry" className="text-base font-medium">
                  What's on your mind?
                </Label>
                <Textarea
                  id="journal-entry"
                  placeholder="Today I felt... I experienced... I'm grateful for..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="frosted-glass border-border/50 focus:border-primary gentle-fade min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted-foreground">{entry.length}/1000 characters</p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={!entry.trim() || selectedMood === null || isAnalyzing}
                className="w-full hover-lift gentle-fade"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing your emotions...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Analyze Entry
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Entry Saved Successfully!</h3>
                <p className="text-muted-foreground">Here's what our AI discovered about your emotional state:</p>
              </div>

              <Button onClick={handleNewEntry} variant="outline" className="w-full frosted-glass bg-transparent">
                Write Another Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {showAnalysis && analysisResult && (
        <Card className="frosted-glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Analysis Results
            </CardTitle>
            <CardDescription>
              Our AI analyzed your journal entry to provide insights into your emotional well-being.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sentiment & Mood Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="frosted-glass p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Sentiment Analysis
                </h4>
                <div className="flex items-center gap-2">
                  <Badge className={`${getSentimentColor(analysisResult.sentiment)} bg-transparent border-current`}>
                    {analysisResult.sentiment}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(analysisResult.confidence * 100)}% confidence
                  </span>
                </div>
              </div>

              <div className="frosted-glass p-4 rounded-lg">
                <h4 className="font-medium mb-2">AI Mood Score</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {moodEmojis.find((m) => m.value === Math.round(analysisResult.moodScore))?.emoji}
                  </span>
                  <span className="text-lg font-semibold">{analysisResult.moodScore.toFixed(1)}/10</span>
                </div>
              </div>
            </div>

            {/* Detected Emotions */}
            <div className="frosted-glass p-4 rounded-lg">
              <h4 className="font-medium mb-3">Detected Emotions</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.emotions.map((emotion, index) => (
                  <Badge key={index} variant="secondary" className="frosted-glass">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="frosted-glass p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                AI Insights
              </h4>
              <p className="text-muted-foreground leading-relaxed">{analysisResult.insights}</p>
            </div>

            {/* Wellness Recommendations */}
            <div className="frosted-glass p-4 rounded-lg">
              <h4 className="font-medium mb-3">Wellness Recommendations</h4>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Phrases */}
            {analysisResult.keyPhrases.length > 0 && (
              <div className="frosted-glass p-4 rounded-lg">
                <h4 className="font-medium mb-3">Key Phrases</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keyPhrases.map((phrase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      "{phrase}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
