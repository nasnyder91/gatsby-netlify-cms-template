import React, { ChangeEvent, useEffect, useState } from "react";
import CmsWidgetProps from "~interfaces/cms-widget-props";
import InventoryItem from "~interfaces/inventory-item";
import { arrayHasValues, arrayIsEmpty } from "~utils/array-utils";
import { stringIsEmpty } from "~utils/string-utils";

const CloverSyncLogDescription: React.FC<CmsWidgetProps> = ({ value, classNameWrapper, onChange }) => {
    const [loadingCloverItems, setLoadingCloverItems] = useState(true); // TODO create and change to useLoading hook

    const pullAndCompareItems = (): void => {
        fetch("/.netlify/functions/pull-and-compare-items")
            .then((response) => response.json())
            .then((result) => handlePullAndCompareItemsSuccess(result))
            .catch((err) => handlePullAndCompareItemsFailure(err));
    };

    const handlePullAndCompareItemsSuccess = (changedItems: {
        itemsUpdated: Array<InventoryItem>;
        itemsAdded: Array<InventoryItem>;
        itemsRemoved: Array<InventoryItem>;
    }) => {
        if (
            arrayIsEmpty(changedItems.itemsAdded) &&
            arrayIsEmpty(changedItems.itemsUpdated) &&
            arrayIsEmpty(changedItems.itemsRemoved)
        ) {
            onChange("No items detected to have changed.");
            setLoadingCloverItems(false);
        }

        let newDescription = "Clover inventory items have been updated:\n\n";

        if (arrayHasValues(changedItems.itemsAdded)) {
            const itemsAddedStringified = changedItems.itemsAdded.map((item) => item.name).join("\n");
            newDescription += `Added Items:\n${itemsAddedStringified}\n\n`;
        }

        if (arrayHasValues(changedItems.itemsUpdated)) {
            const itemsUpdatedStringified = changedItems.itemsUpdated.map((item) => item.name).join("\n");
            newDescription += `Updated Items:\n${itemsUpdatedStringified}\n\n`;
        }

        if (arrayHasValues(changedItems.itemsRemoved)) {
            const itemsRemovedStringified = changedItems.itemsRemoved.map((item) => item.name).join("\n");
            newDescription += `Removed Items:\n${itemsRemovedStringified}`;
        }

        onChange(newDescription);
        setLoadingCloverItems(false);
    };

    const handlePullAndCompareItemsFailure = (err: any) => {
        const message = `Error received when attempting to determine updated Clover inventory items: ${String(err)}`;
        onChange(message);
        setLoadingCloverItems(false);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        onChange(e.target.value);
    };

    useEffect(() => {
        if (stringIsEmpty(value)) {
            pullAndCompareItems();
        }
    }, []);

    if (loadingCloverItems) {
        return <p className={classNameWrapper}>Loading...</p>;
    }

    return <textarea className={classNameWrapper} value={value} onChange={handleDescriptionChange} />;
};

export default CloverSyncLogDescription;
