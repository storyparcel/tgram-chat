import React, { useCallback, useMemo } from "react";;
import MyMessage from "./myMessage";
import BotMessage from "./botMessage";
import SuggestedQueryByUserQuery from '../components/suggestedQueryByUserQuery';
import { IFeedbackPayload } from "@src/repository";
import { Chat, MessageType } from "@src/hooks/useChatProviderLogic";

interface IBalloonWrapper {
    chats: Array<Chat>;
    isMobile: boolean;
    aiName: string;
    aiThumbnail: string;
    suggestedQueryByUserQuery: Array<string>;
    responding: boolean;
    sendMessage: (message: string) => void;
    feedback: (payload: IFeedbackPayload) => Promise<any>;
};

const BalloonWrapper: React.FC<IBalloonWrapper> = (props) => {
    const renderMessage = useCallback((chat: Chat) => {
        switch (chat.type) {
            case MessageType.MY:
                return (
                    <MyMessage message={chat.message} />
                );
            case MessageType.BOT:
                return (
                    <BotMessage
                        chat={chat}
                        aiName={props.aiName}
                        aiThumbnail={props.aiThumbnail}
                        feedback={props.feedback}
                    />
                );
            default:
                return null;
        }
    }, [ props.aiName, props.aiThumbnail, props.feedback ]);

    const needShowSuggestedQueryByUserQuery = useMemo(() => {
        return (
            !props.responding &&
            props.chats[props.chats.length - 1]?.type === MessageType.BOT &&
            props.suggestedQueryByUserQuery.length > 0
        );
    }, [ props.responding, props.chats.length, props.suggestedQueryByUserQuery ]);

    return (
        <>
            <div>
                { props.chats.map((chat, i) => {
                    return (
                        <div
                            key={`${chat.message}-${i}`}
                            style={{ transform: 'translateZ(0)' }}
                        >
                            {renderMessage(chat)}
                        </div>
                    );
                })}
            </div>
            { needShowSuggestedQueryByUserQuery &&
                <SuggestedQueryByUserQuery
                    queries={props.suggestedQueryByUserQuery}
                    sendMessage={props.sendMessage}
                />
            }
        </>
    );
};

export default BalloonWrapper;