"use client";

import { appointmentTypeValues } from "@/db/schema/appointments";
import {
    Combobox,
    InputBase,
    useCombobox,
    Input,
    InputLabel,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export default function AppoinmentComboBox({
    value,
    setValue,
}: {
    value: string;
    setValue: Dispatch<
        SetStateAction<"" | (typeof appointmentTypeValues)[number]>
    >;
}) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const options = appointmentTypeValues.map((value) => {
        return (
            <Combobox.Option key={value} value={value}>
                {value.replaceAll("_", " ").toLocaleUpperCase()}
            </Combobox.Option>
        );
    });

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                setValue(val as (typeof appointmentTypeValues)[number] | "");
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSectionPointerEvents="none"
                    label="Type"
                    onClick={() => combobox.toggleDropdown()}
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
