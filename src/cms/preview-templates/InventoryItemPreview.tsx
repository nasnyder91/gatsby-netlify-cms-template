import React from "react";
import { InventoryItemTemplate } from "../../templates/inventory-item-page";

interface BlogPostPreviewProps {
    entry: any;
    widgetFor: (type: string) => any;
}

const InventoryItemPreview: React.FC<BlogPostPreviewProps> = ({ entry, widgetFor }) => {
    return <InventoryItemTemplate item={entry.get("data").toJS()} />;
};

export default InventoryItemPreview;
