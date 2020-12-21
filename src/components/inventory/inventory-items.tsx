import React, { useEffect } from "react";

import ItemThumbnail from "./item-thumbnail";

import useInputChange from "../../hooks/use-input-change";
import useInventoryItems from "../../hooks/use-inventory-items";

const InventoryListings: React.FC = () => {
    const [input, handleInputChange] = useInputChange({
        search: "",
    });

    const [filteredItems, handleFilteringChange] = useInventoryItems();

    useEffect(() => {
        handleFilteringChange(input);
    }, [input]);

    return (
        <React.Fragment>
            <div>
                <div className="field">
                    <label htmlFor="inventory-search-input" className="label">
                        Search
                    </label>
                    <div className="control">
                        <input
                            id="inventory-search-input"
                            type="text"
                            className="input"
                            name="search"
                            value={input["search"]}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className="columns is-multiline">
                {filteredItems &&
                    filteredItems.map(({ node: item }) => {
                        return (
                            <ItemThumbnail
                                cssClassName="column is-one-fifth"
                                item={item}
                                key={item.id}
                            />
                        );
                    })}
            </div>
        </React.Fragment>
    );
};

export default InventoryListings;
