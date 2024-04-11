import React from 'react';
interface IMarkdownRenderer {
    markdown: string;
    onClickLink?: (href?: string) => Promise<void>;
}
declare const MarkdownRenderer: React.ForwardRefExoticComponent<IMarkdownRenderer & React.RefAttributes<HTMLDivElement>>;
export default MarkdownRenderer;
//# sourceMappingURL=markdownRenderer.d.ts.map