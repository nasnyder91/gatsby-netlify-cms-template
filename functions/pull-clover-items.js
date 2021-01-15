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

    return {
        statusCode: 200,
        body: JSON.stringify(results),
    };
};
