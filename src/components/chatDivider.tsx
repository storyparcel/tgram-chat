import React from 'react';
import * as styles from './chatDivider.module.css';

const ChatDivider: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.line} />
            <div className={styles.textWrapper}>
                <div className={styles.title1}>새로운 대화가 시작되었습니다.</div>
                <div className={styles.title2}>이전 대화는 참조되지 않습니다.</div>
            </div>
            <div className={styles.line} />
        </div>
    );
};

export default ChatDivider;