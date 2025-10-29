"use client";

import { appointmentTypeValues } from "@/db/schema/appointments";
import { Combobox, InputBase, useCombobox, Input } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type AppointmentType = (typeof appointmentTypeValues)[number];

interface AppointmentComboBoxProps {
    value: string;
    label: string;
    onChange?: (value: string) => void; // ✅ form-compatible
    onBlur?: () => void; // ✅ form-compatible
    error?: string; // ✅ optional error display
    setValue?: Dispatch<SetStateAction<AppointmentType | null>>; // fallback if no form
}

export default function AppointmentComboBox({
    value,
    onChange,
    onBlur,
    error,
    setValue,
}: AppointmentComboBoxProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = appointmentTypeValues.map((val) => (
        <Combobox.Option key={val} value={val}>
            {val.replaceAll("_", " ").toUpperCase()}
        </Combobox.Option>
    ));

    const handleSelect = (val: string) => {
        if (onChange) onChange(val);
        if (setValue) setValue(val as AppointmentType | null);
        combobox.closeDropdown();
    };

    return (
        <Combobox store={combobox} onOptionSubmit={handleSelect}>
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    error={error}
                    pointer
                    onClick={() => combobox.toggleDropdown()}
                    onBlur={onBlur}
                >
                    {value || <Input.Placeholder>Pick value</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
