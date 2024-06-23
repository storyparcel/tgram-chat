import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import TgramTemplate from '../template';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { CHAT_INPUT_MAX_SIZE } from '../../constants';
import { isMobileOnly } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from 'react-dom';
import { KeyProvider } from '@src/contexts/keyContext';
import objectToQueryString from '@src/helper/objectToQueryString';
import anonymousRepository from './anonymousRepository';
import AnonymousChatProvider, { useAnonymousChatContext } from './anonymousChatContext';
import { BaseChat, Chat, MessageType } from '@src/hooks/useChatProviderLogic';
import { IFeedbackPayload } from '@src/repository';

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

export type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';

interface ITgramOptions {
    containerId: string;
    ragUuid: string;
}

(() => {
    const TGram = forwardRef<any, ITgramOptions>((props, ref) => {
        const [needForceReconnect, setNeedForceReconnect] = useState<boolean>(false);
        const [chatModel, setChatModel] = useState<ChatModelType>('T GRAM');
        const [chatText, setChatText] = useState<string>('');
        const [suggestedQuery, setSuggestedQuery] = useState<Array<SuggestedQuery>>([]);
        const [botData, setBotData] = useState<BotData>({
            ai_greeting: '',
            ai_name: '',
            ai_purpose: '',
            ai_thumbnail: '',
        });

        const {
            chats,
            lastMyChat,
            suggestedQueryByUserQuery,
            addChat,
            updateChatMessage,
            updateChatFeedback,
            updateSuggestedQueryByUserQuery,
            clearChats,
            getBotMessageIndexByQuestionId,
        } = useAnonymousChatContext();

        // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
        // const [ searchParams ] = useSearchParams();
        // const sessionId = searchParams.get('sessionId');

        const getSocketUrl = useCallback(async () => {
            if (!props.ragUuid) {
                throw new Error('cannot found rag uuid.');
            }
            const parameters = {};
            const queryString = objectToQueryString(parameters);
            console.log('new socket url', `${process.env.SOCKET_URL}/api/generator/rag/public/${props.ragUuid}?${queryString}`);
            return `${process.env.SOCKET_URL}/api/generator/rag/public/${props.ragUuid}?${queryString}`;
        }, [props.ragUuid]);


        // /api/generator/rag/public/{rag_uuid}

        const {
            sendJsonMessage,
            readyState,
        } = useWebSocket(
            getSocketUrl,
            {
                onOpen: (event) => {
                    console.log('open!', event);
                },
                onClose: (event) => {
                    console.log('close => ', event);

                    // TODO:
                    // if (true) {
                    //     console.log('close refresh....');
                    //     props.onTokenExpired();
                    // }
                    if (needForceReconnect) {
                        setNeedForceReconnect(false);
                    }
                },
                onError: (event) => {
                    console.log('error', event);
                },
                onMessage: (event) => {
                    const chat: BaseChat = JSON.parse(event.data);
                    addBotMessage(chat);
                },
            },
            needForceReconnect === false,
        );

        const handleChatModelChange = useCallback((chatModel: ChatModelType) => {
            setChatModel(chatModel);
        }, []);

        const generateCallId = useCallback(() => {
            return uuidv4();
        }, []);

        const _sendMessage = useCallback((message: string) => {
            if (!message) {
                return;
            }
            if (message.length > CHAT_INPUT_MAX_SIZE) {
                return;
            }
            const callId = generateCallId();
            const newChat: Chat = {
                type: MessageType.MY,
                message,
                callId,
            };
            sendJsonMessage({
                message: newChat.message,
                callId: newChat.callId,
            });
            addChat(newChat);
            setChatText('');
        }, []);

        const handleChatText = useCallback((chatText: string) => {
            setChatText(chatText);
        }, []);

        const feedback = useCallback(async (payload: IFeedbackPayload) => {
            try {
                const response = await anonymousRepository.feedback(payload);
                updateChatFeedback(
                    payload.call_id,
                    {
                        like: payload.like,
                        comment: payload.comment,
                    },
                );
            } catch (err) {
                console.error(err);
            }
        }, [updateChatFeedback]);

        const responding = useMemo(() => {
            const lastChat = chats[chats.length - 1];
            return lastChat?.terminated === false;
        }, [chats]);

        const addBotMessage = useCallback((chat: BaseChat) => {
            if (!chat) {
                return;
            }

            const newChat: Chat = {
                ...chat,
                type: MessageType.BOT,
            };
            const indexTargetChat = getBotMessageIndexByQuestionId(chat.callId);
            if (indexTargetChat === -1) {
                addChat(newChat);
            } else {
                updateChatMessage(newChat);
            }
        }, [getBotMessageIndexByQuestionId]);

        const initialize = useCallback(() => {
            (async () => {
                const ragInitData = await anonymousRepository.ragInit(props.ragUuid);
                setSuggestedQuery(ragInitData.suggested_query);
                setBotData({
                    ai_greeting: ragInitData.ai_greeting,
                    ai_name: ragInitData.ai_name,
                    ai_purpose: ragInitData.ai_purpose,
                    ai_thumbnail: ragInitData.ai_thumbnail,
                });
            })();
        }, [props.ragUuid]);

        useEffect(() => {
            if (!props.ragUuid) {
                return;
            }

            initialize();
        }, [ props.ragUuid ]);

        useEffect(() => {
            updateSuggestedQueryByUserQuery(props.ragUuid);
        }, [lastMyChat?.message]);

        if (!props.ragUuid) {
            return null;
        }

        return (
            <TgramTemplate
                {...props}
                chats={chats}
                isMobile={isMobileOnly}
                sendMessage={_sendMessage}
                isReady={readyState === ReadyState.OPEN}
                responding={responding}
                // resetConnect={resetChats}
                chatModel={chatModel}
                handleChatModelChange={handleChatModelChange}
                botData={botData}
                suggestedQuery={suggestedQuery}
                suggestedQueryByUserQuery={suggestedQueryByUserQuery}
                chatText={chatText}
                handleChatText={handleChatText}
                feedback={feedback}
            />
        );
    });

    const initMyChatbot = (options: ITgramOptions) => {
        const container = document.getElementById(options.containerId);
        if (!container) {
            console.error(`Container element with ID "${options.containerId}" not found.`);
            return;
        }

        let tgramRef = React.createRef();

        ReactDOM.render(
            <AnonymousChatProvider repository={anonymousRepository}>
                <KeyProvider>
                    <TGram ref={tgramRef} {...options} />
                </KeyProvider>
            </AnonymousChatProvider>,
            container,
        );

        return tgramRef;
    };

    // @ts-ignore
    window.initMyChatbot = initMyChatbot;
})();