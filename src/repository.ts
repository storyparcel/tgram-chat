
import fetchWithCommonOptions from './fetchWithCommonOptions';
import objectToQueryString from './helper/objectToQueryString';
import { Chat } from './hooks/useChatProviderLogic';

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

export interface IBookmarkRegisterPayload {
    session_id: string;
    call_id: string;
    call_title?: string;
}

export interface IRecordClickPayload {
    api_key: string;
    client_id: string;
    session_id: string;
    call_id: string;
    url: string;
}

export interface IBookmarkDeletePayload {
    session_id: string;
    call_id: string;
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

class BaseRepository {
    url = '';

    protected async fetchWithHandling(url: string, options: RequestInit) {
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

    async recordClick(payload: IRecordClickPayload): Promise<any> {
        const queryString = objectToQueryString(payload);
        const url = `/api/chat/record_click?${queryString}`;
        return this.fetchWithHandling(url, { method: 'POST' });
    }

    async getBookmark(token: string | null): Promise<Array<string>> {
        const url = `/api/chat/bookmark/user`;
        return this.fetchWithHandling(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async addBookmark(payload: IBookmarkRegisterPayload, token: string | null): Promise<any> {
        if (!token) {
            throw new Error('not authorized.');
        }
        const queryString = objectToQueryString(payload);
        const url = `/api/chat/bookmark/user?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async removeBookmark(payload: IBookmarkDeletePayload, token: string | null): Promise<any> {
        if (!token) {
            throw new Error('not authorized.');
        }
        const queryString = objectToQueryString(payload);
        const url = `/api/chat/bookmark/user?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }
}

export default BaseRepository;