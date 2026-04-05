import type { Chat } from '@ai-sdk/react'
import { createContext } from 'react'

import type { ConversationMessage } from '@/apis/conversation-message'

const ChatContext = createContext<Chat<ConversationMessage> | null>(null)

export default ChatContext
