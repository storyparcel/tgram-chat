/// <reference types="react" />
interface IMarkdownRenderer {
    markdown: string;
    onClickLink?: (href?: string) => Promise<void>;
}
declare const MarkdownRenderer: import("react").ForwardRefExoticComponent<IMarkdownRenderer & import("react").RefAttributes<HTMLDivElement>>;
export default MarkdownRenderer;
//# sourceMappingURL=markdownRenderer.d.ts.map