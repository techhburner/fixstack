"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: any){

  const router = useRouter()
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){
      router.push("/login")
    } else {
      setLoading(false)
    }
  }

  if(loading){
    return <p style={{padding:"40px"}}>Checking auth...</p>
  }

  return children
}