import InventoryItem from "interfaces/inventory-item";
import SortingAndFiltering, { Sort } from "interfaces/sorting-and-filtering";
import React, { ChangeEvent } from "react";
import { nameOf } from "utils/type-utils";

export const filterBarSortSelectOptions: Array<Sort> = [
    { orderBy: "asc", sortBy: nameOf<InventoryItem>("title"), displayName: "Title A-Z" },
    { orderBy: "desc", sortBy: nameOf<InventoryItem>("title"), displayName: "Title Z-A" },
    { orderBy: "asc", sortBy: nameOf<InventoryItem>("price"), displayName: "Price Asc" },
    { orderBy: "desc", sortBy: nameOf<InventoryItem>("price"), displayName: "Price Desc" },
];

interface FilterBarProps {
    currentParams: SortingAndFiltering;
    onInputChanged: (inputs: SortingAndFiltering) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentParams, onInputChanged }) => {
    return (
        <div className="has-background-white sticky-top">
            <div className="container">
                <div className="level py-4">
                    <div className="level-left">
                        <div className="field has-addons is-horizontal level-item">
                            <div className="control has-icons-left">
                                <span className="icon is-small is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    id="inventory-search-input"
                                    type="text"
                                    className="input"
                                    name="searchText"
                                    placeholder="Search"
                                    value={currentParams.searchText}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        onInputChanged({
                                            ...currentParams,
                                            skip: 0,
                                            searchText: e.currentTarget.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="control">
                                <button
                                    className="button"
                                    onClick={() =>
                                        onInputChanged({
                                            ...currentParams,
                                            skip: 0,
                                            searchText: "",
                                        })
                                    }>
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="field level-item">
                            <div className="control">
                                <div className="select">
                                    <select
                                        name="sort"
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            onInputChanged({
                                                ...currentParams,
                                                skip: 0,
                                                sort: JSON.parse(e.currentTarget.value),
                                            })
                                        }>
                                        {filterBarSortSelectOptions.map((option: Sort) => (
                                            <option
                                                key={option.sortBy + option.orderBy}
                                                value={JSON.stringify(
                                                    option
                                                )}>{`${option.displayName}`}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
