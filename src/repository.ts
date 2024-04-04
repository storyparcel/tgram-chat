import fetchWithCommonOptions from './fetchWithCommonOptions';
import { Chat } from './chat';
import objectToQueryString from './helper/objectToQueryString';

export interface ILoginField {
    username: string;
    password: string;
}

export interface ILoginResult {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

class Repository {
    url = '';

    async loadChatHistory(payload: {
        client_id: string;
        // api_key: string;
        size: number;
    }): Promise<Array<Chat>> {
        try {
            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`${this.url}/api/chat?${queryString}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        } catch (err) {
            return [];
        }
    };

    async getNewSuggestedQuery(payload: { api_key: string; user_query: string }): Promise<Array<string>> {
        try {
            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`/api/suggested_query/query?${queryString}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        } catch (err) {
            return [];
        }
    };

    async ragInit(payload: {
        api_key: string;
    }): Promise<{
        ai_greeting: string;
        ai_name: string;
        ai_purpose: string;
        ai_thumbnail: string;
        suggested_query: Array<{ query: string; id: number }>;
    }> {
        try {
            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`/api/generator/rag_init?${queryString}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        } catch (err) {
            return {
                ai_greeting: '',
                ai_name: '',
                ai_purpose: '',
                ai_thumbnail: '',
                suggested_query: [],
            };
        }
    };

    async recordClick(payload: {
        api_key: string;
        client_id: string;
        session_id: string;
        call_id: string;
        url: string;
    }): Promise<any> {
        try {
            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`/api/chat/record_click?${queryString}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        } catch (err) {
        }
    };
}

const repository = new Repository();
export default repository;