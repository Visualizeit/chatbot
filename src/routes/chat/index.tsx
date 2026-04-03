import { createFileRoute, redirect } from '@tanstack/react-router'
import { nanoid } from 'nanoid'

export const Route = createFileRoute('/chat/')({
    beforeLoad: () => {
        throw redirect({
            params: { sessionid: nanoid() },
            to: '/chat/$sessionid',
        })
    },
})
