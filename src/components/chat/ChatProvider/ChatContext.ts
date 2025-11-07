import type { Chat, UIMessage } from '@ai-sdk/react'
import { createContext } from 'react'

// biome-ignore lint/style/noNonNullAssertion: intentional null assertion for context default
const ChatContext = createContext<Chat<UIMessage> | null>(null!)

export default ChatContext
