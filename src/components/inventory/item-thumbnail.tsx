import PreviewCompatibleImage from "~components/preview-compatible-image";
import InventoryItem from "~interfaces/inventory-item";
import React from "react";
import { Link } from "gatsby";
import { formatCurrency } from "~utils/number-utils";

interface ItemThumbnailProps {
    cssClassName: string;
    item: InventoryItem;
}

const ItemThumbnail: React.FC<ItemThumbnailProps> = ({ cssClassName, item }) => {
    return (
        <div className={cssClassName}>
            <Link
                // className="title has-text-primary is-size-4"
                to={`/items/${item.id}`}>
                <div className="card">
                    <div className="card-image">
                        <figure className="image">
                            <PreviewCompatibleImage
                                imageInfo={{
                                    image: item.fields.image,
                                    alt: `image of ${item.title}`,
                                    style: {
                                        maxWidth: "150px",
                                    },
                                }}
                            />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="content">
                            <p>{item.title}</p>
                            <p>{formatCurrency(item.price / 100)}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ItemThumbnail;
