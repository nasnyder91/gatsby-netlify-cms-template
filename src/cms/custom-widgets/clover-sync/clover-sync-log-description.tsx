import { graphql, useStaticQuery } from "gatsby";
import React, { ChangeEvent, useEffect, useState } from "react";
import useAllInventoryItems from "~hooks/use-all-inventory-items";
import CmsWidgetProps from "~interfaces/cms-widget-props";
import InventoryItem from "~interfaces/inventory-item";
import { arrayHasValues, arrayIsEmpty } from "~utils/array-utils";
import { stringIsEmpty } from "~utils/string-utils";

function importAll(r) {
    return r.keys().map(r);
}

const itemFiles = importAll(require.context("../../../pages/inventory/", false, /\.(json)$/));
console.log("ITEMS:  ", itemFiles);

const CloverSyncLogDescription: React.FC<CmsWidgetProps> = ({ value, classNameWrapper, onChange }) => {
    const [loadingCloverItems, setLoadingCloverItems] = useState(true); // TODO create and change to useLoading hook

    const pullCloverItems = (): void => {
        fetch("/.netlify/functions/pull-clover-items")
            .then((response) => response.json())
            .then((result) => handlePullCloverItemsSuccess(result))
            .catch((err) => handlePullCloverItemsFailure(err));
    };

    const handlePullCloverItemsSuccess = (cloverItems: Array<InventoryItem>) => {
        console.log(cloverItems);
        // if (
        //     arrayIsEmpty(changedItems.itemsAdded) &&
        //     arrayIsEmpty(changedItems.itemsUpdated) &&
        //     arrayIsEmpty(changedItems.itemsRemoved)
        // ) {
        //     onChange("No items detected to have changed.");
        //     setLoadingCloverItems(false);
        // }
        // let newDescription = "Clover inventory items have been updated:\n\n";
        // if (arrayHasValues(changedItems.itemsAdded)) {
        //     const itemsAddedStringified = changedItems.itemsAdded.map((item) => item.name).join("\n");
        //     newDescription += `Added Items:\n${itemsAddedStringified}\n\n`;
        // }
        // if (arrayHasValues(changedItems.itemsUpdated)) {
        //     const itemsUpdatedStringified = changedItems.itemsUpdated.map((item) => item.name).join("\n");
        //     newDescription += `Updated Items:\n${itemsUpdatedStringified}\n\n`;
        // }
        // if (arrayHasValues(changedItems.itemsRemoved)) {
        //     const itemsRemovedStringified = changedItems.itemsRemoved.map((item) => item.name).join("\n");
        //     newDescription += `Removed Items:\n${itemsRemovedStringified}`;
        // }
        // onChange(newDescription);
        // setLoadingCloverItems(false);
    };

    const handlePullCloverItemsFailure = (err: any) => {
        const message = `Error received when attempting to determine updated Clover inventory items: ${String(err)}`;
        onChange(message);
        setLoadingCloverItems(false);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        onChange(e.target.value);
    };

    useEffect(() => {
        if (stringIsEmpty(value)) {
            pullCloverItems();
        }
    }, []);

    if (loadingCloverItems) {
        return <p className={classNameWrapper}>Loading...</p>;
    }

    return <textarea className={classNameWrapper} value={value} onChange={handleDescriptionChange} />;
};

export default CloverSyncLogDescription;
