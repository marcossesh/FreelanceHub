// web/src/app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react"
import { registerUser } from "@/app/actions/register"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await registerUser({ name, email, password })

            if (result?.error) {
                setError(result.error)
                setLoading(false)
            } else {
                router.push("/login")
            }
        } catch (err) {
            setError("Erro inesperado.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center">
                        <UserPlus className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
                    <p className="mt-2 text-sm text-gray-600">Comece a gerenciar seus projetos hoje</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                                placeholder="Nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                                placeholder="Senha (mín. 6 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Criar conta"}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Já tem uma conta?{" "}
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Faça login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
