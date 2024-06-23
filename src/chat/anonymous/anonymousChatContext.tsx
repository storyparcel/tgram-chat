import { ChatContextProps, ChatProviderProps, useChatProviderLogic } from "@src/hooks/useChatProviderLogic";
import React, { createContext, useCallback, useContext } from "react";

interface AnonymousChatContextProps extends ChatContextProps {
    updateSuggestedQueryByUserQuery: (ragUuid: string) => Promise<void>;
}

const ChatContext = createContext<AnonymousChatContextProps | undefined>(undefined);

export const useAnonymousChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useAnonymousChatContext must be used within an AnonymousChatProvider');
    }
    return context;
};

const AnonymousChatProvider = ({ repository, children }: ChatProviderProps) => {
    const contextValue = useChatProviderLogic(repository);

    const updateSuggestedQueryByUserQuery = useCallback(async (ragUuid: string) => {
        if (!contextValue.lastMyChat) {
            return;
        }

        const _suggestedQueryByUserQuery = await repository.getNewSuggestedQuery({
            user_query: contextValue.lastMyChat.message,
            rag_uuid: ragUuid,
        });

        contextValue.setSuggestedQueryByUserQuery(_suggestedQueryByUserQuery);
    }, [contextValue.lastMyChat]);

    const value: AnonymousChatContextProps = {
        ...contextValue,
        updateSuggestedQueryByUserQuery,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default AnonymousChatProvider;