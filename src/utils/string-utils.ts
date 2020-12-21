const stringIsEmpty = (value: string): boolean => {
    if (value == null || value.length < 1) {
        return true;
    }

    return false;
};

const stringHasValue = (value: string): boolean => {
    if (value != null && value.length > 0) {
        return true;
    }

    return false;
};

export { stringHasValue, stringIsEmpty };
