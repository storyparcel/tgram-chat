import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import * as styles from './index.module.css';
import Button from '@src/uiResources/button';
import { ASSETS } from '@src/constants';

export type OpinionType = 'like' | 'dislike';
interface OpinionOptions {
    title: string;
    content: string;
    suggestions: Array<string>;
};

const getOptionsByOpinionType = (opinionType: OpinionType): OpinionOptions | null => {
    switch (opinionType) {
        case 'like':
            return {
                title: '어떤점이 마음에 드셨나요?',
                content: '‘좋아요’를 선택하신 이유를 선택 또는 직접작성해 주시면 티그램 서비스의 개선에 반영됩니다.',
                suggestions: [
                    '질문의 의도를 파악한 답변입니다.',
                    '많은 정보가 담긴 답변입니다.',
                ],
            };
        case 'dislike':
            return {
                title: '어떤 점이 마음에 들지 않으셨나요?',
                content: '‘싫어요’를 선택하신 이유를 선택 또는 직접작성해 주시면 티그램 서비스의 개선에 반영됩니다.',
                suggestions: [
                    '잘못된 정보가 포함되어 있습니다.',
                    '질문과 관계없는 답변입니다.',
                    '질문과 관계없는 답변입니다.',
                    '질문의 의도를 파악하지 못한 답변입니다.',
                    '답변에 요청사항이 반영되지 않았습니다.',
                ],
            };
        default:
            return null;
    };
};

interface IOpinionBox {
    opinionType: OpinionType;
    onSubmit: (comment: string) => void;
    onClose: () => void;
};

const OpinionBox = forwardRef<HTMLDivElement, IOpinionBox>((props, ref) => {
    const [ writingComment, setWritingComment ] = useState<boolean>(false);
    const [ comment, setComment ] = useState<string>('');

    const options = useMemo(() => {
        return getOptionsByOpinionType(props.opinionType);
    }, [ props.opinionType ]);

    useEffect(() => {
        if (writingComment === false) {
            setComment('');
        }
    }, [ writingComment ]);

    useEffect(() => {
        setWritingComment(false);
    }, [ props.opinionType ]);

    if (options === null) {
        return null;
    }

    return (
        <div ref={ref}>
            <div className={styles.layout}>
                <button
                    className={styles.closeButton}
                    onClick={props.onClose}
                >
                    <img
                        src={ASSETS['close']}
                        width={20}
                        height={20}
                        alt='close'
                    />
                </button>
                <div className={styles.title}>{options.title}</div>
                <div className={styles.content}>{options.content}</div>
                <div className={styles.suggestionWrapper}>
                    { options.suggestions.map((suggestion, index) => (
                        <button
                            className={styles.suggestionItem}
                            key={`${suggestion}-${index}`}
                            onClick={() => props.onSubmit(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                    <button
                        className={`${styles.suggestionItem}${writingComment ? ' writingComment' : ''}`}
                        onClick={() => setWritingComment(true)}
                    >
                        직접 작성
                    </button>
                </div>
                { writingComment &&
                    <>
                        <hr className={styles.divider} />
                        <input
                            className={styles.opinionInput}
                            placeholder='해당 답변에 관한 의견을 작성해 주세요'
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className={styles.buttonWrapper}>
                            <Button
                                theme='gray'
                                size='m'
                                style={{ fontSize: 14, borderRadius: 0, lineHeight: '20px' }}
                                onClick={() => setWritingComment(false)}
                            >취소</Button>
                            <Button
                                theme={comment ? 'blue' : 'disabled'}
                                size='m'
                                style={{ fontSize: 14, borderRadius: 0, lineHeight: '20px' }}
                                onClick={() => props.onSubmit(comment)}
                            >제출하기</Button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
});

export default OpinionBox;