import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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

export type BaseChat = {
    message: string;
    callId: string;
    data?: ChatData;
    terminated?: boolean;
};

export type Chat = { type: MessageType } & BaseChat;

interface ChatContextProps {
    chats: Array<Chat>;
    addChat: (chat: Chat) => void;
    updateChat: (chat: Chat) => void;
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

    const updateChat = useCallback((chat: Chat) => {
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
    }, [ getBotMessageIndexByQuestionId ]);

    const clearChats = useCallback(() => {
        setChats([]);
    }, []);

    const contextValue: ChatContextProps = {
        chats,
        addChat,
        updateChat,
        clearChats,
        getBotMessageIndexByQuestionId,
    };

    return (
        <KeyContext.Provider value={contextValue}>
            {children}
        </KeyContext.Provider>
    );
};
