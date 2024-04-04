import React from 'react';
import { ChatUrl } from 'src/chat';
interface IUrlBlock {
    urls: Array<ChatUrl>;
    onClickLink: (href?: string) => Promise<void>;
}
declare const UrlBlock: React.FC<IUrlBlock>;
export default UrlBlock;
//# sourceMappingURL=urlBlock.d.ts.map