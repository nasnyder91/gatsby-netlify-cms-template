import React, { useCallback, useRef } from "react";
import ItemThumbnail from "components/inventory/item-thumbnail";
import useInventoryItems from "hooks/use-inventory-items";
import FilterBar, { filterBarSortSelectOptions } from "components/inventory/filter-bar";
import SortingAndFiltering from "interfaces/sorting-and-filtering";
import useInputChange from "hooks/use-input-change";
import { useScrollPosition } from "hooks/use-scroll-position";
import { arrayHasValues } from "utils/array-utils";

const defaultParams: SortingAndFiltering = {
    searchText: "",
    sort: filterBarSortSelectOptions[0],
    skip: 0,
    take: 20,
};

const InventoryListings: React.FC = () => {
    const itemGridRef = useRef(null);

    const { inputs, setInputs } = useInputChange(defaultParams);

    const { currentItems, allFilteredItems } = useInventoryItems(inputs);

    const scrollCallback = useCallback(
        ({ currPos }) => {
            if (
                arrayHasValues(currentItems) &&
                currentItems.length < allFilteredItems.length &&
                currPos.y +
                    itemGridRef.current.getBoundingClientRect().height -
                    window.innerHeight <
                    300
            ) {
                setInputs({
                    ...inputs,
                    skip: inputs.skip + inputs.take,
                });
            }
        },
        [inputs, currentItems, allFilteredItems]
    );

    useScrollPosition(scrollCallback, [scrollCallback], itemGridRef, false, 100);

    return (
        <React.Fragment>
            <FilterBar currentParams={inputs} onInputChanged={setInputs} />
            <div className="container">
                <div className="content">
                    <div className="columns is-multiline" ref={itemGridRef}>
                        {currentItems &&
                            currentItems.map(({ node: item }) => {
                                return (
                                    <ItemThumbnail
                                        cssClassName="column is-one-fifth"
                                        item={item}
                                        key={item.id}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default InventoryListings;
