import { Token } from '@src/contexts/tokenContext';
import {  ChatContextProps, ChatProviderProps, useChatProviderLogic } from '@src/hooks/useChatProviderLogic';
import React, { createContext, useCallback, useContext } from 'react';

interface DashboardChatContextProps extends ChatContextProps {
    resetChatsBySessionId: (sessionId: string, token: Token, onTokenExpired: () => void) => Promise<void>;
    updateSuggestedQueryByUserQuery: (token: Token, onTokenExpired: () => void) => Promise<void>;
}

const ChatContext = createContext<DashboardChatContextProps | undefined>(undefined);

export const useDashboardChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useDashboardChatContext must be used within an DashboardChatProvider');
    }
    return context;
};

const DashboardChatProvider = ({ repository, children }: ChatProviderProps) => {
    const contextValue = useChatProviderLogic(repository);

    const resetChatsBySessionId = useCallback(async (
        sessionId: string,
        token: Token,
        onTokenExpired: () => void,
    ) => {
        contextValue.clearChats();
        if (!sessionId) {
            return;
        }

        const response = await repository.getChatHistoryBySessionId(sessionId, token);
        // TODO: 일단은...
        // @ts-ignore
        if (response.tokenExpired) {
            onTokenExpired();
        } else {
            contextValue.setChats(response);
        }
    }, []);

    const updateSuggestedQueryByUserQuery = useCallback(async (token: Token) => {
        if (!contextValue.lastMyChat || !token) {
            return;
        }

        const _suggestedQueryByUserQuery = await repository.getNewSuggestedQuery(
            { user_query: contextValue.lastMyChat.message },
            token,
        );

        contextValue.setSuggestedQueryByUserQuery(_suggestedQueryByUserQuery)
    }, [contextValue.lastMyChat]);

    const value: DashboardChatContextProps = {
        ...contextValue,
        resetChatsBySessionId,
        updateSuggestedQueryByUserQuery,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default DashboardChatProvider;