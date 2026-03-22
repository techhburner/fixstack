"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [questionsCount, setQuestionsCount] = useState(0)
  const [answersCount, setAnswersCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      // 🔐 Get user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) return

      // 👤 Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profileData)

      // ❓ Count questions
      const { count: qCount } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      setQuestionsCount(qCount || 0)

      // 💡 Count answers
      const { count: aCount } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      setAnswersCount(aCount || 0)
    }

    fetchData()
  }, [])

  if (!user) return <div className="text-white p-6">Loading...</div>

  const name = profile?.username || user.email?.split("@")[0]

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">👤 My Profile</h1>

      {/* Profile Info */}
      <div className="mb-6">
        <p>Name: {name}</p>
        <p>Email: {user.email}</p>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <p>Questions: {questionsCount}</p>
        <p>Solutions: {answersCount}</p>
      </div>
    </div>
  )
}