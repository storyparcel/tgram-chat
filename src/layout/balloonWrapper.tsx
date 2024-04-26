import React, { useCallback, useMemo } from "react";;
import MyMessage from "./myMessage";
import BotMessage from "./botMessage";
import SuggestedQueryByUserQuery from '../components/suggestedQueryByUserQuery';
import { Chat, MessageType } from "@src/chat";

interface IBalloonWrapper {
    chats: Array<Chat>;
    isMobile: boolean;
    aiName: string;
    aiThumbnail: string;
    suggestedQueryByUserQuery: Array<string>;
    responding: boolean;
    sendMessage: (message: string) => void;
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
                    />
                );
            default:
                return null;
        }
    }, [ props.aiName, props.aiThumbnail ]);

    const needShowSuggestedQueryByUserQuery = useMemo(() => {
        return !props.responding && props.chats[props.chats.length - 1]?.type === MessageType.BOT;
    }, [ props.responding, props.chats.length ]);

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