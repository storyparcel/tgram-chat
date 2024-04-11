import React, { useMemo, useRef } from 'react';
import ClipboardImg from '../assets/icons/clipboard-icon.svg';
import ShareImg from '../assets/icons/share-icon.svg';
import styles from './botMessage.module.css';
import repository from 'src/repository';
import { Chat } from 'src/chat';
import Loading from '../components/loading';
import UrlBlock from '../blocks/urlBlock';
import MarkdownRenderer from '../components/markdownRenderer';
import SearchingBlock from '../blocks/searchingBlock';
import { useKeyContext } from 'src/contexts/keyContext';

interface IBotMessage {
    chat: Chat;
    aiName: string;
    aiThumbnail: string;
}

const BotMessage: React.FC<IBotMessage> = (props) => {
    const markdownRef = useRef<HTMLDivElement>(null);

    const loading = useMemo(() => {
        return props.chat.terminated === false;
    }, [ props.chat.terminated ]);

    const { apiKey, clientId } = useKeyContext();

    const onClickLink = async (href: string | undefined) => {
        if (!href || !apiKey || !clientId || !props.chat.data?.session_id) {
            return;
        }

        await repository.recordClick({
            api_key: apiKey,
            client_id: clientId,
            session_id: props.chat.data.session_id,
            call_id: props.chat.callId,
            url: href,
        });
    };

    const extraData = useMemo(() => {
        return props.chat?.data;
    }, [ props.chat?.data ]);

    const searchToolCall = useMemo(() => {
        return extraData?.tool_calls?.find(toolCall => toolCall.action === 'Search');
    }, [ extraData ]);

    const copyAnswer = () => {
        if (markdownRef.current) {
            const messageText = markdownRef.current.innerText;
            navigator.clipboard.writeText(messageText);
        }
    };

    return (
        <div className={styles.layout}>
            <div className={styles.botProfile}>
                <img
                    src={props.aiThumbnail}
                    alt={props.aiName ?? 'profile'}
                    width={20}
                    height={20}
                />
                <div>{props.aiName}</div>
            </div>
            <div className={styles.message}>
                { searchToolCall
                    ? ( <SearchingBlock message={searchToolCall.action_message} /> )
                    : (
                        <>
                            <MarkdownRenderer
                                markdown={props.chat.message}
                                onClickLink={onClickLink}
                                ref={markdownRef}
                            />
                            { (extraData?.urls ?? []).length > 0 &&
                                <UrlBlock
                                    urls={extraData?.urls ?? []}
                                    onClickLink={onClickLink}
                                />
                            }
                            <div className={styles.utilButtonWrapper}>
                                <button
                                    className={styles.utilButton}
                                    onClick={copyAnswer}
                                >
                                    <img
                                        src={ClipboardImg}
                                        width={20}
                                        height={20}
                                        alt='clipboard'
                                    />
                                </button>
                                <button className={styles.utilButton}>
                                    <img
                                        src={ShareImg}
                                        width={20}
                                        height={20}
                                        alt='share'
                                    />
                                </button>
                            </div>
                        </>
                    )
                }
            </div>
            <div className={styles.loadingWrapper}>
                <Loading loading={loading} />
            </div>
        </div>
    );
};

export default BotMessage;