const fetch = require("node-fetch");

module.exports.handler = async (event, context) => {
    return fetch(
        `https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/item_stocks/${event.queryStringParameters.id}?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        },
    )
        .then((response) => response.json())
        .then((data) => ({
            statusCode: 200,
            body: JSON.stringify(data),
        }))
        .catch((err) => ({
            statusCode: 422,
            body: String(err),
        }));
};
