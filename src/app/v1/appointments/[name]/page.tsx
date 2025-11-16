"use client";
import {
    Stack,
    Timeline,
    Title,
    Text,
    List,
    SimpleGrid,
    Grid,
    Group,
    Flex,
    Space,
} from "@mantine/core";
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
                    <Grid.Col span={5}>
                        <Flex align={"center"} justify={"flex-end"}>
                            <div className="w-96 h-96">
                                <Image
                                    className="rounded-md  w-full"
                                    priority
                                    src={"/goldenr.jpg"}
                                    width={100}
                                    height={100}
                                    alt="golden retriever"
                                />
                            </div>
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <Stack h={"100%"} gap={3} justify="center">
                            <Title c={"primary"}>Ara</Title>
                            <Title order={6} c={"dimmed"}>
                                F / 8 years old
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
                    </Grid.Col>
                    <Grid.Col span={5} offset={5}>
                        <Timeline
                            className="col-span-2"
                            active={2}
                            bulletSize={20}
                            reverseActive
                            lineWidth={2}
                        >
                            <Timeline.Item title="Vaccination">
                                <Text size="xs" mt={4}>
                                    Up next: November 21, 2025
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item title="Grooming">
                                <Text size="xs" c={"dimmed"} mt={4}>
                                    5 months ago
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item title="Grooming" lineVariant="solid">
                                <Text size="xs" c={"dimmed"} mt={4}>
                                    9 months ago
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item title="Check up">
                                <Text size="xs" c={"dimmed"} mt={4}>
                                    1 year ago
                                </Text>
                            </Timeline.Item>
                        </Timeline>
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    );
}
