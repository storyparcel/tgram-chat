import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './markdownRenderer.module.css';

interface IMarkdownRenderer {
    markdown: string;
    onClickLink?: (href?: string) => Promise<void>;
}

const MarkdownRenderer = React.forwardRef<HTMLDivElement, IMarkdownRenderer>((props, ref) => {
    return (
        <div className={styles.wrapper}>
            <div ref={ref}>
                <Markdown
                    components={{
                        a: ({ node, ...linkProps }) => {
                            return (
                                <a
                                    className={styles.link}
                                    href={linkProps.href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    onClick={() => {
                                        if (props.onClickLink) {
                                            props.onClickLink(linkProps.href);
                                        }
                                    }}
                                >{linkProps.children}</a>
                            );
                        },
                    }}
                    remarkPlugins={[remarkGfm]}
                >
                    {props.markdown}
                </Markdown>
            </div>
        </div>
    );
});

export default MarkdownRenderer;
