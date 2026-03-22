"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function login(){

    if(!email || !password){
      alert("Enter email & password")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if(error){
      alert(error.message)
      return
    }

    window.location.href = "/"
  }

  return (
    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>Welcome back 👋</h2>

        {/* 🔹 INPUTS WRAPPED */}
        <div className="auth-inputs">

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

        </div>

        <button onClick={login}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔥 REGISTER BUTTON */}
        <button
          className="secondary-btn"
          onClick={()=>router.push("/register")}
        >
          Create Account
        </button>

      </div>

    </div>
  )
}