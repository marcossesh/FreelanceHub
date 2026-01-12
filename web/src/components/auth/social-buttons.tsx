"use client"

import { signIn } from "next-auth/react"
import { Github, Mail } from "lucide-react"

export function SocialButtons({ mode = "login" }: { mode?: "login" | "register" }) {
    const handleSignIn = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/dashboard" })
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <button
                onClick={() => handleSignIn("github")}
                className="flex items-center justify-center gap-2 w-full p-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 cursor-pointer text-gray-900 transition-all"
            >
                <Github className="w-5 h-5" />
                <span>{mode === "register" ? "Criar conta com GitHub" : "Entrar com GitHub"}</span>
            </button>

            <button
                onClick={() => handleSignIn("google")}
                className="flex items-center justify-center gap-2 w-full p-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 cursor-pointer text-gray-900 transition-all"
            >
                <Mail className="w-5 h-5" />
                <span>{mode === "register" ? "Criar conta com Google" : "Entrar com Google"}</span>
            </button>
        </div>
    )
}
