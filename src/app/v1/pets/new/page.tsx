"use client";
import { GenderCombo } from "@/components/GenderCombo";
import { Button, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconX, IconDog } from "@tabler/icons-react";

export default function Page() {
    return (
        <div className="flex items-center gap-8 w-full h-full min-h-dvh  flex-col   ">
            <div
                className="fixed inset-0 h-full bottom-0 z-0"
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
            <div className="h-full w-full max-w-2xl relative md:px-16 pb-16 px-4 py-4 flex gap-8 flex-col">
                <Dropzone
                    px={"xl"}
                    onDrop={(files) => console.log("accepted files", files)}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Group
                        justify="center"
                        gap="xl"
                        mih={220}
                        style={{ pointerEvents: "none" }}
                    >
                        <Dropzone.Accept>
                            <IconUpload
                                size={52}
                                color="var(--mantine-color-blue-6)"
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                size={52}
                                color="var(--mantine-color-red-6)"
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconDog
                                size={52}
                                color="var(--mantine-color-dimmed)"
                                stroke={1.5}
                            />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Pet profile picture
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                Drag image here or click to select file
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                Image should not exceed 5mb
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
                <Stack>
                    <TextInput label={"Name"} />
                    <TextInput label={"Color"} />
                    <DatePickerInput
                        clearable
                        label="Date of Birth"
                        placeholder="Pick date"
                    />
                    <GenderCombo label={"Gender"} />
                    <TextInput label={"Species"} />
                    <TextInput label={"Breed"} />
                    <Textarea
                        label="Food diet"
                        description="What food do they eat?"
                    />
                    <Textarea
                        label="Allergies"
                        description="Does your pet have any known allergies?"
                    />
                    <Textarea
                        label="Unique Identificaton"
                        description="Description about the pet"
                        placeholder="Birthmark on the paw and spot on the left eye"
                    />
                </Stack>
                <Button mt={"lg"}>Save</Button>
            </div>
        </div>
    );
}
