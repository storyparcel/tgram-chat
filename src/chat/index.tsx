import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    token: string;
    containerId: string;
}

(() => {
    const TGram = (props: ITgramOptions) => {
        const [needForceReconnect, setNeedForceReconnect] = useState<boolean>(false);
        const [chatModel, setChatModel] = useState<ChatModelType>('T GRAM');
        const [chatText, setChatText] = useState<string>('');
        const [chatHistoryBySessionId, setChatHistoryBySessionId] = useState<Array<Chat>>([]);
        const [suggestedQueryByUserQuery, setSuggestedQueryByUserQuery] = useState<Array<string>>([]);
        const [suggestedQuery, setSuggestedQuery] = useState<Array<SuggestedQuery>>([]);
        const [botData, setBotData] = useState<BotData>({
            ai_greeting: '',
            ai_name: '',
            ai_purpose: '',
            ai_thumbnail: '',
        });

        const { token } = useTokenContext();

        const {
            chats,
            addChat,
            updateChatMessage,
            updateChatFeedback,
            clearChats,
            getBotMessageIndexByQuestionId,
        } = useChatContext();

        // TODO: 지금 기준으로는 대시보드 용이라서 고민좀..
        // const [ searchParams ] = useSearchParams();
        // const sessionId = searchParams.get('sessionId');

        const getSocketUrl = useCallback(() => {
            return `${process.env.SOCKET_URL}/api/generator/rag/user?token=${token}`;
        }, [token]);

        // const getSocketUrl = useCallback(() => {
        //     return `${process.env.SOCKET_URL}/api/generator/rag/user1?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaWJraSIsImV4cCI6NDg1Mjk0MjE4MH0.hGExnQYw17NnMKl42ychcoVDx0cENFh4KJ4rLc2Sp3o`;
        // }, []);

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

        const generateCallId = useCallback(() => {
            return uuidv4();
        }, []);

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
            addChat(newChat);
            setChatText('');
        }, []);

        const handleChatText = useCallback((chatText: string) => {
            setChatText(chatText);
        }, []);

        const feedback = useCallback(async (payload: IFeedbackPayload) => {
            try {
                await repository.feedback(payload, token);
                updateChatFeedback(
                    payload.call_id,
                    {
                        like: payload.like,
                        comment: payload.comment,
                    },
                );
            } catch (err) {
                // TODO: 에러 해들링.
            }
        }, [ token, updateChatFeedback ]);

        const responding = useMemo(() => {
            const lastChat = chats[chats.length - 1];
            return lastChat?.terminated === false;
        }, [chats]);

        const lastMyChat = useMemo(() => {
            const reversed = [...chats].reverse();
            return reversed.find(chat => chat.type === MessageType.MY);
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

        const updateSuggestedQueryByUserQuery = useCallback(() => {
            if (!lastMyChat || !token) {
                return;
            }

            (async () => {
                const _suggestedQueryByUserQuery = await repository.getNewSuggestedQuery(
                    { user_query: lastMyChat.message },
                    token,
                );
                setSuggestedQueryByUserQuery(_suggestedQueryByUserQuery)
            })();
        }, [lastMyChat, token]);

        const resetChats = useCallback(() => {
            setNeedForceReconnect(false);
            clearChats();
        }, []);

        const initialize = useCallback((
            // startDate: string,
            // endDate: string,
        ) => {
            (async () => {
                // TODO: header token이 있어야 응답이 오는 구조여서 일단 빈배열임.
                // const chatHistory = await repository.loadChatHistory({
                //     client_id: clientId,
                //     size: 30,
                // });
                // console.log('tgram chatHistory', chatHistory);
                const ragInitData = await repository.ragInit(token);
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
                // setChats(chatHistory.reverse());
                resetChats();
            })();
        }, [ token ]);

        useEffect(() => {
            initialize(
                // filterDateStore.formattedDate.startDate,
                // filterDateStore.formattedDate.endDate,
            );
        }, []);

        useEffect(() => {
            updateSuggestedQueryByUserQuery();
        }, [lastMyChat?.message]);

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

        if (!token) {
            return null;
        }

        return (
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
                feedback={feedback}
            />
        );
    };

    const initMyChatbot = (options: ITgramOptions) => {
        const container = document.getElementById(options.containerId);
        if (!container) {
            return;
        }
        ReactDOM.render(
            <ChatProvider>
                <KeyProvider>
                    <TokenProvider initialToken={options.token}>
                        <TGram {...options} />,
                    </TokenProvider>
                </KeyProvider>
            </ChatProvider>,
            container,
        );
    };

    // @ts-ignore
    window.initMyChatbot = initMyChatbot;
})();