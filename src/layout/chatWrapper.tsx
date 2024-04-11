import React from 'react';
import * as styles from './chatWrapper.module.css';

interface IChatWrapper {
    isMobile: boolean;
    bottomHeight: number;
    children: React.ReactNode;
};

const ChatWrapper: React.FC<IChatWrapper> = (props) => {
    return (
        <div
            className={props.isMobile ? styles.wrapperMobile : styles.wrapperDesktop}
            style={props.bottomHeight === undefined
                ? {}
                : { paddingBottom: props.bottomHeight }
            }
        >{props.children}</div>
    );
};

export default ChatWrapper;