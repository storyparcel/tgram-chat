import React from 'react';
import { CHAT_MODEL_LOGOS } from 'src/constants';
import styles from './chatModelSelector.module.css'
import { useCallback } from 'react';

export type ChatModelType = 'T GRAM' | 'GPT 3.5' | 'GPT 4';

interface IChatModelSelector {
    chatModel: ChatModelType;
    onChange: (model: ChatModelType) => void;
};

const ChatModelSelector: React.FC<IChatModelSelector> = (props) => {
    const getButtonStyles = useCallback((modelName: ChatModelType) => {
        const active = modelName === props.chatModel;
        return {
            color: active ? '#30343C' : '#7B7D84',
            borderColor: active
                ? props.chatModel === 'T GRAM'
                    ? '#3B88FF'
                    : props.chatModel === 'GPT 3.5'
                        ? '#10A37F'
                        : props.chatModel === 'GPT 4'
                            ? '#A661F0'
                            : '#ffffff'
                : '#ffffff'
        };
    }, [ props.chatModel ]);

    return (
        <div className={styles.layout}>
            <div className={styles.innerWrapper}>
                { Object.entries(CHAT_MODEL_LOGOS).map(([ modelName, logo ]) => (
                    <button
                        className={styles.modelButton}
                        key={modelName}
                        // @ts-ignore
                        style={getButtonStyles(modelName)}
                        // @ts-ignore
                        onClick={() => props.onChange(modelName)}
                    >
                        <img
                            src={logo}
                            alt={modelName}
                            width={20}
                            height={20}
                        />
                        <div>{modelName}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatModelSelector;