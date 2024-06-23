import React, { useState, ReactNode, useCallback, useMemo } from 'react';
import { IRecordClickPayload } from '@src/repository';

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

export interface ChatContextProps {
    chats: Array<Chat>;
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    lastMyChat: Chat | undefined;
    suggestedQueryByUserQuery: Array<string>;
    setSuggestedQueryByUserQuery: React.Dispatch<React.SetStateAction<string[]>>;
    addChat: (chat: Chat) => void;
    updateChatMessage: (chat: Chat) => void;
    updateChatFeedback: (callId: string, feedback: Feedback) => void;
    clearChats: () => void;
    getBotMessageIndexByQuestionId: (callId: string) => number;
    recordClick: (payload: IRecordClickPayload) => Promise<void>;
}

export interface ChatProviderProps {
    repository: any;
    children: ReactNode;
}

export const useChatProviderLogic = (repository: any) => {
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

    const recordClick = useCallback(async (payload: IRecordClickPayload) => {
        await repository.recordClick(payload);
    }, []);

    const clearChats = useCallback(() => {
        setChats([]);
        setSuggestedQueryByUserQuery([]);
    }, []);

    return {
        chats,
        setChats,
        lastMyChat,
        suggestedQueryByUserQuery,
        setSuggestedQueryByUserQuery,
        addChat,
        updateChatMessage,
        updateChatFeedback,
        clearChats,
        getBotMessageIndexByQuestionId,
        recordClick,
    }
};
