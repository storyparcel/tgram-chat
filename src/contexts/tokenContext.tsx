import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Token = string | null;

interface TokenContextProps {
    token: Token;
    setToken: (token: string) => void;
}

const TokenContext = createContext<TokenContextProps | undefined>(undefined);

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within an TokenProvider');
    }
    return context;
};

interface TokenProviderProps {
    initialToken: Token;
    children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ initialToken, children }) => {
    const [ token, setToken ] = useState<Token>(initialToken || null);

    const contextValue: TokenContextProps = {
        token,
        setToken,
    };

    return (
        <TokenContext.Provider value={contextValue}>
            {children}
        </TokenContext.Provider>
    );
};
