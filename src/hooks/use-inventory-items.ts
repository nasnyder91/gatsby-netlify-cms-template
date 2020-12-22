import { graphql, useStaticQuery } from "gatsby";
import InventoryItem from "interfaces/inventory-item";
import SortingAndFiltering, { Sort } from "interfaces/sorting-and-filtering";
import { useEffect, useState } from "react";
import { stringHasValue } from "../utils/string-utils";

const useInventoryItems = (initialParams: SortingAndFiltering) => {
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

    const [allFilteredItems, setAllFilteredItems] = useState(items);

    const [currentItems, setCurrentItems] = useState(
        allFilteredItems.slice(initialParams.skip, initialParams.take)
    );

    useEffect(() => {
        setCurrentItems(allFilteredItems.slice(initialParams.skip, initialParams.take));
    }, [allFilteredItems]);

    const handleParamChange = (
        inputs: SortingAndFiltering,
        prevInputs: SortingAndFiltering
    ): void => {
        // if only the skip has changed, and no other params have changed, then load in next page of items
        if (
            inputs.searchText === prevInputs.searchText &&
            inputs.sort === prevInputs.sort &&
            inputs.skip !== prevInputs.skip
        ) {
            setCurrentItems([
                ...currentItems,
                ...allFilteredItems.slice(inputs.skip, inputs.skip + inputs.take),
            ]);
            return;
        }

        let filteredResults = [...items];

        if (stringHasValue(inputs.searchText)) {
            filteredResults = filterBySearchText(inputs.searchText, filteredResults);
        }

        filteredResults = orderAndSort(inputs.sort, filteredResults);

        setAllFilteredItems(filteredResults);
    };

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

    // const handleFilteringChange = (inputs) => {};

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

    // const handleOrderByChange = () => {};

    return { currentItems, allFilteredItems, handleParamChange };
};

export default useInventoryItems;
