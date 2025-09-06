"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, Brain, Heart, Target } from "lucide-react"

interface JournalEntry {
  id: number
  mood: number
  date: string
  sentiment: string
  moodScore?: number
}

export function MoodStats() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState({
    averageMood: 0,
    averageAIMood: 0,
    totalEntries: 0,
    positiveEntries: 0,
    moodTrend: 0,
    streakDays: 0,
  })

  useEffect(() => {
    const loadEntries = () => {
      const savedEntries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
      setEntries(savedEntries)

      if (savedEntries.length > 0) {
        const avgMood =
          savedEntries.reduce((sum: number, entry: JournalEntry) => sum + entry.mood, 0) / savedEntries.length
        const avgAIMood =
          savedEntries
            .filter((entry: JournalEntry) => entry.moodScore)
            .reduce((sum: number, entry: JournalEntry) => sum + (entry.moodScore || 0), 0) /
            savedEntries.filter((entry: JournalEntry) => entry.moodScore).length || 0

        const positiveCount = savedEntries.filter((entry: JournalEntry) => entry.sentiment === "positive").length

        // Calculate trend (last 3 vs previous 3 entries)
        const recent = savedEntries.slice(0, 3)
        const previous = savedEntries.slice(3, 6)
        const recentAvg = recent.reduce((sum: number, entry: JournalEntry) => sum + entry.mood, 0) / recent.length || 0
        const previousAvg =
          previous.reduce((sum: number, entry: JournalEntry) => sum + entry.mood, 0) / previous.length || 0
        const trend = recentAvg - previousAvg

        // Calculate streak (consecutive days with entries)
        const today = new Date()
        let streak = 0
        for (let i = 0; i < savedEntries.length; i++) {
          const entryDate = new Date(savedEntries[i].date)
          const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysDiff === i) {
            streak++
          } else {
            break
          }
        }

        setStats({
          averageMood: avgMood,
          averageAIMood: avgAIMood,
          totalEntries: savedEntries.length,
          positiveEntries: positiveCount,
          moodTrend: trend,
          streakDays: streak,
        })
      }
    }

    loadEntries()
    window.addEventListener("entrySaved", loadEntries)
    return () => window.removeEventListener("entrySaved", loadEntries)
  }, [])

  const statCards = [
    {
      title: "Average Mood",
      value: stats.averageMood.toFixed(1),
      subtitle: "Your self-rating",
      icon: Heart,
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "AI Mood Score",
      value: stats.averageAIMood.toFixed(1),
      subtitle: "AI analysis average",
      icon: Brain,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Entries",
      value: stats.totalEntries.toString(),
      subtitle: `${stats.positiveEntries} positive`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Current Streak",
      value: `${stats.streakDays}d`,
      subtitle: "Consecutive days",
      icon: Target,
      color: "text-green-600 dark:text-green-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="frosted-glass border-0 hover-lift gentle-fade">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.title === "Average Mood" && stats.moodTrend !== 0 && (
                    <div
                      className={`flex items-center text-sm ${stats.moodTrend > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stats.moodTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stats.moodTrend).toFixed(1)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
