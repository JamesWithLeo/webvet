"use client";
import {
    Stack,
    Timeline,
    Title,
    Text,
    List,
    Grid,
    Group,
    Flex,
    Space,
    Button,
    Divider,
    ActionIcon,
    Alert,
} from "@mantine/core";
import { IconArrowBarToDownDashed, IconInfoCircle } from "@tabler/icons-react";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
            <div className="min-h-screen w-full relative md:p-16 px-4 flex gap-8 flex-col">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 0",
                        maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                        WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                        maskComposite: "intersect",
                        WebkitMaskComposite: "source-in",
                    }}
                />
                <Grid className="flex flex-col  items-center">
                    <Grid.Col span={12}>
                        <Alert
                            variant="light"
                            color="red"
                            withCloseButton
                            w={"100%"}
                            title="Unsettled Payment"
                            closeButtonLabel="Dismiss payment remainder"
                            icon={<IconInfoCircle />}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Flex align={"center"} justify={"flex-end"}>
                            <div className="w-full h-96">
                                <Image
                                    className="rounded-md  w-full"
                                    priority
                                    src={"/goldenr.jpg"}
                                    width={100}
                                    quality={100}
                                    height={100}
                                    alt="golden retriever"
                                />
                            </div>
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Group align="flex-start" justify="" wrap="nowrap">
                            <Stack
                                h={"100%"}
                                w={"100%"}
                                gap={3}
                                justify="center"
                            >
                                <Title c={"primary"}>Ara</Title>
                                <Title order={6} c={"dimmed"}>
                                    Female / 8 years old
                                </Title>
                                <Title order={6} c={"dimmed"}>
                                    Weight: 30 kg
                                </Title>
                                <Space h={"sm"} />
                                <Text>Last Vaccination: Null</Text>
                                <Text>Last Grooming: July 01, 2025</Text>
                                <Text>Descriptive Features</Text>

                                <List listStyleType="disc">
                                    <List.Item>Short Tail </List.Item>
                                    <List.Item>Broken paw print </List.Item>
                                    <List.Item>white blaze</List.Item>
                                </List>
                            </Stack>
                            <Stack
                                // w={"100%"}
                                h={"100%"}
                                align="flex-start"
                                justify="flex-start"
                            >
                                <Button color="red">Payment</Button>
                            </Stack>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={4} offset={4}>
                        <Title c={"gray"} order={3}>
                            Appointments
                        </Title>
                        <Space h={"sm"} />
                        <Divider
                            my={"md"}
                            label={"Present"}
                            labelPosition="left"
                            orientation="horizontal"
                        />
                        <Timeline
                            className="col-span-2"
                            active={2}
                            bulletSize={20}
                            reverseActive
                            lineWidth={2}
                        >
                            <Timeline.Item>
                                <Group justify="space-between">
                                    <Stack gap={0}>
                                        <Title order={5} fw={"500"}>
                                            {" "}
                                            Vaccination
                                        </Title>
                                        <Text size="xs" mt={4}>
                                            Up next: November 21, 2025
                                        </Text>
                                    </Stack>
                                    <ActionIcon variant="transparent">
                                        <IconArrowBarToDownDashed
                                            size={20}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Group>
                            </Timeline.Item>

                            <Timeline.Item>
                                <Group justify="space-between">
                                    <Stack gap={0}>
                                        <Title order={5} fw={"500"}>
                                            Grooming
                                        </Title>
                                        <Text size="xs" c={"dimmed"} mt={4}>
                                            5 days ago
                                        </Text>
                                    </Stack>
                                    <ActionIcon variant="transparent">
                                        <IconArrowBarToDownDashed
                                            size={20}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Group>
                            </Timeline.Item>
                        </Timeline>

                        <Divider
                            my={"md"}
                            label={"July 13, 2025"}
                            labelPosition="left"
                            orientation="horizontal"
                        />
                        <Timeline>
                            <Timeline.Item lineVariant="solid">
                                <Group justify="space-between">
                                    <Stack gap={0}>
                                        <Title order={5} fw={"500"}>
                                            Grooming
                                        </Title>
                                        <Text size="xs" c={"dimmed"} mt={4}>
                                            9 months ago
                                        </Text>
                                    </Stack>
                                    <ActionIcon variant="transparent">
                                        <IconArrowBarToDownDashed
                                            size={20}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Group>
                            </Timeline.Item>
                        </Timeline>
                        <Divider
                            my={"md"}
                            label={"March 05, 2024"}
                            labelPosition="left"
                            orientation="horizontal"
                        />
                        <Timeline>
                            <Timeline.Item title="Check up">
                                <Text size="xs" c={"dimmed"} mt={4}>
                                    1 year ago
                                </Text>
                            </Timeline.Item>
                        </Timeline>
                        <Space h={"md"} />
                        <Button variant="default" fw={"500"} size="sm">
                            Show more
                        </Button>
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    );
}
