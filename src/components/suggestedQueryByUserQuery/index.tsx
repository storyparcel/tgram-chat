import React from 'react';
import * as styles from './index.module.css';
import { ASSETS } from '@src/constants';

interface ISuggestedQueryByUserQuery {
    queries: Array<string>;
    sendMessage: (message: string) => void;
};

const SuggestedQueryByUserQuery: React.FC<ISuggestedQueryByUserQuery> = (props) => {
    return (
        <div>
            <div className={styles.titleWrapper}>
                <div className={styles.titleIconWrapper}>
                    <img
                        src={ASSETS['more-options-icon']}
                        alt='suggest-icon'
                        width={16}
                        height={16}
                    />
                </div>
                <div className={styles.title}>추천질문</div>
            </div>
            <ul className={styles.balloonWrapper}>
                { props.queries.map((query, i, arr) => (
                    <li
                        className={styles.queryBalloonItem}
                        key={`${query}-${i}`}
                    >
                        <button
                            className={styles.queryBalloon}
                            onClick={() => props.sendMessage(query)}
                        >{query}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestedQueryByUserQuery;