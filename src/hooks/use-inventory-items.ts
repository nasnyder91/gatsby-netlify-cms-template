import { graphql, useStaticQuery } from "gatsby";
import { useState } from "react";
import { stringHasValue } from "../utils/string-utils";

const useInventoryItems = () => {
    const { allInventoryJson: { edges: items } = [] } = useStaticQuery(
        graphql`
            query ALL_INVENTORY_ITEMS {
                allInventoryJson(filter: { active: { eq: true } }) {
                    edges {
                        node {
                            id
                            name
                            title
                            description
                            price
                            sku
                            fields {
                                image {
                                    childImageSharp {
                                        fluid {
                                            ...GatsbyImageSharpFluid
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
    );
    const [filteredItems, setFilteredItems] = useState(items);

    const handleFilteringChange = (inputs) => {
        let filteredResults = [...items];
        const searchText = inputs["search"];

        if (stringHasValue(searchText)) {
            filteredResults = filteredResults.filter(({ node: item }) => {
                if (
                    item.name.toLowerCase().includes(searchText) ||
                    item.title.toLowerCase().includes(searchText) ||
                    item.description.toLowerCase().includes(searchText)
                ) {
                    return true;
                }
            });
        }

        setFilteredItems(filteredResults);
    };

    return [filteredItems, handleFilteringChange];
};

export default useInventoryItems;
