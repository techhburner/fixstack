"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter()

  const [questions, setQuestions] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [search, questions])

  async function fetchQuestions() {

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setQuestions(data || [])
      setFiltered(data || [])
    }

    setLoading(false)
  }

  function handleSearch() {

    if (!search) {
      setFiltered(questions)
      return
    }

    const lower = search.toLowerCase()

    const result = questions.filter(q =>
      q.error_code?.toLowerCase().includes(lower) ||
      q.error_message?.toLowerCase().includes(lower) ||
      q.marketplace?.toLowerCase().includes(lower)
    )

    setFiltered(result)
  }

  return (
    <div className="container">

      <h1 className="title">
        🔥 FixStack Dashboard
      </h1>

      {/* 🔍 SEARCH BAR */}
      <input
        className="search"
        placeholder="Search errors, codes, marketplace..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {!loading && filtered.length === 0 && (
        <p>No errors found</p>
      )}

      {/* 🧱 PREMIUM CARDS */}
      {filtered.map((q) => (
        <div
          key={q.id}
          className="card"
          onClick={() => router.push(`/question/${q.id}`)}
        >

          <h3 style={{ marginBottom: "6px" }}>
            {q.error_code}
          </h3>

          <p style={{ opacity: 0.85 }}>
            {q.error_message}
          </p>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
            fontSize: "12px",
            opacity: 0.6
          }}>
            <span>📦 {q.marketplace}</span>
            <span>
              {new Date(q.created_at).toLocaleString()}
            </span>
          </div>

        </div>
      ))}

    </div>
  )
}