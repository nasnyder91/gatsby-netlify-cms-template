import React, { ChangeEvent, useEffect, useState } from "react";
import CmsWidgetProps from "~interfaces/cms-widget-props";
import InventoryItem from "~interfaces/inventory-item";
import { arrayHasValues, arrayIsEmpty } from "~utils/array-utils";
import { stringIsEmpty } from "~utils/string-utils";

function importAll(r) {
    return r.keys().map(r);
}

const localInventoryItems = importAll(require.context("../../../pages/inventory/", false, /\.(json)$/));

const CloverSyncLogDescription: React.FC<CmsWidgetProps> = ({ value, classNameWrapper, onChange }) => {
    const [loadingCloverItems, setLoadingCloverItems] = useState(true); // TODO create and change to useLoading hook

    const pullCloverItems = (): void => {
        fetch("/.netlify/functions/pull-clover-items")
            .then((response) => response.json())
            .then((result) => handlePullCloverItemsSuccess(result))
            .catch((err) => handlePullCloverItemsFailure(err));
    };

    const handlePullCloverItemsSuccess = (cloverItems: { elements: Array<InventoryItem> }) => {
        const itemComparisons = compareCloverItemsToLocal(cloverItems.elements);
        buildDescription(itemComparisons);
    };

    const handlePullCloverItemsFailure = (err: any) => {
        const message = `Error received when attempting to determine updated Clover inventory items: ${String(err)}`;
        onChange(message);
        setLoadingCloverItems(false);
    };

    const compareCloverItemsToLocal = (
        cloverItems: Array<InventoryItem>,
    ): {
        itemsAdded: Array<InventoryItem>;
        itemsUpdated: Array<InventoryItem>;
        itemsRemoved: Array<InventoryItem>;
    } => {
        const itemsUpdated: Array<InventoryItem> = [];
        const itemsAdded: Array<InventoryItem> = [];
        const itemsRemoved: Array<InventoryItem> = [];

        cloverItems.forEach((item: InventoryItem) => {
            const localItem = localInventoryItems.find((i: InventoryItem) => i.id === item.id);

            if (localItem == null) {
                itemsAdded.push(item);
            } else {
                for (const key of Object.keys(item)) {
                    if (item[key] !== localItem[key]) {
                        itemsUpdated.push(item);
                        break;
                    }
                }
            }
        });

        localInventoryItems.forEach((i: InventoryItem) => {
            if (cloverItems.find((ci: InventoryItem) => ci.id === i.id) == null) {
                itemsRemoved.push(i);
            }
        });

        return { itemsUpdated, itemsAdded, itemsRemoved };
    };

    const buildDescription = (itemComparisons: {
        itemsAdded: Array<InventoryItem>;
        itemsUpdated: Array<InventoryItem>;
        itemsRemoved: Array<InventoryItem>;
    }): void => {
        if (
            arrayIsEmpty(itemComparisons.itemsAdded) &&
            arrayIsEmpty(itemComparisons.itemsUpdated) &&
            arrayIsEmpty(itemComparisons.itemsRemoved)
        ) {
            onChange("No items detected to have changed.");
            setLoadingCloverItems(false);
            return;
        }

        let newDescription = "Clover inventory items have been updated:\n\n";
        if (arrayHasValues(itemComparisons.itemsAdded)) {
            const itemsAddedStringified = itemComparisons.itemsAdded.map((item) => item.name).join("\n");
            newDescription += `Added Items:\n${itemsAddedStringified}\n\n`;
        }
        if (arrayHasValues(itemComparisons.itemsUpdated)) {
            const itemsUpdatedStringified = itemComparisons.itemsUpdated.map((item) => item.name).join("\n");
            newDescription += `Updated Items:\n${itemsUpdatedStringified}\n\n`;
        }
        if (arrayHasValues(itemComparisons.itemsRemoved)) {
            const itemsRemovedStringified = itemComparisons.itemsRemoved.map((item) => item.name).join("\n");
            newDescription += `Removed Items:\n${itemsRemovedStringified}`;
        }
        onChange(newDescription);
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

    return (
        <textarea
            className={classNameWrapper}
            style={{ height: "300px" }}
            value={value}
            onChange={handleDescriptionChange}
        />
    );
};

export default CloverSyncLogDescription;
