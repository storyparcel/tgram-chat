import React from 'react';
import * as styles from './index.module.css';
import { SuggestedQuery } from '@src/chat/anonymous';

interface ISuggestQuery {
    queries: Array<SuggestedQuery>;
    sendMessage: (message: string) => void;
};

const SuggestQuery: React.FC<ISuggestQuery> = (props) => {
    return (
        <div className={styles.layout}>
            { props.queries.map((query, i) => (
                <button
                    key={`${query}-${i}`}
                    className={styles.questionItem}
                    onClick={() => props.sendMessage(query.query)}
                >
                    {query.query}
                </button>
            ))}
        </div>
    );
};

export default SuggestQuery;