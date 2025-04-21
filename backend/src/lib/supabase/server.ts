import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Request, Response } from 'express'

interface Cookie {
    name: string
    value: string
    options: CookieOptions
}

export function createServerSupabaseClient(req: Request, res: Response) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies[name]
                },
                set(name: string, value: string, options: CookieOptions) {
                    res.cookie(name, value, options)
                },
                remove(name: string, options: CookieOptions) {
                    res.clearCookie(name, options)
                }
            },
        }
    )
} 