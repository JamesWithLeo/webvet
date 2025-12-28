"use client";

import { sexValues } from "@/db/schema/users";
import {
    Group,
    Avatar,
    Space,
    Stack,
    Text,
    Title,
    ScrollArea,
    Flex,
    ActionIcon,
    Menu,
    MenuTarget,
    MenuDropdown,
    MenuItem,
    MenuDivider,
    Modal,
    TextInput,
    Button,
    NativeSelect,
    Image,
    SimpleGrid,
    Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import {
    IconGenderMale,
    IconDotsVertical,
    IconEdit,
    IconLogout,
    IconCalendarDot,
    IconUpload,
    IconX,
    IconUserSquareRounded,
    IconTrashFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

const PUBLIC_AVATAR = [
    "bunny",
    "cow",
    "dog",
    "lion",
    "monkey",
    "deer",
    "bear",
    "horse",
    "donkey",
    "pig",
    "snake",
    "cat",
    "wolf",
    "seal",
    "fox",
    "panda",
    "eagle",
    "tiger",
];
export default function ProfileCardGroup(user: {
    firstName?: string | null;
    lastName?: string | null;
    photoUrl?: string | null;
    dateOfBirth?: string | null;
    email?: string | null;
    sex: (typeof sexValues)[number];
}) {
    const [sex, setSex] = useState<(typeof sexValues)[number]>("UNKNOWN");
    const [dateOfBirthState, setDateOfBirth] = useState<string | null>(null);
    const [opened, { open, close }] = useDisclosure();

    const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(
        null
    );
    const [uploadedFile, setUploadedFile] = useState<FileWithPath | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const removePhoto = () => {
        setUploadedFile(null);
        setPreviewUrl(null);
    };
    useEffect(() => {
        let objectUrl: string | null = null;

        if (uploadedFile) {
            // If a file was uploaded, create a Blob URL
            objectUrl = URL.createObjectURL(uploadedFile);
            setPreviewUrl(objectUrl);
            setSelectedGalleryImg(null); // Clear gallery selection
        } else if (selectedGalleryImg) {
            // If a gallery item was clicked, use that path
            setPreviewUrl(selectedGalleryImg);
        }

        // Cleanup Blob URL to save memory
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [uploadedFile, selectedGalleryImg]);
    return (
        <>
            <Modal
                opened={opened}
                centered
                onClose={close}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                title="Edit Profile"
            >
                <Stack>
                    <div>
                        <Text>Profile Photo</Text>
                        {!previewUrl && (
                            <Dropzone
                                onReject={(files) =>
                                    console.log("rejected files", files)
                                }
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                onDrop={(files) => setUploadedFile(files[0])}
                                multiple={false}
                            >
                                <Group
                                    justify="center"
                                    gap="md"
                                    mih={180}
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
                                        <IconUserSquareRounded
                                            size={52}
                                            color="var(--mantine-color-dimmed)"
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>

                                    <div>
                                        <Text size="xl" inline>
                                            Drag the image here or <br />
                                            click to select image,
                                        </Text>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            inline
                                            mt={7}
                                        >
                                            file should not exceed 5mb.
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                        )}
                        {previewUrl && (
                            <div className="mx-auto  shadow relative w-max  rounded-full bg-gray-50 p-2">
                                <ActionIcon
                                    onClick={removePhoto}
                                    style={{
                                        position: "absolute",
                                        right: -8,
                                        bottom: 0,
                                        zIndex: 1,
                                    }}
                                    size={"md"}
                                    bg={"red"}
                                    radius={"lg"}
                                >
                                    <IconTrashFilled size={16} stroke={1.5} />
                                </ActionIcon>
                                <Image
                                    className="relative"
                                    src={previewUrl}
                                    w={150}
                                    h={150}
                                    alt="Main Preview"
                                />
                            </div>
                        )}
                        <ScrollArea
                            w="100%"
                            py={"md"}
                            scrollbars="x"
                            type="hover"
                        >
                            <Flex gap="md" wrap="nowrap">
                                {PUBLIC_AVATAR.map((path, index) => (
                                    <Paper
                                        key={`/avatar/ ${path} .png - ${index}`}
                                        maw={"80"}
                                        miw={"50"}
                                        onClick={() => {
                                            setSelectedGalleryImg(
                                                `/avatar/${path}.png`
                                            );
                                            setUploadedFile(null);
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            borderColor:
                                                selectedGalleryImg === path
                                                    ? "blue"
                                                    : "transparent",
                                        }}
                                    >
                                        <Image
                                            src={`/avatar/${path}.png`}
                                            alt="Gallery option"
                                            radius="sm"
                                        />
                                    </Paper>
                                ))}
                            </Flex>
                        </ScrollArea>
                    </div>

                    <TextInput
                        label={"First Name"}
                        data-autofocus
                        defaultValue={user.firstName ?? ""}
                    />
                    <TextInput
                        label={"Last Name"}
                        defaultValue={user.lastName ?? ""}
                    />
                    <NativeSelect
                        name="sex"
                        className="w-full"
                        size="md"
                        data={sexValues}
                        defaultValue={user.sex}
                        multiple={false}
                        label="Gender"
                        onChange={(e) =>
                            setSex(
                                e.currentTarget.value as
                                    | "MALE"
                                    | "FEMALE"
                                    | "UNKNOWN"
                            )
                        }
                    />
                    <DatePickerInput
                        name="dateOfBirth"
                        leftSection={<IconCalendarDot size={16} />}
                        size="md"
                        onChange={setDateOfBirth}
                        maxDate={new Date()}
                        defaultDate={user.dateOfBirth ?? undefined}
                        clearable
                        className="w-full"
                    />
                    <Button>Save</Button>
                </Stack>
            </Modal>

            <div className="items-center flex gap-4 h-full">
                <Avatar radius={120} size={120} src={user.photoUrl}>
                    {user.firstName?.at(0)}
                    {user.lastName?.at(0)}
                </Avatar>
                <Space />
                <Stack
                    h={100}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="flex-end"
                    gap={0}
                >
                    <Title>
                        {user.firstName} {user.lastName}
                    </Title>
                    <Text>{user.email}</Text>
                    <Group>
                        <Text c={"dimmed"}>{user.dateOfBirth} </Text>
                        <ActionIcon variant="transparent">
                            <IconGenderMale color="blue" size={20} />
                        </ActionIcon>
                    </Group>
                </Stack>
                <div className=" flex justify-end flex-1 h-28">
                    <Menu shadow="md" width={180}>
                        <MenuTarget>
                            <ActionIcon variant="transparent">
                                <IconDotsVertical size={20} />
                            </ActionIcon>
                        </MenuTarget>
                        <MenuDropdown>
                            <MenuItem
                                rightSection={
                                    <IconEdit size={16} stroke={1.5} />
                                }
                                onClick={open}
                            >
                                Edit Profile
                            </MenuItem>
                            <MenuDivider />

                            <MenuItem
                                c={"white"}
                                bg={"red"}
                                rightSection={
                                    <IconLogout size={16} stroke={1.5} />
                                }
                            >
                                Logout
                            </MenuItem>
                        </MenuDropdown>
                    </Menu>
                </div>
            </div>
        </>
    );
}
