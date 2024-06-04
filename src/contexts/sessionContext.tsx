import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Session = string | null;

interface SessionContextProps {
    sessionId: Session;
    setSessionId: (sessionId: string) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext must be used within an SessionProvider');
    }
    return context;
};

interface SessionProviderProps {
    initialSessionId?: Session;
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ initialSessionId, children }) => {
    const [ sessionId, setSessionId ] = useState<Session>(initialSessionId || null);

    const contextValue: SessionContextProps = {
        sessionId: sessionId,
        setSessionId: setSessionId,
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
};
