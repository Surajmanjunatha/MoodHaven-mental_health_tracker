"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Heart, Lightbulb, Play, RotateCcw, Timer } from "lucide-react"

const motivationalQuotes = [
  "You are stronger than you think and more capable than you imagine.",
  "Every small step forward is progress worth celebrating.",
  "Your mental health is just as important as your physical health.",
  "It's okay to not be okay. What matters is that you're trying.",
  "You have survived 100% of your worst days. You're doing great.",
  "Healing isn't linear, and that's perfectly normal.",
  "You are worthy of love, care, and compassion - especially from yourself.",
]

const copingTechniques = [
  {
    title: "4-7-8 Breathing",
    description: "A simple breathing technique to reduce anxiety and promote relaxation",
    category: "Breathing",
    duration: "2-5 minutes",
    steps: [
      "Exhale completely through your mouth",
      "Close your mouth and inhale through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through your mouth for 8 counts",
      "Repeat 3-4 times",
    ],
  },
  {
    title: "5-4-3-2-1 Grounding",
    description: "Use your senses to ground yourself in the present moment",
    category: "Mindfulness",
    duration: "3-5 minutes",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax muscle groups to reduce physical tension",
    category: "Relaxation",
    duration: "10-15 minutes",
    steps: [
      "Start with your toes, tense for 5 seconds then relax",
      "Move to your calves, tense and relax",
      "Continue with thighs, abdomen, hands, arms",
      "Finish with shoulders, neck, and face",
      "Notice the difference between tension and relaxation",
    ],
  },
  {
    title: "Mindful Walking",
    description: "Combine gentle movement with mindfulness practice",
    category: "Movement",
    duration: "5-20 minutes",
    steps: [
      "Find a quiet space to walk slowly",
      "Focus on the sensation of your feet touching the ground",
      "Notice your breathing rhythm",
      "Observe your surroundings without judgment",
      "Return attention to walking when mind wanders",
    ],
  },
]

export default function CopingToolsPage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [selectedTechnique, setSelectedTechnique] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const getNewQuote = () => {
    const newIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setCurrentQuote(newIndex)
  }

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60)
    setIsTimerRunning(true)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Coping Tools & Motivation</h1>
          <p className="text-muted-foreground">Practical techniques and inspiration for your mental wellness journey</p>
        </div>

        {/* Daily Motivation */}
        <Card className="glass-module gentle-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <blockquote className="text-lg font-medium leading-relaxed italic">
              "{motivationalQuotes[currentQuote]}"
            </blockquote>
            <Button onClick={getNewQuote} variant="outline" className="glass-overlay hover-lift bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </CardContent>
        </Card>

        {/* Coping Techniques */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Coping Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {copingTechniques.map((technique, index) => (
              <Card key={index} className="glass-module gentle-fade hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{technique.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                    </div>
                    <Badge variant="secondary" className="glass-overlay">
                      {technique.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    {technique.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTechnique === index ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Steps:</h4>
                      <ol className="space-y-2 text-sm">
                        {technique.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                              {stepIndex + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {/* Timer */}
                      {timeLeft > 0 && (
                        <div className="text-center p-4 bg-primary/10 rounded-lg glass-overlay">
                          <div className="text-2xl font-mono font-bold text-primary">{formatTime(timeLeft)}</div>
                          <p className="text-sm text-muted-foreground">Time remaining</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => startTimer(5)} disabled={isTimerRunning} className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Start 5min Timer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTechnique(null)}
                          className="glass-overlay"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setSelectedTechnique(index)} className="w-full hover-lift">
                      <Play className="w-4 h-4 mr-2" />
                      Start Technique
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <Card className="glass-module gentle-fade">
          <CardHeader>
            <CardTitle>Quick Coping Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Take 3 deep breaths",
                "Drink a glass of water",
                "Step outside for fresh air",
                "Listen to calming music",
                "Write down 3 things you're grateful for",
                "Call a trusted friend or family member",
              ].map((tip, index) => (
                <div key={index} className="p-3 bg-card/50 rounded-lg glass-overlay text-sm">
                  {tip}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
