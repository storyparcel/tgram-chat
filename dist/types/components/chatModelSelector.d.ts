/// <reference types="react" />
export type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';
interface IChatModelSelector {
    chatModel: ChatModelType;
    onChange: (model: ChatModelType) => void;
}
declare const ChatModelSelector: React.FC<IChatModelSelector>;
export default ChatModelSelector;
//# sourceMappingURL=chatModelSelector.d.ts.map