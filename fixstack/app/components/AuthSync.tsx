"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthSync() {
  useEffect(() => {
    const syncProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // ✅ Auto create / update profile
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          username: user.email?.split("@")[0],
        })
    }

    syncProfile()
  }, [])

  return null
}