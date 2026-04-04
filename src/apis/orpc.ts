import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import { createRouterClient } from '@orpc/server'
import { createIsomorphicFn } from '@tanstack/react-start'

import orpcRouter from '@/apis/routers/orpc-router'

const getORPCClient = createIsomorphicFn()
    .server(() => createRouterClient(orpcRouter))
    .client((): RouterClient<typeof orpcRouter> => {
        const link = new RPCLink({
            url: `${window.location.origin}/api`,
        })

        return createORPCClient(link)
    })

const orpc: RouterClient<typeof orpcRouter> = getORPCClient()

export default orpc
