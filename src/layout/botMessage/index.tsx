import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as styles from './index.module.css';
import Loading from '../../components/loading';
import UrlBlock from '../../blocks/urlBlock';
import MarkdownRenderer from '../../components/markdownRenderer';
import SearchingBlock from '../../blocks/searchingBlock';
import { useKeyContext } from '@src/contexts/keyContext';
import repository from '@src/repository';
import { ASSETS } from '@src/constants';
import OpinionBox, { OpinionType } from '@src/components/opinionBox';
import { Chat } from '@src/contexts/chatContext';

interface IBotMessage {
    chat: Chat;
    aiName: string;
    aiThumbnail: string;
}

const BotMessage: React.FC<IBotMessage> = (props) => {
    const [ showOpinionBox, setShowOpinionBox ] = useState<boolean>(false);
    const [ currentOpinion, setCurrentOpinion ] = useState<OpinionType | null>(null);

    const markdownRef = useRef<HTMLDivElement>(null);
    const loading = useMemo(() => props.chat.terminated === false, [ props.chat.terminated ]);
    const { apiKey, clientId } = useKeyContext();

    const openOpinionBox = useCallback((opinionType: OpinionType) => {
        setShowOpinionBox(true);
        setCurrentOpinion(opinionType);
    }, []);

    const closeOpinionBox = useCallback(() => {
        setShowOpinionBox(false);
        setCurrentOpinion(null);
    }, []);

    const handleSubmitOpinion = useCallback((comment: string) => {
        window.alert(JSON.stringify({
            sessionId: props.chat.data?.session_id,
            callId: props.chat.callId,
            like: currentOpinion === 'like',
            comment,
        }, null, 2))
    }, [ props.chat, currentOpinion ]);

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
                            { !loading &&
                                <div className={styles.utilButtonWrapper}>
                                    <button
                                        className={styles.utilButton}
                                        onClick={copyAnswer}
                                    >
                                        <img
                                            src={ASSETS['clipboard-icon']}
                                            width={20}
                                            height={20}
                                            alt='clipboard'
                                        />
                                    </button>
                                    {/* TODO: 공유하기 활성화 */}
                                    {/* <button className={styles.utilButton}>
                                        <img
                                            src={ASSETS['share-icon']}
                                            width={20}
                                            height={20}
                                            alt='share'
                                        />
                                    </button> */}
                                    <div className={styles.utilButtonDivider} />
                                    <button
                                        className={styles.utilButton}
                                        onClick={() => openOpinionBox('like')}
                                    >
                                        <img
                                            src={ASSETS['thumbs-up-inactive']}
                                            width={20}
                                            height={20}
                                            alt='thumbs-up'
                                        />
                                    </button>
                                    <button
                                        className={`${styles.utilButton} ${styles.rotatedImage}`}
                                        onClick={() => openOpinionBox('dislike')}
                                    >
                                        <img
                                            src={ASSETS['thumbs-up-inactive']}
                                            width={20}
                                            height={20}
                                            alt='thumbs-down'
                                        />
                                    </button>
                                </div>
                            }
                        </>
                    )
                }
            </div>
            { showOpinionBox && currentOpinion &&
                <div className={styles.opinionBoxWrapper}>
                    <OpinionBox
                        opinionType={currentOpinion}
                        onSubmit={handleSubmitOpinion}
                        onClose={closeOpinionBox}
                    />
                </div>
            }
            <div className={styles.loadingWrapper}>
                <Loading loading={loading} />
            </div>
        </div>
    );
};

export default BotMessage;