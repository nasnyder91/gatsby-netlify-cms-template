import ImageInfo from "./image-info";

interface InventoryItem {
    alternateName?: string;
    price?: number;
    name?: string;
    title?: string;
    stockCount?: number;
    id?: string;
    sku?: string;
    fields?: { image: ImageInfo };
    isFeatured?: boolean;
}

export default InventoryItem;
