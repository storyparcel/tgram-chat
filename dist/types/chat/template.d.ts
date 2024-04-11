import React from "react";
import { BotData, Chat, ChatModelType, SuggestedQuery } from ".";
interface IChatBotTemplate {
    isMobile: boolean;
    chats: Array<Chat>;
    isReady: boolean;
    responding: boolean;
    apiKey: string;
    clientId: string;
    chatModel: ChatModelType;
    botData: BotData;
    suggestedQuery: Array<SuggestedQuery>;
    suggestedQueryByUserQuery: Array<string>;
    chatText: string;
    handleChatText: (chatText: string) => void;
    sendMessage: (message: string) => void;
    resetConnect: () => void;
    handleChatModelChange: (chatModel: ChatModelType) => void;
}
declare const ChatBotTemplate: React.FC<IChatBotTemplate>;
export default ChatBotTemplate;
//# sourceMappingURL=template.d.ts.map