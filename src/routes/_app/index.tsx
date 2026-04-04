import { createFileRoute, redirect } from '@tanstack/react-router'
import { nanoid } from 'nanoid'

export const Route = createFileRoute('/_app/')({
    beforeLoad: () => {
        throw redirect({
            params: {
                conversationId: nanoid(),
            },
            to: '/$conversationId',
        })
    },
})
