import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import ChatBotTemplate from './template';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { CHAT_INPUT_MAX_SIZE } from '../constants';
import { isMobileOnly } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from 'react-dom';
import { KeyProvider } from '@src/contexts/keyContext';
import { BaseChat, Chat, ChatProvider, MessageType, useChatContext } from '@src/contexts/chatContext';
import './global.css';
import repository, { IFeedbackPayload } from '@src/repository';
import { TokenProvider, useTokenContext } from '@src/contexts/tokenContext';
import objectToQueryString from '@src/helper/objectToQueryString';
import { SessionProvider, useSessionContext } from '@src/contexts/sessionContext';

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
    sessionId?: string;
    token: string;
    containerId: string;
    onTokenExpired: () => void;
    onFirstMessageSent: () => void;
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

        const { token, setToken } = useTokenContext();
        const { sessionId, setSessionId } = useSessionContext();

        const {
            chats,
            lastMyChat,
            suggestedQueryByUserQuery,
            addChat,
            updateChatMessage,
            updateChatFeedback,
            resetChatsBySessionId,
            updateSuggestedQueryByUserQuery,
            clearChats,
            getBotMessageIndexByQuestionId,
        } = useChatContext();

        useImperativeHandle(ref, () => {
            return {
                updateToken: (token: string) => {
                    setToken(token);
                },
                updateSessionId: (sessionId: string) => {
                    setSessionId(sessionId);
                },
            };
        }, [ setToken, setSessionId ]);

        // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
        // const [ searchParams ] = useSearchParams();
        // const sessionId = searchParams.get('sessionId');

        const getSocketUrl = useCallback(async () => {
            if (!sessionId) {
                throw new Error('cannot found session id');
            }

            const parameters = {
                token,
                session_id: sessionId,
            };

            // if (!parameters.session_id) {
            //     const response = await repository.getNewSessionId(token);
            //     // TODO: 일단은...
            //     // @ts-ignore
            //     if (response.tokenExpired) {
            //         props.onTokenExpired();
            //         throw new Error('token expired.');
            //     }

            //     // setSessionId(response);
            //     // console.log('session id 자체 할당.');
            //     // parameters.session_id = response;
            // }

            const queryString = objectToQueryString(parameters);
            console.log('new socket url', `${process.env.SOCKET_URL}/api/generator/rag/user?${queryString}`);
            return `${process.env.SOCKET_URL}/api/generator/rag/user?${queryString}`;
        }, [token, sessionId]);

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
                const response = await repository.feedback(payload, token);
                // TODO: 일단은...
                // @ts-ignore
                if (response.tokenExpired) {
                    props.onTokenExpired();
                } else {
                    updateChatFeedback(
                        payload.call_id,
                        {
                            like: payload.like,
                            comment: payload.comment,
                        },
                    );
                }
            } catch (err) {
                console.error(err);
            }
        }, [token, updateChatFeedback]);

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

        // const resetChats = useCallback(() => {
        //     setNeedForceReconnect(false);
        //     clearChats();
        //     setSuggestedQueryByUserQuery([]);
        //     setSuggestedQuery([]);
        // }, []);

        const initialize = useCallback((
            // startDate: string,
            // endDate: string,
        ) => {
            (async () => {
                console.log('initialize!!');
                // TODO: header token이 있어야 응답이 오는 구조여서 일단 빈배열임.
                // const chatHistory = await repository.loadChatHistory({
                //     client_id: clientId,
                //     size: 30,
                // });
                // console.log('tgram chatHistory', chatHistory);
                const ragInitData = await repository.ragInit(token);
                // TODO: 일단은...
                // @ts-ignore
                if (ragInitData.tokenExpired) {
                    props.onTokenExpired();
                } else {
                    setSuggestedQuery(ragInitData.suggested_query);
                    setBotData({
                        ai_greeting: ragInitData.ai_greeting,
                        ai_name: ragInitData.ai_name,
                        ai_purpose: ragInitData.ai_purpose,
                        ai_thumbnail: ragInitData.ai_thumbnail,
                    });
                }

                // await resetChatsBySessionId(
                //     sessionId,
                //     token,
                //     props.onTokenExpired,
                // );
            })();
        }, [token, sessionId]);

        useEffect(() => {
            (async () => {
                if (sessionId) {
                    await resetChatsBySessionId(
                        sessionId,
                        token,
                        props.onTokenExpired,
                    );
                }
            })();
        }, [ sessionId ]);

        useEffect(() => {
            initialize(
                // filterDateStore.formattedDate.startDate,
                // filterDateStore.formattedDate.endDate,
            );
        }, [ token ]);

        useEffect(() => {
            if (!props.token) {
                return;
            }

            setToken(props.token);
        }, [ props.token ]);

        useEffect(() => {
            updateSuggestedQueryByUserQuery(token, props.onTokenExpired);
        }, [lastMyChat?.message]);

        useEffect(() => {
            if (chats.length === 1) {
                props.onFirstMessageSent();
            }
        }, [ chats ]);

        if (!token) {
            return null;
        }

        return (
            <ChatBotTemplate
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
            <SessionProvider initialSessionId={options.sessionId}>
                <TokenProvider initialToken={options.token}>
                    <ChatProvider>
                        <KeyProvider>
                            <TGram ref={tgramRef} {...options} />
                        </KeyProvider>
                    </ChatProvider>
                </TokenProvider>
            </SessionProvider>,
            container,
        );

        return tgramRef;
    };

    // @ts-ignore
    window.initMyChatbot = initMyChatbot;
})();