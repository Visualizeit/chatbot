import type { RouterClient } from '@orpc/server'
import type router from '@/apis/router'
import getORPCClient from './getORPCClient'

const orpc: RouterClient<typeof router> = getORPCClient()

export default orpc
