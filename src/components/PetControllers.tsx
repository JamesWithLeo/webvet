"use client";

import { Button, Checkbox, Grid, Group, Input, Menu } from "@mantine/core";
import {
    IconAdjustmentsHorizontal,
    IconArrowsSort,
    IconPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function PetControllers() {
    const router = useRouter();
    return (
        <Grid w={"100%"} justify="space-between" grow>
            <Grid.Col span={4}>
                <Menu shadow="md" width={200} position="bottom-start">
                    <Menu.Target>
                        <Button
                            leftSection={<IconAdjustmentsHorizontal />}
                            variant="default"
                        >
                            Filter
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Species</Menu.Label>
                        <Menu.Item>Dog</Menu.Item>
                        <Menu.Item>Cat</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox checked /> All
                            </Group>
                        </Menu.Item>
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox /> Alive
                            </Group>
                        </Menu.Item>
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox /> Deceased
                            </Group>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Gender</Menu.Label>
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox checked /> All
                            </Group>
                        </Menu.Item>
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox /> Male
                            </Group>
                        </Menu.Item>
                        <Menu.Item closeMenuOnClick={false}>
                            <Group justify="flex-start">
                                <Checkbox /> Female
                            </Group>
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Grid.Col>
            <Grid.Col span={6} w={"100%"}>
                <Group justify="flex-end">
                    <Button.Group>
                        <Button.GroupSection variant="default">
                            <Input variant="unstyled" />
                        </Button.GroupSection>
                        <Button
                            variant="default"
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            Search
                        </Button>
                    </Button.Group>
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
                        <Button
                            variant="default"
                            leftSection={
                                <IconArrowsSort size={20} stroke={1.5} />
                            }
                        >
                            Sort
                        </Button>
                    </Button.Group>
                    <Button color="red">Delete (2)</Button>
                </Group>
            </Grid.Col>
        </Grid>
    );
}
