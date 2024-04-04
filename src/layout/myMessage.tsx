import React from 'react';
import styles from './myMessage.module.css';

interface IMyMessage {
    message: string;
};

const MyMessage: React.FC<IMyMessage> = (props) => {
    return (
        <div className={styles.layout}>
            <div className={styles.message}>{props.message}</div>
        </div>
    );
};

export default MyMessage;
