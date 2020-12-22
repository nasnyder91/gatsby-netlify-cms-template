const arrayHasValues = (arr: Array<any>): boolean => {
    return arr !== null && arr.length > 0;
};

const arrayIsEmpty = (arr: Array<any>): boolean => {
    return arr === null || arr.length < 1;
};

export { arrayHasValues, arrayIsEmpty };
