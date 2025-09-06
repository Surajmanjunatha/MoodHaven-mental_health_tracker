"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Save, Sparkles, MessageCircle, Send, Bot, User } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface JournalEntry {
  id: string
  date: string
  mood: number
  moodEmoji: string
  content: string
  sentiment?: {
    score: number
    emotions: string[]
    insights: string[]
  }
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
}

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Terrible" },
  { value: 2, emoji: "😞", label: "Very Bad" },
  { value: 3, emoji: "😔", label: "Bad" },
  { value: 4, emoji: "😕", label: "Poor" },
  { value: 5, emoji: "😐", label: "Neutral" },
  { value: 6, emoji: "🙂", label: "Okay" },
  { value: 7, emoji: "😊", label: "Good" },
  { value: 8, emoji: "😄", label: "Great" },
  { value: 9, emoji: "😁", label: "Excellent" },
  { value: 10, emoji: "🤩", label: "Amazing" },
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState<number>(5)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatting, setIsChatting] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const savedEntries = localStorage.getItem("mind-haven-journal-entries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }

    const savedChat = localStorage.getItem("mind-haven-chat-history")
    if (savedChat) {
      setChatMessages(JSON.parse(savedChat))
    }
  }, [])

  const saveEntry = async () => {
    if (!currentEntry.trim()) return

    setIsAnalyzing(true)

    try {
      // Call AI sentiment analysis
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentEntry }),
      })

      const sentiment = await response.json()

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood,
        moodEmoji: moodEmojis.find((m) => m.value === selectedMood)?.emoji || "😐",
        content: currentEntry,
        sentiment,
      }

      const updatedEntries = [newEntry, ...entries]
      setEntries(updatedEntries)
      localStorage.setItem("mind-haven-journal-entries", JSON.stringify(updatedEntries))

      setCurrentEntry("")
      setSelectedMood(5)

      if (sentiment && sentiment.insights) {
        const summaryMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "ai",
          content: `I've analyzed your journal entry. Here's what I noticed: ${sentiment.insights.join(". ")}. Your mood score of ${selectedMood}/10 suggests you're feeling ${moodEmojis.find((m) => m.value === selectedMood)?.label.toLowerCase()}. Would you like to talk about anything specific?`,
          timestamp: new Date().toISOString(),
        }

        const updatedChat = [...chatMessages, summaryMessage]
        setChatMessages(updatedChat)
        localStorage.setItem("mind-haven-chat-history", JSON.stringify(updatedChat))
        setShowChat(true)
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...chatMessages, userMessage]
    setChatMessages(updatedMessages)
    setChatInput("")
    setIsChatting(true)

    try {
      // Get recent entries for context
      const recentEntries = entries
        .slice(0, 3)
        .map(
          (entry) =>
            `Date: ${new Date(entry.date).toLocaleDateString()}, Mood: ${entry.mood}/10, Content: ${entry.content.substring(0, 200)}...`,
        )
        .join("\n")

      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `User question: ${chatInput}\n\nRecent journal context:\n${recentEntries}`,
          isChat: true,
        }),
      })

      const aiResponse = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          aiResponse.chatResponse ||
          "I'm here to help you process your thoughts and emotions. How are you feeling today?",
        timestamp: new Date().toISOString(),
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setChatMessages(finalMessages)
      localStorage.setItem("mind-haven-chat-history", JSON.stringify(finalMessages))
    } catch (error) {
      console.error("Error in chat:", error)
    } finally {
      setIsChatting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">Daily Journal</h1>
          <p className="text-muted-foreground">Express your thoughts and track your emotional journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Journal Entry Section */}
          <div className="space-y-6">
            {/* New Entry Form */}
            <Card className="glass-module gentle-fade">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mood Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">How are you feeling today?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {moodEmojis.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        size="sm"
                        className={`h-12 text-lg glass-module hover-lift ${selectedMood === mood.value ? "ring-2 ring-primary pulse-glow" : ""}`}
                        onClick={() => setSelectedMood(mood.value)}
                      >
                        {mood.emoji}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {moodEmojis.find((m) => m.value === selectedMood)?.label} ({selectedMood}/10)
                  </p>
                </div>

                {/* Journal Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
                  <Textarea
                    placeholder="Write about your day, feelings, thoughts, or anything that comes to mind..."
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    className="min-h-[150px] glass-overlay"
                  />
                </div>

                <Button
                  onClick={saveEntry}
                  disabled={!currentEntry.trim() || isAnalyzing}
                  className="w-full hover-lift glass-module bg-gradient-to-r from-primary to-accent text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Previous Entries */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold gradient-text">Previous Entries</h2>
              {entries.length === 0 ? (
                <Card className="glass-module">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No entries yet. Start writing your first journal entry!</p>
                  </CardContent>
                </Card>
              ) : (
                entries.slice(0, 3).map((entry) => (
                  <Card key={entry.id} className="glass-module gentle-fade hover-lift">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl float-animation">{entry.moodEmoji}</span>
                          <div>
                            <p className="font-medium">
                              {new Date(entry.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">Mood: {entry.mood}/10</p>
                          </div>
                        </div>
                        {entry.sentiment && (
                          <Badge variant="secondary" className="glass-overlay">
                            {entry.sentiment.score > 0.1
                              ? "Positive"
                              : entry.sentiment.score < -0.1
                                ? "Negative"
                                : "Neutral"}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed mb-3">{entry.content}</p>
                      {entry.sentiment && entry.sentiment.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.sentiment.emotions.slice(0, 3).map((emotion, index) => (
                            <Badge key={index} variant="outline" className="text-xs glass-overlay">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* AI Chat Section */}
          <div className="space-y-6">
            <Card className="glass-module gentle-fade">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-accent animate-pulse" />
                    <span className="gradient-text">AI Wellness Assistant</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(!showChat)}
                    className="glass-overlay hover-lift"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              {showChat && (
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-64 overflow-y-auto space-y-3 p-3 glass-overlay rounded-lg">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Bot className="w-8 h-8 mx-auto mb-2 text-accent" />
                        <p>
                          Hi! I'm your AI wellness assistant. I can help you understand your emotions, provide coping
                          strategies, and answer questions about your mental health journey.
                        </p>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center glass-module ${message.type === "user" ? "bg-primary/20" : "bg-accent/20"}`}
                            >
                              {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div
                              className={`p-3 rounded-lg glass-module ${message.type === "user" ? "bg-primary/10" : "bg-accent/10"}`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me about your mood, coping strategies, or anything on your mind..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="glass-overlay"
                    />
                    <Button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatting}
                      size="icon"
                      className="glass-module hover-lift bg-gradient-to-r from-accent to-primary text-white"
                    >
                      {isChatting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
