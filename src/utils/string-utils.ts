const stringIsEmpty = (value: string): boolean => {
    return value == null || value.length < 1;
};

const stringHasValue = (value: string): boolean => {
    return value != null && value.length > 0;
};

export { stringHasValue, stringIsEmpty };
