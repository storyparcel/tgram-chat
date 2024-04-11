import React from 'react';
import styles from './suggestQueryByUserQuery.module.css'
import MoreDotImg from '../assets/icons/more-options-icon.svg';

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
                        src={MoreDotImg}
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
                        <div
                            className={styles.queryBalloon}
                            onClick={() => props.sendMessage(query)}
                        >{query}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestedQueryByUserQuery;