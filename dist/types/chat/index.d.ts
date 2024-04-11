export type ChatUrl = {
    url: string;
    thumbnail: string | null;
    title: string;
};
export type ChatData = {
    urls?: Array<ChatUrl>;
    tool_calls?: Array<{
        action: 'Search';
        action_message: string;
    }>;
    session_id?: string;
} | null;
export type BaseChat = {
    message: string;
    callId: string;
    data?: ChatData;
    terminated?: boolean;
};
export type SuggestedQuery = {
    query: string;
    id: number;
};
export type BotData = {
    ai_greeting: string;
    ai_name: string;
    ai_purpose: string;
    ai_thumbnail: string;
};
export declare enum MessageType {
    MY = "MY",
    BOT = "BOT"
}
export type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';
export type Chat = {
    type: MessageType;
} & BaseChat;
declare const initMyChatbot: (options: {
    clientId: string;
    apiKey: string;
    containerId: string;
}) => void;
export { initMyChatbot, };
//# sourceMappingURL=index.d.ts.map