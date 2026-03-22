"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Navbar(){

  const router = useRouter()

  async function logout(){
    await supabase.auth.signOut()
    localStorage.removeItem("fixstack_user")
    router.push("/login")
  }

  return (
    <div className="navbar">

      {/* ✅ LOGO */}
      <Link href="/" className="logo">
        FixStack
      </Link>

      <div className="nav-actions">

        {/* ✅ LINKS INSTEAD OF BUTTONS */}
        <Link href="/" className="secondary-btn">
          Dashboard
        </Link>

        <Link href="/ask" className="secondary-btn">
          Ask
        </Link>

        <Link href="/leaderboard" className="secondary-btn">
          Leaderboard
        </Link>

        <Link href="/profile" className="secondary-btn">
          Profile
        </Link>

        {/* 🔥 LOGOUT stays button */}
        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  )
}