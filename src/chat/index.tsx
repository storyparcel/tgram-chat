import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ChatBotTemplate from './template';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { CHAT_INPUT_MAX_SIZE } from '../constants';
import { isMobileOnly } from 'react-device-detect';
import repository from 'src/repository';
import { v4 as uuidv4 } from 'uuid';
import { KeyProvider } from 'src/contexts/keyContext';
import ReactDOM from 'react-dom';

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

export enum MessageType {
    MY = 'MY',
    BOT = 'BOT',
};

export type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';

export type Chat = { type: MessageType } & BaseChat;

const BASE_URL = process.env.REACT_APP_SOCKET_URL ?? 'ws://dev-server:7060';

interface ITgram {
    clientId: string;
    apiKey: string;
    containerId: string;
}





(function () {
    const TGram = (props: ITgram) => {
        const [ needForceReconnect, setNeedForceReconnect ] = useState<boolean>(false);
        const [ chatModel, setChatModel ] = useState<ChatModelType>('T GRAM');
        const [ chatText, setChatText ] = useState<string>('');
        const [ chatHistoryBySessionId, setChatHistoryBySessionId ] = useState<Array<Chat>>([]);
        const [ chats, setChats ] = useState<Array<Chat>>([]);
        const [ suggestedQueryByUserQuery, setSuggestedQueryByUserQuery ] = useState<Array<string>>([]);
        const [ suggestedQuery, setSuggestedQuery ] = useState<Array<SuggestedQuery>>([]);
        const [ botData, setBotData ] = useState<BotData>({
            ai_greeting: '',
            ai_name: '',
            ai_purpose: '',
            ai_thumbnail: '',
        });

        // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
        // const [ searchParams ] = useSearchParams();
        // const sessionId = searchParams.get('sessionId');

        const getSocketUrl = useCallback(() => {
            return `${BASE_URL}/api/generator/rag/${props.clientId}?apikey=${props.apiKey}`;
        }, [ props.clientId, props.apiKey ]);

        const {
            sendJsonMessage,
            readyState,
        } = useWebSocket(
            getSocketUrl,
            {
                onOpen: () => {
                    console.log('open!');
                },
                onClose: (event) => {
                    console.log('close => ', event);
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
                    // console.log('on message => ', chat);
                },
            },
            needForceReconnect === false,
        );

        const handleChatModelChange = useCallback((chatModel: ChatModelType) => {
            setChatModel(chatModel);
        }, []);

        const generateCallId = () => {
            return uuidv4();
        };

        const _sendMessage = useCallback((message: string) => {
            if (!message) {
                // TODO: 방어로직
                console.log('chat text가 없어서 종료.', message);
                return;
            }
            if (message.length > CHAT_INPUT_MAX_SIZE) {
                // TODO: 방어로직
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
            setChats(prevChats => [...prevChats, newChat]);
            setChatText('');
        }, []);

        const handleChatText = (chatText: string) => {
            setChatText(chatText);
        };

        const responding = useMemo(() => {
            const lastChat = chats[chats.length - 1];
            return lastChat?.terminated === false;
        }, [ chats ]);

        const lastMyChat = useMemo(() => {
            const reversed = [...chats].reverse();
            return reversed.find(chat => chat.type === MessageType.MY);
        }, [ chats ]);

        const getBotMessageIndexByQuestionId = (callId: string) => {
            return chats.findIndex(chat => {
                return (
                    chat.type === MessageType.BOT &&
                    chat.callId === callId
                );
            });
        };

        const addBotMessage = (chat: BaseChat) => {
            if (!chat) {
                return;
            }

            const newChat: Chat = {
                ...chat,
                type: MessageType.BOT,
            };
            const indexTargetChat = getBotMessageIndexByQuestionId(chat.callId);
            if (indexTargetChat === -1) {
                setChats(prevChats => [...prevChats, newChat]);
            } else {
                setChats(prevChats => {
                    const targetChat = prevChats[indexTargetChat];
                    prevChats[indexTargetChat] = {
                        ...targetChat,
                        message: targetChat.message.concat(newChat.message),
                        data: newChat.data ?? targetChat.data,
                        terminated: newChat.terminated,
                    };
                    return [...prevChats];
                });
            }
        };

        const updateSuggestedQueryByUserQuery = useCallback(() => {
            if (!lastMyChat || !props.apiKey) {
                return;
            }

            (async () => {
                const _suggestedQueryByUserQuery = await repository.getNewSuggestedQuery({
                    api_key: props.apiKey,
                    user_query: lastMyChat.message,
                });
                setSuggestedQueryByUserQuery(_suggestedQueryByUserQuery)
            })();
        }, [ lastMyChat, props.apiKey ]);

        const resetChats = useCallback(() => {
            setNeedForceReconnect(false);
            setChats([]);
        }, []);

        const initialize = useCallback((
            clientId: string,
            apiKey: string,
            // startDate: string,
            // endDate: string,
        ) => {
            (async () => {
                // TODO: header token이 있어야 응답이 오는 구조여서 일단 빈배열임.
                const chatHistory = await repository.loadChatHistory({
                    client_id: clientId,
                    size: 30,
                });
                console.log('tgram chatHistory', chatHistory);
                const ragInitData = await repository.ragInit({ api_key: apiKey });
                console.log('tgram ragInitData', ragInitData);
                // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
                // await this.getUserSessionHistory(
                //     clientId,
                //     apiKey,
                //     startDate,
                //     endDate,
                // );

                setSuggestedQuery(ragInitData.suggested_query);
                setBotData({
                    ai_greeting: ragInitData.ai_greeting,
                    ai_name: ragInitData.ai_name,
                    ai_purpose: ragInitData.ai_purpose,
                    ai_thumbnail: ragInitData.ai_thumbnail,
                });
                setChats(chatHistory.reverse());
                resetChats();
            })();
        }, []);

        useEffect(() => {
            initialize(
                props.clientId,
                props.apiKey,
                // filterDateStore.formattedDate.startDate,
                // filterDateStore.formattedDate.endDate,
            );
        }, []);

        useEffect(() => {
            updateSuggestedQueryByUserQuery();
        }, [ lastMyChat?.message ]);

        // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
        // useEffect(() => {
        //     if (!sessionId) {
        //         setChatHistoryBySessionId([]);
        //         return;
        //     }

        //     (async () => {
        //         const _chatHistoryBySessionId = await repository.getUserChatHistoryBySessionId(sessionId, {
        //             api_key: props.apiKey,
        //             size: 10,
        //         });
        //         setChatHistoryBySessionId(_chatHistoryBySessionId);
        //     })();
        // }, [ sessionId ]);

        return (
            <KeyProvider>
                <ChatBotTemplate
                    {...props}
                    chats={chatHistoryBySessionId?.length > 0 ? [...chatHistoryBySessionId].reverse() : chats}
                    isMobile={isMobileOnly}
                    sendMessage={_sendMessage}
                    isReady={readyState === ReadyState.OPEN}
                    responding={responding}
                    resetConnect={resetChats}
                    chatModel={chatModel}
                    handleChatModelChange={handleChatModelChange}
                    botData={botData}
                    suggestedQuery={suggestedQuery}
                    suggestedQueryByUserQuery={suggestedQueryByUserQuery}
                    chatText={chatText}
                    handleChatText={handleChatText}
                />
            </KeyProvider>
        );
    };

    // @ts-ignore
    window.initMyChatbot = (options: {
        clientId: string;
        apiKey: string;
        containerId: string;
    }) => {
        const container = document.getElementById(options.containerId);
        console.log('container!!', container);
        if (!container) {
            return;
        }
        ReactDOM.render(<TGram {...options} />, container);
    };
})();