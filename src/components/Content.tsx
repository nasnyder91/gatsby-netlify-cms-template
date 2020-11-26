import React from "react";

interface ContentProps {
    content: any;
    className: string;
}

export const HTMLContent: React.FC<ContentProps> = ({ className, content }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content: React.FC<ContentProps> = ({ className, content }) => (
    <div className={className}>{content}</div>
);

export default Content;
