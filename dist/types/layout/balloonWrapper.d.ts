/// <reference types="react" />
import { Chat } from "src/chat";
interface IBalloonWrapper {
    chats: Array<Chat>;
    isMobile: boolean;
    aiName: string;
    aiThumbnail: string;
    suggestedQueryByUserQuery: Array<string>;
    responding: boolean;
    sendMessage: (message: string) => void;
}
declare const BalloonWrapper: React.FC<IBalloonWrapper>;
export default BalloonWrapper;
//# sourceMappingURL=balloonWrapper.d.ts.map