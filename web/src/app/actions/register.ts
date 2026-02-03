// web/src/app/actions/register.ts
"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/lib/validation-constants"

const registerSchema = z.object({
  name: z.string().min(VALIDATION_RULES.NAME.MIN_LENGTH, `Nome deve ter pelo menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`),
  email: z.string().email("E-mail inválido").max(VALIDATION_RULES.EMAIL.MAX_LENGTH),
  password: z.string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.TOO_SHORT)
    .max(VALIDATION_RULES.PASSWORD.MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD.TOO_LONG),
})

export async function registerUser(formData: z.infer<typeof registerSchema>) {
  try {
    const { email, name, password } = registerSchema.parse(formData)

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    })

    if (existingUser) {
      // Se o usuário existe mas NÃO tem senha, ele veio do Google/GitHub
      if (!existingUser.password && existingUser.accounts.length > 0) {
        return {
          error: "Esta conta foi criada via Google/GitHub. Por favor, faça login usando o provedor social."
        }
      }

      return { error: "Este e-mail já está cadastrado." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "FREELANCER",
      },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message }
    }
    return { error: "Erro interno no servidor ao registrar usuário." }
  }
}
