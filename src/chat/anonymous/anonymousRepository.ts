import objectToQueryString from "@src/helper/objectToQueryString";
import BaseRepository, { IFeedbackPayload } from "@src/repository";

class AnonymousRepository extends BaseRepository {
    async ragInit(ragUuid: string | null): Promise<{
        ai_greeting: string;
        ai_name: string;
        ai_purpose: string;
        ai_thumbnail: string;
        suggested_query: Array<{ query: string; id: number }>;
    }> {
        const url = `/api/generator/public/rag_init/${ragUuid}`;
        return this.fetchWithHandling(url, {
            method: 'GET',
        });
    }

    async getNewSuggestedQuery(payload: { query: string, rag_uuid: string }): Promise<Array<string>> {
        const queryString = objectToQueryString(payload);
        const url = `/api/public/suggested_query?${queryString}`;
        return this.fetchWithHandling(url, { method: 'GET' });
    }

    async feedback(payload: IFeedbackPayload): Promise<any> {
        const queryString = objectToQueryString(payload);
        const url = `/api/public/chat/feedback?${queryString}`;
        return this.fetchWithHandling(url, { method: 'POST' });
    }
}

const anonymousRepository = new AnonymousRepository();
export default anonymousRepository;