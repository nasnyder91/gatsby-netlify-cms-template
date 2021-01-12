import { graphql, useStaticQuery } from "gatsby";

const useAllInventoryItems = () => {
    const { allInventoryJson: { edges: items } = [] } = useStaticQuery(
        graphql`
            query ALL_BASE_INVENTORY_ITEMS {
                allInventoryJson {
                    edges {
                        node {
                            id
                            name
                            title
                            description
                            price
                        }
                    }
                }
            }
        `,
    );

    return { items };
};

export default useAllInventoryItems;
