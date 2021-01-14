const fetch = require("node-fetch");
const Clover = require("clover-ecomm-sdk");
const access_token = '582540d1-2fa6-dd03-7699-e107e6c03c0d';
const cloverInst = new Clover(access_token, {
    environment: 'development'
});


module.exports.handler = async (event, context) => {
    // return fetch(
    //     `https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/item_stocks/${event.queryStringParameters.id}?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d`,
    //     {
    //         method: "GET",
    //         headers: {
    //             Accept: "application/json",
    //         },
    //     },
    // )
    //     .then((response) => response.json())
    //     .then((data) => ({
    //         statusCode: 200,
    //         body: JSON.stringify(data),
    //     }))
    //     .catch((err) => ({
    //         statusCode: 422,
    //         body: String(err),
    //     }));

    let token = await cloverInst.charges.create({
        card: {
            'number': '4242424242424242',
            'brand': 'VISA',
            'exp_month': '12',
            'exp_year': '2030',
            'cvv': '123'
        },
        'apiKey': '792cdbef907a078de5dad83b0641e169'
    });

    let charge = await cloverInst.charges.create({
        amount: 1358,
        currency: 'usd',
        source: token.id
    });
    console.log(charge);
};
