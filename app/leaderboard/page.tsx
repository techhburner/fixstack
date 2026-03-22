"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getUsername } from "@/lib/getUsername"

export default function Leaderboard() {

  const [questionLeaders, setQuestionLeaders] = useState<any[]>([])
  const [solutionLeaders, setSolutionLeaders] = useState<any[]>([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {

    // 🔥 TOP ERROR REPORTERS (by questions)
    const { data: qData } = await supabase
      .from("leaderboard")
      .select(`*, profiles(email)`)
      .order("questions_count", { ascending: false })
      .limit(5)

    // ⚡ TOP SOLUTION VALIDATORS (by solutions)
    const { data: sData } = await supabase
      .from("leaderboard")
      .select(`*, profiles(email)`)
      .order("solutions_count", { ascending: false })
      .limit(5)

    setQuestionLeaders(qData || [])
    setSolutionLeaders(sData || [])
  }

  return (
    <div className="container">

      <h1>🏆 Leaderboard</h1>

      <div style={{
        display: "flex",
        gap: "40px",
        marginTop: "30px",
        flexWrap: "wrap"
      }}>

        {/* 🔥 LEFT SIDE */}
        <div style={{ flex: 1 }}>
          <h2>🔥 Top Error Reporters</h2>

          {questionLeaders.map((u, i) => (
            <div key={i} className="card">
              <h3>
                {i === 0 && "🥇"} {i === 1 && "🥈"} {i === 2 && "🥉"}
                #{i + 1} — {getUsername(u.profiles?.email)}
              </h3>

              <p>Questions: {u.questions_count}</p>
            </div>
          ))}
        </div>


        {/* ⚡ RIGHT SIDE */}
        <div style={{ flex: 1 }}>
          <h2>⚡ Top Solution Validators</h2>

          {solutionLeaders.map((u, i) => (
            <div key={i} className="card">
              <h3>
                {i === 0 && "🥇"} {i === 1 && "🥈"} {i === 2 && "🥉"}
                #{i + 1} — {getUsername(u.profiles?.email)}
              </h3>

              <p>Solutions: {u.solutions_count}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}