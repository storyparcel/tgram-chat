/// <reference types="react" />
import { SuggestedQuery } from "src/chat";
interface ISuggestQuery {
    queries: Array<SuggestedQuery>;
    sendMessage: (message: string) => void;
}
declare const SuggestQuery: React.FC<ISuggestQuery>;
export default SuggestQuery;
//# sourceMappingURL=suggestQuery.d.ts.map