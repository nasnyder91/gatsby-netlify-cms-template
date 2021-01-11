const fetch = require("node-fetch");
const fs = require("fs");
const glob = require("glob");

// On successful Clover API request, compares and returns items that have been added or changed.

module.exports.handler = async (event, context) => {
    const response = await fetch(
        "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=500",
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        },
    );

    if (!response.ok) {
        return {
            statusCode: 422,
            body: `Clover API responded with status code: ${response.status}`,
        };
    }

    const results = await response.json();

    const itemsUpdated = [];
    const itemsAdded = [];
    const itemsRemoved = [];

    results.elements.forEach((item) => {
        try {
            fileData = JSON.parse(fs.readFileSync(__dirname + `src/pages/inventory/${item.id}.json`, "utf-8"));
            for (const key of Object.keys(item)) {
                if (item[key] !== fileData[key]) {
                    itemsUpdated.push({ ...item });
                    break;
                }
            }
        } catch {
            itemsAdded.push({ ...item });
        }
    });

    glob.sync(__dirname + "src/pages/inventory/*.json").forEach((file) => {
        const itemId = file.split("/").pop().split(".")[0];

        if (results.elements.find((item) => item.id === itemId) == null) {
            const item = JSON.parse(fs.readFileSync(file, "utf-8"));
            itemsRemoved.push({ ...item });
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ itemsUpdated: itemsUpdated, itemsAdded: itemsAdded, itemsRemoved: itemsRemoved }),
    };
};
