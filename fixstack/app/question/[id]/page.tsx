"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function QuestionPage() {

  const { id } = useParams()

  const [question, setQuestion] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [newAnswer, setNewAnswer] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {

    const { data: q } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single()

    const { data: a } = await supabase
      .from("answers")
      .select("*")
      .eq("question_id", id)
      .order("upvotes", { ascending: false })

    setQuestion(q)
    setAnswers(a || [])
  }

  async function submitAnswer() {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Login required")
      return
    }

    if (!newAnswer) return

    const { error } = await supabase.from("answers").insert({
      question_id: id,
      user_id: user.id,
      answer: newAnswer
    })

    if (error) {
      console.error(error)
      alert("Error submitting answer")
      return
    }

    await supabase.rpc("increment_solution", {
      uid: user.id
    })

    setNewAnswer("")
    fetchData()
  }

  async function upvoteAnswer(answer:any){

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data: existing } = await supabase
      .from("answer_votes")
      .select("*")
      .eq("answer_id", answer.id)
      .eq("user_id", user.id)
      .maybeSingle()

    if(existing){
      alert("Already upvoted")
      return
    }

    await supabase.from("answer_votes").insert({
      answer_id: answer.id,
      user_id: user.id
    })

    await supabase
      .from("answers")
      .update({
        upvotes: (answer.upvotes || 0) + 1
      })
      .eq("id", answer.id)

    await supabase.rpc("increment_upvote",{
      uid: answer.user_id
    })

    fetchData()
  }

  async function validateAnswer(answer:any){

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const created = new Date(answer.created_at)
    const now = new Date()

    const diffHours =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60)

    if(diffHours < 24){
      alert("Validate after 24 hours")
      return
    }

    await supabase
      .from("answers")
      .update({
        is_validated: true,
        validated_by: user.id
      })
      .eq("id", answer.id)

    await supabase.rpc("increment_solution",{
      uid: answer.user_id
    })

    fetchData()
  }

  if (!question) return <p className="container">Loading...</p>

  return (
    <div className="container">

      {/* 🔥 QUESTION */}
      <div className="card">

        <h2>{question.error_code}</h2>

        <p>{question.error_message}</p>

        {/* 🔥 AMAZON ONLY OFFENDING FIELD */}
        {question.marketplace === "Amazon" && question.offending_field && (
          <div style={{ marginTop: "12px" }}>

            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              Offending Field
            </p>

            <div
              style={{
                marginTop: "4px",
                padding: "6px 12px",
                borderRadius: "10px",
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.4)",
                display: "inline-block",
                fontWeight: "500",
                color: "#c4b5fd"
              }}
            >
              {question.offending_field}
            </div>

          </div>
        )}

        <p style={{ marginTop: "10px" }}>
          💬 {question.comments}
        </p>

        <p>📦 {question.marketplace}</p>

      </div>

      {/* 🔥 ANSWERS */}
      <h3 style={{marginTop:"30px"}}>
        💡 Solutions ({answers.length})
      </h3>

      {answers.map((a,index)=>{

        const isBest = a.is_validated
        const isTop = index === 0 && a.upvotes > 0

        return(
          <div key={a.id} className="card">

            {isBest && <p>✅ Validated Solution</p>}
            {!isBest && isTop && <p>⭐ Top Voted</p>}

            <p>{a.answer}</p>

            <div style={{display:"flex", justifyContent:"space-between"}}>

              <span>👍 {a.upvotes || 0}</span>

              <div style={{display:"flex", gap:"10px"}}>

                <button onClick={()=>upvoteAnswer(a)}>
                  👍 Upvote
                </button>

                {!a.is_validated && (
                  <button onClick={()=>validateAnswer(a)}>
                    ✅ Validate
                  </button>
                )}

              </div>

            </div>

          </div>
        )
      })}

      {/* 🔥 ADD ANSWER */}
      <div className="card">

        <textarea
          placeholder="Write your solution..."
          value={newAnswer}
          onChange={(e)=>setNewAnswer(e.target.value)}
        />

        <button onClick={submitAnswer}>
          Submit Solution
        </button>

      </div>

    </div>
  )
}