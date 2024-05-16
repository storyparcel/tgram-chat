import React, { useMemo, useRef } from "react";
import { BotData, ChatModelType, SuggestedQuery } from "..";
import * as styles from './index.module.css';
import BalloonWrapper from '../../layout/balloonWrapper';
// import ChatModelSelector from "@src/components/chatModelSelector";
import NextLiner from "@src/components/nextLiner";
import SuggestQuery from "@src/components/suggestQuery";
import ChatInput from "@src/layout/chatInput";
import { Chat } from "@src/contexts/chatContext";
import { IFeedbackPayload } from "@src/repository";

interface IChatBotTemplate {
    isMobile: boolean;
    chats: Array<Chat>;
    isReady: boolean;
    responding: boolean;
    // apiKey: string;
    // clientId: string;
    chatModel: ChatModelType;
    botData: BotData;
    suggestedQuery: Array<SuggestedQuery>;
    suggestedQueryByUserQuery: Array<string>;
    chatText: string;
    handleChatText: (chatText: string) => void;
    sendMessage: (message: string) => void;
    resetConnect: () => void;
    handleChatModelChange: (chatModel: ChatModelType) => void;
    feedback: (payload: IFeedbackPayload) => Promise<any>;
}

const ChatBotTemplate: React.FC<IChatBotTemplate> = (props) => {
    // console.log('tempalte prosp!!', props);
    const scrollRef = useRef<HTMLDivElement>(null);
    // const { setKeys } = useKeyContext();
    const disabledSubmit = useMemo(() => {
        return props.chatText === '' || !props.isReady || props.responding === true;
    }, [ props.chatText, props.isReady, props.responding ]);

    // useEffect(() => {
    //     setKeys(props.apiKey, props.clientId);
    // }, [ props.apiKey, props.clientId ]);

    return (
        <div className={styles.layout}>
            <div
                ref={scrollRef}
                className={styles.chatLayer}
            >
                <div className={styles.scrollInnerWrapper}>
                    {/* // TODO: 나중에 다시 살려야함. */}
                    {/* <ChatModelSelector
                        chatModel={props.chatModel}
                        onChange={props.handleChatModelChange}
                    /> */}
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
                            feedback={props.feedback}
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
        </div>
    );
};

export default ChatBotTemplate;