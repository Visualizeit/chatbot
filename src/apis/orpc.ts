import type { RouterClient } from '@orpc/server'

import type router from '@/apis/router'

import getORPCClient from './get-orpc-client'

const orpc: RouterClient<typeof router> = getORPCClient()

export default orpc
