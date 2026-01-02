"use client";

import {
    ActionIcon,
    Button,
    Checkbox,
    Grid,
    Group,
    Input,
    Menu,
} from "@mantine/core";
import {
    IconAdjustmentsHorizontal,
    IconArrowsSort,
    IconCheck,
    IconPlus,
    IconRefresh,
    IconSortAscending2,
    IconSortDescending2,
} from "@tabler/icons-react";

import { useRouter } from "next/navigation";
import { ActionDispatch, Dispatch, SetStateAction } from "react";
import {
    FilterAction,
    FilterStateType,
    SortAction,
    SortStateType,
} from "./PetWrapper";
import { toTitleCase } from "@/lib/toTitleCase";

type Props = {
    filterState: FilterStateType;
    filterDispatch: ActionDispatch<[action: FilterAction]>;
    sortState: SortStateType;
    sortDispatch: ActionDispatch<[action: SortAction]>;
    setSearch: Dispatch<SetStateAction<string | null>>;
};

export default function PetControllers({
    filterState,
    filterDispatch,
    sortState,
    sortDispatch,
    setSearch,
}: Props) {
    const router = useRouter();

    const Species = () => {
        return (["ALL", "DOG", "CAT"] as const).map((val, index) => {
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    key={`${val}-${index}`}
                    onClick={() => {
                        filterDispatch({
                            type: "UPDATE_SPECIES",
                            species: val,
                        });
                    }}
                >
                    <Group justify="flex-start">
                        <Checkbox checked={filterState.species === val} />
                        {toTitleCase(val)}
                    </Group>
                </Menu.Item>
            );
        });
    };

    const Life = () => {
        return (["ALL", "ALIVE", "DECEASED"] as const).map((val, index) => {
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    key={`${val}-${index}`}
                    onClick={() => {
                        filterDispatch({
                            type: "UPDATE_LIFE",
                            life: val,
                        });
                    }}
                >
                    <Group justify="flex-start">
                        <Checkbox checked={filterState.life === val} />
                        {toTitleCase(val)}
                    </Group>
                </Menu.Item>
            );
        });
    };

    const Gender = () => {
        return (["All", "Male", "Female"] as const).map((val, index) => {
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    key={`${val}-${index}`}
                    onClick={() => {
                        filterDispatch({ type: "UPDATE_GENDER", gender: val });
                    }}
                >
                    <Group justify="flex-start">
                        <Checkbox checked={filterState.gender === val} />
                        {toTitleCase(val)}
                    </Group>
                </Menu.Item>
            );
        });
    };

    const Sort = () => {
        return (["DEFAULT", "AGE", "WEIGHT"] as const).map((val, index) => {
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    key={`${val}-${index}`}
                    rightSection={
                        sortState.sortBy === val && (
                            <IconCheck size={20} stroke={1.5} />
                        )
                    }
                    onClick={() => {
                        sortDispatch({ type: "SET_SORT", sortBy: val });
                    }}
                >
                    {toTitleCase(val === "DEFAULT" ? "date added" : val)}
                </Menu.Item>
            );
        });
    };

    const Order = () => {
        return [
            {
                order: "ASC" as const,
                icon: <IconSortAscending2 size={20} stroke={1.5} />,
            },
            {
                order: "DESC" as const,
                icon: <IconSortDescending2 size={20} stroke={1.5} />,
            },
        ].map(({ order, icon }, index) => {
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    key={`${order}-${index}`}
                    rightSection={
                        sortState.order === order && (
                            <IconCheck size={20} stroke={1.5} />
                        )
                    }
                    onClick={() => {
                        sortDispatch({ type: "SET_ORDER", value: order });
                    }}
                    leftSection={icon}
                >
                    {toTitleCase(order)}
                </Menu.Item>
            );
        });
    };

    return (
        <Grid w={"100%"} justify="space-between" grow>
            <Grid.Col span={3}></Grid.Col>
            <Grid.Col span={6} w={"100%"}>
                <Group justify="flex-end">
                    <Button.Group>
                        <Button.GroupSection variant="default">
                            <Input
                                variant="unstyled"
                                id="searchInput"
                                onChange={(e) =>
                                    setSearch(e.target.value.trim())
                                }
                                // leftSection={
                                //     <IconSearch stroke={1.5} size={16} />
                                // }
                                // rightSection={<IconX stroke={1.5} size={16} />}
                            />
                        </Button.GroupSection>
                        <Button
                            onClick={() => {
                                const search = (
                                    document.getElementById(
                                        "searchInput"
                                    ) as HTMLInputElement
                                ).value;
                                setSearch(search.trim());
                            }}
                            variant="default"
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            Search
                        </Button>
                    </Button.Group>
                    <ActionIcon
                        size={"input-sm"}
                        variant="default"
                        onClick={() => {
                            router.refresh();
                        }}
                    >
                        <IconRefresh size={20} stroke={1.5} />
                    </ActionIcon>
                    <Button.Group>
                        <Button
                            variant="default"
                            leftSection={<IconPlus size={20} stroke={1.5} />}
                            onClick={() => {
                                router.push("/v1/pets/new");
                            }}
                        >
                            Add new Pet
                        </Button>
                        <Menu shadow="md" width={200} position="bottom-start">
                            <Menu.Target>
                                <Button
                                    leftSection={
                                        <IconAdjustmentsHorizontal
                                            stroke={1.5}
                                            size={20}
                                        />
                                    }
                                    variant="default"
                                >
                                    Filter
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Species</Menu.Label>
                                <Species />
                                <Menu.Divider />
                                <Life />
                                <Menu.Divider />
                                <Menu.Label>Gender</Menu.Label>

                                <Gender />
                            </Menu.Dropdown>
                        </Menu>
                        <Menu shadow="md" width={200} position="bottom-start">
                            <Menu.Target>
                                <Button
                                    variant="default"
                                    leftSection={
                                        <IconArrowsSort
                                            size={20}
                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Sort
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Sort by:</Menu.Label>
                                <Sort />
                                <Menu.Divider />
                                <Menu.Label>Order by</Menu.Label>
                                <Order />
                            </Menu.Dropdown>
                        </Menu>
                    </Button.Group>
                </Group>
            </Grid.Col>
        </Grid>
    );
}
