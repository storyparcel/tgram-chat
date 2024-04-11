import React, { useMemo, useRef } from "react";
import { BotData, Chat, ChatModelType, SuggestedQuery } from ".";
import styles from './template.module.css';
import NextLiner from "src/components/nextLiner";
import SuggestQuery from "src/components/suggestQuery";
import ChatModelSelector from "src/components/chatModelSelector";
import BalloonWrapper from '../layout/balloonWrapper';
import ChatInput from "src/layout/chatInput";

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

const ChatBotTemplate: React.FC<IChatBotTemplate> = (props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    // const { setKeys } = useKeyContext();
    const disabledSubmit = useMemo(() => {
        return props.chatText === '' || !props.isReady || props.responding === true;
    }, [ props.chatText, props.isReady, props.responding ]);

    // useEffect(() => {
    //     setKeys(props.apiKey, props.clientId);
    // }, [ props.apiKey, props.clientId ]);

    return (
        <>
            <div
                ref={scrollRef}
                className={styles.layout}
            >
                <div className={styles.scrollInnerWrapper}>
                    <ChatModelSelector
                        chatModel={props.chatModel}
                        onChange={props.handleChatModelChange}
                    />
                    <div className={styles.greeting}>
                        <NextLiner text={props.botData.ai_greeting} />
                    </div>
                    <div className={styles.purpose}>
                        <NextLiner text={props.botData.ai_purpose} />
                    </div>
                    <SuggestQuery
                        queries={props.suggestedQuery}
                        sendMessage={props.sendMessage}
                    />
                    <div className={styles.chatArea}>
                        <BalloonWrapper
                            chats={props.chats}
                            isMobile={props.isMobile}
                            aiName={props.botData.ai_name}
                            aiThumbnail={props.botData.ai_thumbnail}
                            suggestedQueryByUserQuery={props.suggestedQueryByUserQuery}
                            responding={props.responding}
                            sendMessage={props.sendMessage}

                        />
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <ChatInput
                    value={props.chatText}
                    onChange={e => props.handleChatText(e.currentTarget.value)}
                    sendMessage={() => props.sendMessage(props.chatText)}
                    placeholder={`${props.botData.ai_name}에 궁금하신 점을 물어보세요.`}
                    disabledSubmit={disabledSubmit}
                    responding={props.responding}
                />
                <div className={styles.copyRight}>Powered by HUGRAPH co., Ltd.</div>
            </div>
        </>
    );
};

export default ChatBotTemplate;