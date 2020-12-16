import React from "react";

interface ContentProps {
    content: any;
    cssClassName?: string;
}

export const HTMLContent: React.FC<ContentProps> = ({ cssClassName, content }) => (
    <div className={cssClassName} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content: React.FC<ContentProps> = ({ cssClassName, content }) => (
    <div className={cssClassName}>{content}</div>
);

export default Content;
