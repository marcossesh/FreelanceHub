import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Instância para o SERVIDOR (Server Actions/API)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
})

// Instância para o CLIENTE (Navegador)
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    }
)
