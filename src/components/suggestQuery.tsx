import { SuggestedQuery } from "src/chat";
import styles from './suggestQuery.module.css';

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