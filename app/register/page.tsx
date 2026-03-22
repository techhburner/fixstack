"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Register(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function register(){

    if(loading) return // 🔥 prevent multiple clicks

    if(!email || !password){
      alert("Enter email & password")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if(error){
      alert(error.message)
      return
    }

    // 🔥 detect existing user
    if(data?.user?.identities?.length === 0){
      alert("User already exists. Please login.")
      return
    }

    alert("Account created 🚀")

    router.push("/login")
  }

  return (
    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>Create Account</h2>

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

        <button onClick={register} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        {/* 🔥 LOGIN REDIRECT BUTTON */}
        <button
          className="secondary-btn"
          onClick={()=>router.push("/login")}
        >
          Already have an account? Login
        </button>

      </div>

    </div>
  )
}