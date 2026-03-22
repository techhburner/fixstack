"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: any){

  const router = useRouter()
  const pathname = usePathname()

  const [loading,setLoading] = useState(true)

  const publicRoutes = ["/login", "/register"]

  useEffect(() => {
    checkUser()
  }, [pathname])

  async function checkUser(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user && !publicRoutes.includes(pathname)){
      router.push("/login")
    } else {
      setLoading(false)
    }
  }

  if(loading){
    return <p style={{padding:"40px"}}>Loading...</p>
  }

  return children
}