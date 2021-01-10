import React, { ChangeEvent, useEffect } from "react";
import CmsWidgetProps from "~interfaces/cms-widget-props";
import { stringIsEmpty } from "~utils/string-utils";

const CloverSyncLogTitle: React.FC<CmsWidgetProps> = ({ value, classNameWrapper, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value);
    };

    useEffect(() => {
        if (stringIsEmpty(value)) {
            onChange(new Date().toISOString() + "_clover-sync");
        }
    }, []);

    return <input className={classNameWrapper} value={value} onChange={handleChange} />;
};

export default CloverSyncLogTitle;
