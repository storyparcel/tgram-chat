import { Chat } from './contexts/chatContext';
import fetchWithCommonOptions from './fetchWithCommonOptions';
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

export interface IFeedbackPayload {
    session_id: string;
    call_id: string;
    like: boolean;
    comment: string;
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
            const response = await fetchWithCommonOptions(`${this.url}d?${queryString}`, {
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

    async getNewSuggestedQuery(payload: { user_query: string }, token: string | null): Promise<Array<string>> {
        try {
            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`/api/suggested_query/user/query?${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        } catch (err) {
            return [];
        }
    };

    async ragInit(token: string | null): Promise<{
        ai_greeting: string;
        ai_name: string;
        ai_purpose: string;
        ai_thumbnail: string;
        suggested_query: Array<{ query: string; id: number }>;
    }> {
        try {
            const response = await fetchWithCommonOptions(`/api/generator/user/rag_init`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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

    async feedback(payload: IFeedbackPayload, token: string | null): Promise<any> {
        try {
            if (!token) {
                throw new Error('not authorized.');
            }

            const queryString = objectToQueryString(payload);
            const response = await fetchWithCommonOptions(`/api/chat/feedback?${queryString}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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