"use client";

import {
    CheckIcon,
    Combobox,
    Group,
    Input,
    InputBase,
    InputBaseProps,
    useCombobox,
} from "@mantine/core";
import { useState } from "react";

interface GenderComboProps extends InputBaseProps {
    options: string[];
    name: string;
}
export function CustomComboBox({ options, name, ...props }: GenderComboProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: (eventSource) => {
            if (eventSource === "keyboard") {
                combobox.selectActiveOption();
            } else {
                combobox.updateSelectedOptionIndex("active");
            }
        },
    });

    const [value, setValue] = useState<string | null>(null);

    const newOptions = options.map((item) => (
        <Combobox.Option value={item} key={item} active={item === value}>
            <Group gap="xs">
                {item === value && <CheckIcon size={12} />}
                <span>{item}</span>
            </Group>
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            resetSelectionOnOptionHover
            withinPortal={false}
            onOptionSubmit={(val) => {
                setValue(val);
                combobox.updateSelectedOptionIndex("active");
            }}
        >
            <Combobox.Target targetType="button">
                <InputBase
                    label
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                    name={name}
                    {...props}
                >
                    {value || (
                        <Input.Placeholder>Pick gender</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{newOptions}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
