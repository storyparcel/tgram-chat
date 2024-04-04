import { Chat } from './chat';
export interface ILoginField {
    username: string;
    password: string;
}
export interface ILoginResult {
    access_token: string;
    refresh_token: string;
    token_type: string;
}
declare class Repository {
    url: string;
    loadChatHistory(payload: {
        client_id: string;
        size: number;
    }): Promise<Array<Chat>>;
    getNewSuggestedQuery(payload: {
        api_key: string;
        user_query: string;
    }): Promise<Array<string>>;
    ragInit(payload: {
        api_key: string;
    }): Promise<{
        ai_greeting: string;
        ai_name: string;
        ai_purpose: string;
        ai_thumbnail: string;
        suggested_query: Array<{
            query: string;
            id: number;
        }>;
    }>;
    recordClick(payload: {
        api_key: string;
        client_id: string;
        session_id: string;
        call_id: string;
        url: string;
    }): Promise<any>;
}
declare const repository: Repository;
export default repository;
//# sourceMappingURL=repository.d.ts.map