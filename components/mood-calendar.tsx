"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MoodEntry {
  date: string
  mood: number
  sentiment: string
}

export function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
    setEntries(storedEntries)
  }, [])

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩", "🥳"]
    return emojis[mood - 1] || "😐"
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return "text-red-500"
    if (mood <= 5) return "text-orange-500"
    if (mood <= 7) return "text-yellow-500"
    return "text-green-500"
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEntryForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
    return entries.find((entry) => new Date(entry.date).toDateString() === dateStr)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <Card className="glass-module hover-lift gentle-fade shimmer">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary animate-pulse" />
            <span className="gradient-text">Mood Calendar</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="glass-overlay hover-lift"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[140px] text-center gradient-text">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="glass-overlay hover-lift"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-12" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const entry = getEntryForDate(day)
            const isToday =
              new Date().toDateString() ===
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

            return (
              <div
                key={day}
                className={`h-12 flex flex-col items-center justify-center rounded-lg glass-overlay hover-lift gentle-fade ${
                  isToday ? "ring-2 ring-primary pulse-glow" : ""
                } ${entry ? "bg-gradient-to-br from-primary/10 to-accent/10" : ""}`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {day}
                </span>
                {entry && (
                  <div className="flex flex-col items-center">
                    <span className="text-lg leading-none float-animation">{getMoodEmoji(entry.mood)}</span>
                    <span className={`text-xs font-bold ${getMoodColor(entry.mood)}`}>{entry.mood}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <span>Low (1-3)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/40"></div>
            <span>Fair (4-5)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
            <span>Good (6-7)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
            <span>Great (8-10)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
