import React, {useState} from 'react';
import {InputRangeProps} from "@src/shared/ui/elements/input-range/types";

function InputRange({ min, max, changeValues}: InputRangeProps) {
    const [value, setValue] = useState<number>(min);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
        if(changeValues) changeValues(Number(event.target.value))
    };

    return (
        <div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
            />
            <span>{value}</span>
        </div>
    );
}

export default InputRange;
