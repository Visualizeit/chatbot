import type { Chat } from '@ai-sdk/react'
import { createContext } from 'react'
import type { ChatUIMessage } from '@/apis/ChatUIMessage'

// biome-ignore lint/style/noNonNullAssertion: context provider ensures non-null value
const ChatContext = createContext<Chat<ChatUIMessage>>(null!)

export default ChatContext
