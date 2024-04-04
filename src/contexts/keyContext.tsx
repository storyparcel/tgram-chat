import { createContext, useContext, useState, ReactNode } from 'react';

interface KeyContextProps {
    apiKey: string | null;
    clientId: string | null;
    setKeys: (newApiKey: string, newClientId: string) => void;
}

const KeyContext = createContext<KeyContextProps | undefined>(undefined);

export const useKeyContext = () => {
    const context = useContext(KeyContext);
    if (!context) {
        throw new Error('useKeyContext must be used within an KeyProvider');
    }
    return context;
};

interface KeyProviderProps {
    children: ReactNode;
}

export const KeyProvider: React.FC<KeyProviderProps> = ({ children }) => {
    const [ apiKey, setApiKey ] = useState<string | null>(null);
    const [ clientId, setClientId ] = useState<string | null>(null);

    const setKeys = (newApiKey: string, newClientId: string) => {
        setApiKey(newApiKey);
        setClientId(newClientId);
    };

    const contextValue: KeyContextProps = {
        apiKey,
        clientId,
        setKeys,
    };

    return (
        <KeyContext.Provider value={contextValue}>
            {children}
        </KeyContext.Provider>
    );
};
