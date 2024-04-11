import React from 'react';
import * as styles from './urlBlock.module.css';
import { CHAT_DEFAULT_IMAGE } from '../constants';
import { ChatUrl } from '@src/chat';

interface IUrlBlock {
    urls: Array<ChatUrl>;
    onClickLink: (href?: string) => Promise<void>;
}

const UrlBlock: React.FC<IUrlBlock> = (props) => {
    return (
        <ul className={styles.layout}>
            {(props.urls ?? []).map((url, i, arr) => {
                return (
                    <li className={styles.urlWrapper} key={`${url}-${i}`}>
                        <a
                            style={{ padding: 12, display: 'block' }}
                            href={url.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => {
                                if (props.onClickLink) {
                                    props.onClickLink(url.url);
                                }
                            }}
                        >
                            <div className={styles.thumbnailWrapper}
                            >
                                <img
                                    src={url.thumbnail ?? CHAT_DEFAULT_IMAGE}
                                    alt={url.title}
                                    width={48}
                                    height={48}
                                />
                                <div>
                                    {url.title}
                                </div>
                            </div>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default UrlBlock;
