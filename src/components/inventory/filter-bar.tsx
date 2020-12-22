import InventoryItem from "../../interfaces/inventory-item";
import SortingAndFiltering, { Sort } from "../../interfaces/sorting-and-filtering";
import React, { ChangeEvent } from "react";
import { nameOf } from "../../utils/type-utils";

const sortSelectOptions: Array<Sort> = [
    { orderBy: "desc", sortBy: nameOf<InventoryItem>("title") },
    { orderBy: "asc", sortBy: nameOf<InventoryItem>("title") },
    { orderBy: "desc", sortBy: nameOf<InventoryItem>("price") },
    { orderBy: "asc", sortBy: nameOf<InventoryItem>("price") },
];

interface FilterBarProps {
    currentParams: SortingAndFiltering;
    onInputChanged: (inputs: SortingAndFiltering) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentParams, onInputChanged }) => {
    return (
        <div className="level">
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
                                onInputChanged({ ...currentParams, skip: 0, searchText: "" })
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
                                {sortSelectOptions.map((option: Sort) => (
                                    <option
                                        key={option.sortBy + option.orderBy}
                                        value={JSON.stringify(
                                            option
                                        )}>{`${option.sortBy} ${option.orderBy}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
