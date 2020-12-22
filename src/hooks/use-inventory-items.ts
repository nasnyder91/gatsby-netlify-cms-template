import { graphql, useStaticQuery } from "gatsby";
import InventoryItem from "interfaces/inventory-item";
import SortingAndFiltering, { Sort } from "interfaces/sorting-and-filtering";
import { useMemo } from "react";

const useInventoryItems = (inputs: SortingAndFiltering) => {
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

    const filterBySearchText = (
        searchText: string,
        itemsToFilter: Array<{ node: InventoryItem }>
    ): Array<{ node: InventoryItem }> => {
        const searchedResults = itemsToFilter.filter(({ node: item }) => {
            if (
                item.name.toLowerCase().includes(searchText) ||
                item.title.toLowerCase().includes(searchText) ||
                item.description.toLowerCase().includes(searchText)
            ) {
                return true;
            }
        });

        return searchedResults;
    };

    const orderAndSort = (
        sortOption: Sort,
        itemsToSort: Array<{ node: InventoryItem }>
    ): Array<{ node: InventoryItem }> => {
        const sortedResults = itemsToSort.sort(
            (
                { node: item1 }: { node: InventoryItem },
                { node: item2 }: { node: InventoryItem }
            ) => {
                if (item1[sortOption.sortBy] < item2[sortOption.sortBy]) {
                    return sortOption.orderBy === "asc" ? -1 : 1;
                }

                if (item1[sortOption.sortBy] > item2[sortOption.sortBy]) {
                    return sortOption.orderBy === "asc" ? 1 : -1;
                }

                return 0;
            }
        );

        return sortedResults;
    };

    const sortedItems = useMemo(() => {
        return orderAndSort(inputs.sort, items);
    }, [items, inputs.sort]);

    const allFilteredItems = useMemo(() => {
        return filterBySearchText(inputs.searchText, sortedItems);
    }, [sortedItems, inputs]);

    const currentItems = useMemo(() => {
        return [...allFilteredItems.slice(0, inputs.skip + inputs.take)];
    }, [allFilteredItems, inputs.skip]);

    return { currentItems, allFilteredItems };
};

export default useInventoryItems;
