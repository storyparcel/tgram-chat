import { ReactNode } from 'react';
interface KeyContextProps {
    apiKey: string | null;
    clientId: string | null;
    setKeys: (newApiKey: string, newClientId: string) => void;
}
export declare const useKeyContext: () => KeyContextProps;
interface KeyProviderProps {
    children: ReactNode;
}
export declare const KeyProvider: React.FC<KeyProviderProps>;
export {};
//# sourceMappingURL=keyContext.d.ts.map