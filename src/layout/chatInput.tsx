import React, { InputHTMLAttributes, useCallback, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import * as styles from './chatInput.module.css';
import { ASSETS, CHAT_INPUT_MAX_ROWS, CHAT_INPUT_MAX_SIZE } from '../constants';
import Loading from '../components/loading';

interface IChatInput extends InputHTMLAttributes<HTMLTextAreaElement> {
    sendMessage: () => void;
    responding: boolean;
    disabledSubmit: boolean;
};

const ChatInput: React.FC<IChatInput> = (props) => {
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.sendMessage();
    }, [ props.sendMessage ]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing || e.nativeEvent.key === 'Process') {
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitButtonRef.current?.click();
        }
    }, [ props.sendMessage ]);

    return (
        <form
            className={styles.layout}
            onSubmit={handleSubmit}
        >
            <TextareaAutosize
                className={styles.textArea}
                maxRows={CHAT_INPUT_MAX_ROWS}
                maxLength={CHAT_INPUT_MAX_SIZE}
                name='chat-input'
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                onKeyDown={handleKeyDown}
            />
            {props.responding
                ? (
                    <div className={styles.loadingWrapper}>
                        <Loading loading />
                    </div>
                )
                : (
                    <button
                        className={styles.submitButton}
                        ref={submitButtonRef}
                        type='submit'
                        disabled={props.disabledSubmit}
                    >
                        <img
                            src={props.disabledSubmit ? ASSETS['send-inactive-icon'] : ASSETS['send-active-icon']}
                            width={20}
                            height={20}
                            alt='send'
                        />
                    </button>
                )
            }
        </form>
    );
};

export default ChatInput;