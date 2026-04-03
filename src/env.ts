import { z } from 'zod/v4'

const env = z
    .object({
        DB_FILE_NAME: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1),
        OPENAI_BASE_URL: z.url(),
        OPENAI_MODEL_ID: z.string().min(1),
    })
    .parse(process.env)

export default env
