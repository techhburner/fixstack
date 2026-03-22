import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hhqvpbigghbvzyqciudg.supabase.co"

const supabaseKey = "sb_publishable_NkSCfxUAOv4CpCSfETvuPA_8X9z1r8M"

export const supabase = createClient(supabaseUrl, supabaseKey)