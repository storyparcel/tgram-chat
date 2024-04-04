type ChatUrl = {
    url: string;
    thumbnail: string | null;
    title: string;
};
type ChatData = {
    urls?: Array<ChatUrl>;
    tool_calls?: Array<{
        action: 'Search';
        action_message: string;
    }>;
    session_id?: string;
} | null;
type BaseChat = {
    message: string;
    callId: string;
    data?: ChatData;
    terminated?: boolean;
};
type SuggestedQuery = {
    query: string;
    id: number;
};
type BotData = {
    ai_greeting: string;
    ai_name: string;
    ai_purpose: string;
    ai_thumbnail: string;
};
declare enum MessageType {
    MY = "MY",
    BOT = "BOT"
}
type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';
type Chat = {
    type: MessageType;
} & BaseChat;

export { type BaseChat, type BotData, type Chat, type ChatData, type ChatModelType, type ChatUrl, MessageType, type SuggestedQuery };
