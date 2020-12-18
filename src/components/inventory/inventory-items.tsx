import { graphql, StaticQuery } from "gatsby";
import React from "react";

import ItemThumbnail from "./item-thumbnail";

interface InventoryListingsProps {
    data: { allInventoryJson: { edges: Array<any> } };
}

const InventoryListings: React.FC<InventoryListingsProps> = ({ data }) => {
    const { edges: items } = data.allInventoryJson;
    console.log(items);

    return (
        <div className="tile is-ancestor">
            <div className="tile is-parent">
                {items &&
                    items.map(({ node: item }) => (
                        <ItemThumbnail
                            cssClassName="tile is-child is-3 notification"
                            item={item}
                            key={item.id}
                        />
                    ))}
            </div>
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
