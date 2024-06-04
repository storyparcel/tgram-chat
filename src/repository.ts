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

export type ApiHandler = {
    tokenExpired: boolean;
}

const handleApiError = async (response: Response): Promise<ApiHandler> => {
    if (response.status === 401 || response.status === 403) {
        return { tokenExpired: true };
    }
    const errorData = await response.json();
    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
};

class Repository {
    url = '';

    private async fetchWithHandling(url: string, options: RequestInit) {
        try {
            const response = await fetchWithCommonOptions(url, options);
            if (!response.ok) {
                return handleApiError(response);
            }
            return response.json();
        } catch (err) {
            console.error('Fetch error:', err);
            throw err;
        }
    }

    async getNewSessionId(token: string | null): Promise<string> {
        const url = `/api/chat/session/user/id`;
        return this.fetchWithHandling(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async getChatHistoryBySessionId(sessionId: string, token: string | null): Promise<Array<Chat>> {
        const queryString = objectToQueryString({
            size: 30,
        });
        const url = `/api/chat/history/user/${sessionId}?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async loadChatHistory(payload: {
        client_id: string;
        size: number;
    }): Promise<Array<Chat>> {
        const queryString = objectToQueryString(payload);
        const url = `${this.url}d?${queryString}`;
        return this.fetchWithHandling(url, { method: 'GET' });
    }

    async getNewSuggestedQuery(payload: { user_query: string }, token: string | null): Promise<Array<string>> {
        const queryString = objectToQueryString(payload);
        const url = `/api/suggested_query/user/query?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async ragInit(token: string | null): Promise<{
        ai_greeting: string;
        ai_name: string;
        ai_purpose: string;
        ai_thumbnail: string;
        suggested_query: Array<{ query: string; id: number }>;
    }> {
        const url = `/api/generator/user/rag_init`;
        return this.fetchWithHandling(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async recordClick(payload: {
        api_key: string;
        client_id: string;
        session_id: string;
        call_id: string;
        url: string;
    }): Promise<any> {
        const queryString = objectToQueryString(payload);
        const url = `/api/chat/record_click?${queryString}`;
        return this.fetchWithHandling(url, { method: 'POST' });
    }

    async feedback(payload: IFeedbackPayload, token: string | null): Promise<any> {
        if (!token) {
            throw new Error('not authorized.');
        }
        const queryString = objectToQueryString(payload);
        const url = `/api/chat/feedback?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }
}

const repository = new Repository();
export default repository;
