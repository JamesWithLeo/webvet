import { Ref, useEffect, useState } from "react";
import {
    Combobox,
    Loader,
    ScrollArea,
    TextInput,
    useCombobox,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { toTitleCase } from "@/lib/toTitleCase";

type ComboProps = {
    label: string;
    isLoading: boolean;
    ref: Ref<HTMLInputElement>;
    options: { id: string; name: string }[];
    value?: string;
    onChange: (value: string) => void;
    error?: React.ReactNode;
    disabled?: boolean;
};

export default function BreedComboBox({
    label,
    isLoading,
    options,
    ref,
    value,
    onChange,
    error,
    disabled,
}: ComboProps) {
    const combobox = useCombobox();

    const [comboValue, setComboValue] = useState(value ?? "");
    const shouldFilterOptions = !options.some(
        (item) => item.name === comboValue
    );

    const filteredOptions = shouldFilterOptions
        ? options.filter((item) =>
              item.name.toLowerCase().includes(comboValue.toLowerCase())
          )
        : options;

    useEffect(() => {
        setComboValue(value ?? "");
    }, [isLoading]);

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                setComboValue(optionValue);
                onChange(optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
            shadow="lg"
        >
            <Combobox.Target>
                <TextInput
                    disabled={disabled}
                    ref={ref}
                    withAsterisk
                    description={
                        comboValue &&
                        "Pick breed or type custom breed if not provided."
                    }
                    label={label}
                    error={error}
                    placeholder="Pick breed or type custom breed if not provided."
                    value={toTitleCase(comboValue)}
                    onChange={(event) => {
                        setComboValue(event.target.value);
                        onChange(event.target.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={
                        isLoading ? (
                            <Loader size={16} stroke="1.5" />
                        ) : (
                            <>
                                {comboValue ? (
                                    <IconX
                                        size={16}
                                        stroke={1.5}
                                        onClick={() => {
                                            setComboValue("");
                                            onChange("");
                                        }}
                                    />
                                ) : (
                                    <Combobox.Chevron />
                                )}
                            </>
                        )
                    }
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea.Autosize type="scroll" mah={200}>
                        {filteredOptions.length ? (
                            filteredOptions.map((item) => (
                                <Combobox.Option
                                    value={item.name}
                                    key={`${item.id}-${item.name}`}
                                >
                                    {toTitleCase(item.name)}
                                </Combobox.Option>
                            ))
                        ) : (
                            <Combobox.Option value={comboValue}>
                                {comboValue}
                            </Combobox.Option>
                        )}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
