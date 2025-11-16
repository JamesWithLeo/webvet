"use client";
import { Button, Grid, Group, Input } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconArrowsSort } from "@tabler/icons-react";

export default function PetControllers() {
    return (
        <Grid w={"100%"} justify="space-between" grow>
            <Grid.Col span={4}>
                <Button
                    leftSection={<IconAdjustmentsHorizontal />}
                    variant="default"
                >
                    Filter
                </Button>
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
