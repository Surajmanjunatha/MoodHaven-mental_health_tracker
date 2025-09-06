"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BookOpen, ExternalLink, Star, Clock, Users } from "lucide-react"

const selfHelpBooks = [
  {
    title: "The Anxiety and Worry Workbook",
    author: "David A. Clark & Aaron T. Beck",
    rating: 4.6,
    category: "Anxiety",
    description: "Practical cognitive behavioral therapy techniques for managing anxiety and worry.",
    readTime: "6-8 weeks",
    difficulty: "Beginner",
    amazonLink: "https://amazon.com/anxiety-worry-workbook",
  },
  {
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    rating: 4.5,
    category: "Depression",
    description: "Revolutionary approach to treating depression using cognitive behavioral therapy.",
    readTime: "4-6 weeks",
    difficulty: "Beginner",
    amazonLink: "https://amazon.com/feeling-good-mood-therapy",
  },
  {
    title: "The Mindful Way Through Depression",
    author: "Williams, Teasdale, Segal & Kabat-Zinn",
    rating: 4.4,
    category: "Mindfulness",
    description: "Combines mindfulness meditation with cognitive therapy for depression prevention.",
    readTime: "8 weeks",
    difficulty: "Intermediate",
    amazonLink: "https://amazon.com/mindful-way-through-depression",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.8,
    category: "Self-Improvement",
    description: "Proven framework for improving every day through tiny changes in habits.",
    readTime: "3-4 weeks",
    difficulty: "Beginner",
    amazonLink: "https://amazon.com/atomic-habits",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    rating: 4.7,
    category: "Trauma",
    description: "Groundbreaking exploration of how trauma affects the body and mind.",
    readTime: "6-8 weeks",
    difficulty: "Advanced",
    amazonLink: "https://amazon.com/body-keeps-score",
  },
  {
    title: "Daring Greatly",
    author: "Brené Brown",
    rating: 4.5,
    category: "Vulnerability",
    description: "How courage, vulnerability, and shame resilience can transform your life.",
    readTime: "3-4 weeks",
    difficulty: "Beginner",
    amazonLink: "https://amazon.com/daring-greatly",
  },
]

const mentalHealthResources = [
  {
    title: "Crisis Text Line",
    description: "Free, 24/7 support for those in crisis",
    contact: "Text HOME to 741741",
    type: "Crisis Support",
  },
  {
    title: "National Suicide Prevention Lifeline",
    description: "Free and confidential emotional support",
    contact: "988",
    type: "Crisis Support",
  },
  {
    title: "Psychology Today",
    description: "Find therapists and mental health professionals",
    contact: "psychologytoday.com",
    type: "Professional Help",
  },
  {
    title: "NAMI (National Alliance on Mental Illness)",
    description: "Education, support, and advocacy",
    contact: "nami.org",
    type: "Support Groups",
  },
]

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Mental Health Resources</h1>
          <p className="text-muted-foreground">Curated books and resources to support your mental wellness journey</p>
        </div>

        {/* Self-Help Books */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Recommended Self-Help Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selfHelpBooks.map((book, index) => (
              <Card key={index} className="glass-module gentle-fade hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="glass-overlay">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{book.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {book.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {book.difficulty}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full glass-overlay hover-lift bg-transparent"
                    onClick={() => window.open(book.amazonLink, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Amazon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mental Health Resources */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Crisis Support & Professional Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentalHealthResources.map((resource, index) => (
              <Card key={index} className="glass-module gentle-fade hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <Badge variant="outline" className="glass-overlay">
                      {resource.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed">{resource.description}</p>
                  <div className="p-3 bg-primary/10 rounded-lg glass-overlay">
                    <p className="font-medium text-sm">{resource.contact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <Card className="glass-module border-amber-200/20 bg-amber-50/10">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Important:</strong> These resources are for informational purposes only and are not a substitute
              for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis,
              please contact emergency services or a crisis hotline immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
