import React from "react";
import { InventoryItemTemplate } from "../../templates/inventory-item-page";

interface BlogPostPreviewProps {
    entry: { getIn: (data: Array<string>) => any };
    widgetFor: (type: string) => any;
}

const InventoryItemPreview: React.FC<BlogPostPreviewProps> = ({ entry, widgetFor }) => {
    // const tags = entry.getIn(["data", "tags"]);
    return (
        <InventoryItemTemplate
            content={widgetFor("body")}
            description={entry.getIn(["data", "description"])}
            // tags={tags && tags.toJS()}
            title={entry.getIn(["data", "title"])}
        />
    );
};

export default InventoryItemPreview;
