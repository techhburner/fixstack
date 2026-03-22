"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

export default function Verify(){

  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  async function verifyOtp(){

    if(!otp){
      alert("Enter OTP")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email"
    })

    setLoading(false)

    if(error){
      alert(error.message)
      return
    }

    alert("Login successful 🚀")

    // ✅ HARD REDIRECT (FIXED)
    window.location.href = "/"
  }

  return (
    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>Enter OTP 🔐</h2>

        <p className="auth-sub">
          We sent a code to <b>{email}</b>
        </p>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
        />

        <button onClick={verifyOtp}>
          {loading ? "Verifying..." : "Verify"}
        </button>

      </div>

    </div>
  )
}