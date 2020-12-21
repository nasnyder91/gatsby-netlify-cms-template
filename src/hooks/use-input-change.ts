import { ChangeEvent, useState } from "react";

const useInputChange = (initialValues) => {
    const [input, setInput] = useState(initialValues);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void =>
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value,
        });

    return [input, handleInputChange];
};

export default useInputChange;
