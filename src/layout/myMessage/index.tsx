import React from 'react';
import * as styles from './index.module.css';
import { ASSETS } from '@src/constants';

interface IMyMessage {
    message: string;
};

const MyMessage: React.FC<IMyMessage> = (props) => {
    const copyAnswer = () => {
        navigator.clipboard.writeText(props.message)
            .then(() => {
                // NOTE: 별도 피드백이 필요할 때.
            })
            .catch((err) => {
                // NOTE: 별도 피드백이 필요할 때.
                console.error(err);
            });
    };


    return (
        <div className={styles.layout}>
            <div className={styles.message}>{props.message}</div>
            <button className={styles.copyButton}></button>
            <button
                className={styles.copyButton}
                onClick={copyAnswer}
            >
                <img
                    src={ASSETS['clipboard-icon']}
                    width={20}
                    height={20}
                    alt='clipboard'
                />
            </button>
        </div>
    );
};

export default MyMessage;
