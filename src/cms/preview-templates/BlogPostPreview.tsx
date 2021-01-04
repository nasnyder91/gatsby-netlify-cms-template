import React from "react";
import { BlogPostTemplate } from "~templates/blog-post";

interface BlogPostPreviewProps {
    entry: { getIn: (data: Array<string>) => any };
    widgetFor: (type: string) => any;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ entry, widgetFor }) => {
    const tags = entry.getIn(["data", "tags"]);
    return (
        <BlogPostTemplate
            content={widgetFor("body")}
            description={entry.getIn(["data", "description"])}
            tags={tags && tags.toJS()}
            title={entry.getIn(["data", "title"])}
        />
    );
};

export default BlogPostPreview;
