import React from 'react';
import styles from './searchingBlock.module.css';

interface ISearchingBlock {
    message: string;
}

const SearchingBlock: React.FC<ISearchingBlock> = (props) => {
    return (
        <div className={styles.layout}>
            {props.message}
        </div>
    );
};

export default SearchingBlock;
