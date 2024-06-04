import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Session } from './sessionContext';
import repository from '@src/repository';
import { Token } from './tokenContext';

export enum MessageType {
    MY = 'MY',
    BOT = 'BOT',
};

export type ChatUrl = {
    url: string;
    thumbnail: string | null;
    title: string;
};

export type ChatData = {
    urls?: Array<ChatUrl>;
    tool_calls?: Array<{
        action: 'Search';
        action_message: string;
    }>;
    session_id?: string;
} | null;

export type Feedback = {
    like: boolean;
    comment: string;
};

export type BaseChat = {
    message: string;
    callId: string;
    data?: ChatData;
    terminated?: boolean;
    feedback?: Feedback | null;
};

export type Chat = { type: MessageType } & BaseChat;

interface ChatContextProps {
    chats: Array<Chat>;
    lastMyChat: Chat | undefined;
    suggestedQueryByUserQuery: Array<string>;
    addChat: (chat: Chat) => void;
    updateChatMessage: (chat: Chat) => void;
    updateChatFeedback: (callId: string, feedback: Feedback) => void;
    resetChatsBySessionId: (sessionId: Session, token: Token, onTokenExpired: () => void) => Promise<void>;
    updateSuggestedQueryByUserQuery: (token: Token, onTokenExpired: () => void) => Promise<void>;
    clearChats: () => void;
    getBotMessageIndexByQuestionId: (callId: string) => number;
}

const KeyContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
    const context = useContext(KeyContext);
    if (!context) {
        throw new Error('useChatContext must be used within an ChatContext');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chats, setChats] = useState<Array<Chat>>([]);
    const [suggestedQueryByUserQuery, setSuggestedQueryByUserQuery] = useState<Array<string>>([]);

    const lastMyChat = useMemo(() => {
        const reversed = [...chats].reverse();
        return reversed.find(chat => chat.type === MessageType.MY);
    }, [chats]);

    const getBotMessageIndexByQuestionId = useCallback((callId: string) => {
        return chats.findIndex(chat => {
            return (
                chat.type === MessageType.BOT &&
                chat.callId === callId
            );
        });
    }, [chats]);

    const addChat = useCallback((chat: Chat) => {
        setChats((prevChats) => [...prevChats, chat]);
    }, []);

    const updateChatMessage = useCallback((chat: Chat) => {
        const indexTargetChat = getBotMessageIndexByQuestionId(chat.callId);
        setChats(prevChats => {
            const targetChat = prevChats[indexTargetChat];
            prevChats[indexTargetChat] = {
                ...targetChat,
                message: targetChat.message.concat(chat.message),
                data: chat.data ?? targetChat.data,
                terminated: chat.terminated,
            };
            return [...prevChats];
        });
    }, [getBotMessageIndexByQuestionId]);

    // NOTE: 클라이언트 전용임.
    const updateChatFeedback = useCallback((callId: string, feedback: Feedback) => {
        const indexTargetChat = getBotMessageIndexByQuestionId(callId);
        setChats(prevChats => {
            const targetChat = prevChats[indexTargetChat];
            prevChats[indexTargetChat] = {
                ...targetChat,
                feedback,
            };
            return [...prevChats];
        });
    }, [getBotMessageIndexByQuestionId]);

    const resetChatsBySessionId = useCallback(async (
        sessionId: Session,
        token: Token,
        onTokenExpired: () => void,
    ) => {
        clearChats();
        if (!sessionId) {
            return;
        }

        const response = await repository.getChatHistoryBySessionId(sessionId, token);
        // TODO: 일단은...
        // @ts-ignore
        if (response.tokenExpired) {
            onTokenExpired();
        } else {
            setChats(response);
        }
    }, []);

    const updateSuggestedQueryByUserQuery = useCallback(async (
        token: Token,
        onTokenExpired: () => void,
    ) => {
        if (!lastMyChat || !token) {
            return;
        }

        const _suggestedQueryByUserQuery = await repository.getNewSuggestedQuery(
            { user_query: lastMyChat.message },
            token,
        );

        // TODO: 일단은...
        // @ts-ignore
        if (_suggestedQueryByUserQuery.tokenExpired) {
            onTokenExpired();
        } else {
            setSuggestedQueryByUserQuery(_suggestedQueryByUserQuery)
        }
    }, [lastMyChat]);

    const clearChats = useCallback(() => {
        setChats([]);
        setSuggestedQueryByUserQuery([]);
    }, []);

    const contextValue: ChatContextProps = {
        chats,
        lastMyChat,
        suggestedQueryByUserQuery,
        addChat,
        updateChatMessage,
        updateChatFeedback,
        resetChatsBySessionId,
        updateSuggestedQueryByUserQuery,
        clearChats,
        getBotMessageIndexByQuestionId,
    };

    return (
        <KeyContext.Provider value={contextValue}>
            {children}
        </KeyContext.Provider>
    );
};
