import { graphql, StaticQuery } from "gatsby";
import InventoryItem from "interfaces/inventory-item";
import React from "react";

import ItemThumbnail from "./item-thumbnail";

interface InventoryListingsProps {
    data: { allInventoryJson: { edges: Array<any> } };
}

const InventoryListings: React.FC<InventoryListingsProps> = ({ data }) => {
    const { edges: items } = data.allInventoryJson;

    return (
        <div className="columns is-multiline">
            {items &&
                items.map(({ node: item }) => {
                    return (
                        <ItemThumbnail
                            // cssClassName="tile is-child is-3 box notification"
                            cssClassName="column is-one-fifth"
                            item={item}
                            key={item.id}
                        />
                    );
                })}
        </div>
    );
};

export default () => (
    <StaticQuery
        query={graphql`
            query InventoryItemsQuery {
                allInventoryJson(filter: { active: { eq: true } }) {
                    edges {
                        node {
                            id
                            title
                            description
                            price
                            sku
                            fields {
                                image {
                                    childImageSharp {
                                        fluid(maxWidth: 150, quality: 100) {
                                            ...GatsbyImageSharpFluid
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `}
        render={(data) => <InventoryListings data={data} />}
    />
);
