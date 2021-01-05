import React from "react";
import { InventoryItemTemplate } from "~templates/inventory-item-page";

interface BlogPostPreviewProps {
    entry: any;
    widgetFor: (type: string) => any;
}

const InventoryItemPreview: React.FC<BlogPostPreviewProps> = ({ entry, widgetFor }) => {
    const previewedItem = {
        ...entry.get("data").toJS(),
        description: widgetFor("description"),
    };
    return <InventoryItemTemplate item={previewedItem} isCmsPreview={true} />;
};

export default InventoryItemPreview;
