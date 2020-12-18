const formatCurrency = (number: number, includeDecimal: boolean = true): string => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: includeDecimal ? 2 : 0,
        maximumFractionDigits: includeDecimal ? 2 : 0,
    });

    let formattedNumber = formatter.format(number);

    return formattedNumber;
};

export { formatCurrency };
