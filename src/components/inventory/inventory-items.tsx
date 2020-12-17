import { graphql, StaticQuery } from "gatsby";
import React from "react";

interface InventoryListingsProps {
    data: { allInventoryJson: { edges: Array<any> } };
}

const InventoryListings: React.FC<InventoryListingsProps> = ({ data }) => {
    const { edges: items } = data.allInventoryJson;

    return <div>{items && items.map(({ node: item }) => <p>{item.title}</p>)}</div>;
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
                        }
                    }
                }
            }
        `}
        render={(data) => <InventoryListings data={data} />}
    />
);
