import React, { useEffect, useRef } from "react";
import ItemThumbnail from "./item-thumbnail";
import useInventoryItems from "../../hooks/use-inventory-items";
import FilterBar from "./filter-bar";
import SortingAndFiltering, { Sort } from "../../interfaces/sorting-and-filtering";
import { nameOf } from "../../utils/type-utils";
import InventoryItem from "../../interfaces/inventory-item";
import useInputChange from "../../hooks/use-input-change";
import usePrevious from "../../hooks/use-previous";
import { useScrollPosition } from "../../hooks/use-scroll-position";
import { arrayHasValues } from "../../utils/array-utils";

const defaultParams: SortingAndFiltering = {
    searchText: "",
    sort: { orderBy: "desc", sortBy: nameOf<InventoryItem>("title") },
    skip: 0,
    take: 10,
};

const handleLoadMore = (currInputs, setter) => {
    setter({
        ...currInputs,
        skip: currInputs.skip + currInputs.take,
    });
};

const InventoryListings: React.FC = () => {
    const itemGridRef = useRef(null);

    const { inputs, setInputs } = useInputChange(defaultParams);
    const inputsRef = useRef(inputs);
    const setInputsWithRef = (updatedInputs: SortingAndFiltering): void => {
        inputsRef.current = updatedInputs;
        setInputs(updatedInputs);
    };

    const prevInputs = usePrevious(inputs) || defaultParams;
    const { currentItems, allFilteredItems, handleParamChange } = useInventoryItems(
        inputs,
        prevInputs
    );
    const currentItemsRef = useRef(currentItems);
    const allFilteredItemsRef = useRef(allFilteredItems);

    useEffect(() => {
        handleParamChange();
    }, [inputs]);

    useEffect(() => {
        currentItemsRef.current = currentItems;
        allFilteredItemsRef.current = allFilteredItems;
    }, [currentItems, allFilteredItems]);

    useScrollPosition(
        ({ currPos }) => {
            if (
                arrayHasValues(currentItemsRef.current) &&
                currentItemsRef.current.length < allFilteredItemsRef.current.length &&
                currPos.y +
                    itemGridRef.current.getBoundingClientRect().height -
                    window.innerHeight <
                    400
            ) {
                console.log(inputsRef.current);
                setInputsWithRef({
                    ...inputsRef.current,
                    skip: inputsRef.current.skip + inputsRef.current.take,
                });
            }
        },
        [],
        itemGridRef,
        false,
        100
    );

    return (
        <React.Fragment>
            <FilterBar currentParams={inputs} onInputChanged={setInputsWithRef} />
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
            {/* {currentItems.length < allFilteredItems.length && (
                <button className="button" onClick={() => handleLoadMore(inputs, setInputsWithRef)}>
                    Load More
                </button>
            )} */}
        </React.Fragment>
    );
};

export default InventoryListings;
