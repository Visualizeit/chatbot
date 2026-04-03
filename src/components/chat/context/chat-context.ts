import type { Chat } from '@ai-sdk/react'
import { createContext } from 'react'

import type { ChatUIMessage } from '@/apis/chat-ui-message'

const ChatContext = createContext<Chat<ChatUIMessage> | null>(null)

export default ChatContext
