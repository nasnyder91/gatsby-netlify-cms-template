import { ChangeEvent, useState } from "react";

const useInputChange = <T>(initialValues: T) => {
    const [inputs, setInputs] = useState(initialValues);

    const handleInputChange = (e: ChangeEvent<any>): void =>
        setInputs({
            ...inputs,
            [e.currentTarget.name]: e.currentTarget.value,
        });

    return { inputs, setInputs, handleInputChange };
};

export default useInputChange;
