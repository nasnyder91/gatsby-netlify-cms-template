import React from "react";
import { graphql, StaticQuery } from "gatsby";

const Tester: React.FC<any> = ({ data }) => {
    console.log(data);
    const items = data.allCloverInventoryItems.edges;
    return (
        <div>
            {items.map((item) => (
                <div key={item.node.id}>{item.node.name}</div>
            ))}
        </div>
    );
};

export default () => (
    <StaticQuery
        query={graphql`
            query CloverInventoryQuery {
                allCloverInventoryItems {
                    edges {
                        node {
                            id
                            hidden
                            name
                            code
                            sku
                            price
                            stockCount
                        }
                    }
                }
            }
        `}
        render={(data) => <Tester data={data} />}
    />
);
