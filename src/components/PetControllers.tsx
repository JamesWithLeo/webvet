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
    IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";

export default function PetControllers() {
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
                    <Button
                        variant="default"
                        leftSection={<IconArrowsSort size={20} />}
                    >
                        Sort
                    </Button>
                    <Button color="red">Delete (2)</Button>
                </Group>
            </Grid.Col>
        </Grid>
    );
}
