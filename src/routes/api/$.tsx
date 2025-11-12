import { RPCHandler } from '@orpc/server/fetch'
import { createFileRoute } from '@tanstack/react-router'
import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici'
import router from '@/apis/router'

const envHttpProxyAgent = new EnvHttpProxyAgent()

setGlobalDispatcher(envHttpProxyAgent)

const handler = new RPCHandler(router, {})

export const Route = createFileRoute('/api/$')({
    server: {
        handlers: {
            ANY: async ({ request }) => {
                const { response } = await handler.handle(request, {
                    prefix: '/api',
                })

                return response ?? new Response('Not Found', { status: 404 })
            },
        },
    },
})
