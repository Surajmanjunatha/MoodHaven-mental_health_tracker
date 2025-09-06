"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Brain, Home, BookOpen, BarChart3, Settings, LogOut, Heart, Shield } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("mind-haven-user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("mind-haven-user")
    router.push("/")
  }

  const rightNavItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  const mainNavItems = [
    { icon: BookOpen, label: "Journal", href: "/dashboard/journal" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Heart, label: "Coping Tools", href: "/dashboard/coping" },
    { icon: Shield, label: "Resources", href: "/dashboard/resources" },
  ]

  return (
    <div className="min-h-screen">
      <nav className="glass-module gentle-fade sticky top-0 z-50 border-b border-white/10 pulse-glow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-emerald-400 rounded-2xl flex items-center justify-center float-animation shimmer">
              <Brain className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <span className="text-3xl font-bold gradient-text">Mind Haven</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              {rightNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className={`glass-module gentle-fade hover-lift shimmer ${
                      pathname === item.href
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-2xl pulse-glow"
                        : "bg-white/5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="gentle-fade hover-lift glass-module hover:bg-destructive/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="sticky top-[89px] z-40 glass-overlay border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "outline"}
                  size="lg"
                  className={`glass-module gentle-fade hover-lift shimmer ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-primary via-accent to-emerald-400 text-white shadow-2xl pulse-glow scale-105"
                      : "!bg-white/95 !text-gray-800 hover:!bg-gradient-to-r hover:!from-primary/20 hover:!via-accent/15 hover:!to-emerald-400/20 hover:!text-primary dark:!bg-gray-800/95 dark:!text-gray-100 dark:hover:!text-cyan-300 !border-gray-300/50 dark:!border-gray-600/50"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
