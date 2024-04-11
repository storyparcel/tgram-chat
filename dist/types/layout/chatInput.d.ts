import React, { InputHTMLAttributes } from 'react';
interface IChatInput extends InputHTMLAttributes<HTMLTextAreaElement> {
    sendMessage: () => void;
    responding: boolean;
    disabledSubmit: boolean;
}
declare const ChatInput: React.FC<IChatInput>;
export default ChatInput;
//# sourceMappingURL=chatInput.d.ts.map