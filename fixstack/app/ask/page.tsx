"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { marketplaces } from "@/lib/marketplaces"

export default function Ask(){

  const [marketplace,setMarketplace] = useState("")
  const [errorCode,setErrorCode] = useState("")
  const [errorMessage,setErrorMessage] = useState("")
  const [comments,setComments] = useState("")
  const [offendingField, setOffendingField] = useState("")
  const [loading, setLoading] = useState(false)

  async function submitQuestion(){

    if(loading) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){
      alert("Login required")
      setLoading(false)
      return
    }

    if(!errorCode || !errorMessage){
      alert("Fill required fields")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("questions").insert({
      user_id: user.id,
      marketplace,
      error_code: errorCode.trim(),
      error_message: errorMessage.trim(),
      offending_field: marketplace === "Amazon" ? offendingField : null,
      comments,
      search_text: (errorCode + " " + errorMessage).toLowerCase()
    })

    if (error) {
      setLoading(false)

      // 🔥 HANDLE DUPLICATE (ERROR CODE ONLY)
      if (error.message.toLowerCase().includes("unique_error_code")) {
        alert("This error code already exists ⚠️")
      } else {
        alert(error.message)
      }
      return
    }

    await supabase.rpc("increment_question", { uid: user.id })

    alert("Error reported 🚀")

    // 🔥 RESET FORM
    setMarketplace("")
    setErrorCode("")
    setErrorMessage("")
    setComments("")
    setOffendingField("")
    setLoading(false)
  }

  return (
    <div className="ask-wrapper">

      <h1>🚨 Report Error</h1>

      <div className="ask-card">

        {/* ROW 1 */}
        <div className="row">
          
          <select
            value={marketplace}
            onChange={(e)=>setMarketplace(e.target.value)}
          >
            <option value="">Select Marketplace</option>

            {marketplaces.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            placeholder="Error Code (e.g. 348978)"
            value={errorCode}
            onChange={(e)=>setErrorCode(e.target.value)}
          />
        </div>

        {/* 🔥 AMAZON ONLY FIELD */}
        {marketplace === "Amazon" && (
          <input
            placeholder="Offending Field (e.g. item_color)"
            value={offendingField}
            onChange={(e)=>setOffendingField(e.target.value)}
          />
        )}

        {/* ROW 2 */}
        <textarea
          placeholder="Error Message"
          value={errorMessage}
          onChange={(e)=>setErrorMessage(e.target.value)}
        />

        {/* ROW 3 */}
        <textarea
          placeholder="What you tried / additional info"
          value={comments}
          onChange={(e)=>setComments(e.target.value)}
        />

        {/* SUBMIT */}
        <button onClick={submitQuestion} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

      </div>

    </div>
  )
}