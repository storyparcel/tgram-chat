/// <reference types="react" />
import { Chat } from 'src/chat';
interface IBotMessage {
    chat: Chat;
    aiName: string;
    aiThumbnail: string;
}
declare const BotMessage: React.FC<IBotMessage>;
export default BotMessage;
//# sourceMappingURL=botMessage.d.ts.map