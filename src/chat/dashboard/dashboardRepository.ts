import objectToQueryString from "@src/helper/objectToQueryString";
import BaseRepository, { IFeedbackPayload } from "@src/repository";

class DashboardRepository extends BaseRepository {
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

    async getNewSuggestedQuery(payload: { user_query: string }, token: string | null): Promise<Array<string>> {
        const queryString = objectToQueryString(payload);
        const url = `/api/suggested_query/user/query?${queryString}`;
        return this.fetchWithHandling(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
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

const dashboardRepository = new DashboardRepository();
export default dashboardRepository;
