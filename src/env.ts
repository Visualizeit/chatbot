import { z } from 'zod/v4'

const env = z
    .object({
        DB_FILE_NAME: z.string().catch('file:chatbot.db'),
    })
    .parse(process.env)

export default env
