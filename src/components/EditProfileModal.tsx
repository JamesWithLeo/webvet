"use client";

import editUser from "@/actions/updateUser";
import { userGenderValue } from "@/db/schema/users";
import { useUploadThing } from "@/lib/uploadThing";
import {
    Group,
    Stack,
    Text,
    ScrollArea,
    Flex,
    ActionIcon,
    Modal,
    TextInput,
    Button,
    NativeSelect,
    Image,
    Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
    IconCalendarDot,
    IconUpload,
    IconX,
    IconUserSquareRounded,
    IconTrashFilled,
    IconCheck,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

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

type Props = {
    opened: boolean;
    close: () => void;
};
export default function EditProfileModal({ opened, close }: Props) {
    const { update, status, data: session } = useSession();

    const router = useRouter();
    const editUserWithId = editUser.bind(null, {
        userId: session?.user.id,
        schema: "edit",
    });
    const [formState, formAction, isPending] = useActionState(editUserWithId, {
        succesful: false,
    });
    const [isPendingTransition, startTransition] = useTransition();

    const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(
        null
    );
    const [importedFile, setImportedFile] = useState<FileWithPath | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { startUpload, isUploading } = useUploadThing("profileUpload", {
        onClientUploadComplete: (res) => {
            close();
        },
    });

    const removePhoto = () => {
        setImportedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (isPending || isPendingTransition) return;

        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            if (isUploading) return;

            let newPhotoUrl = selectedGalleryImg
                ? `https://cap1-webvet.vercel.app${selectedGalleryImg}`
                : null;

            if (importedFile || newPhotoUrl) {
                if (importedFile) {
                    // proceed to use the imported
                    const uploadedFile = await startUpload([importedFile]);
                    newPhotoUrl = uploadedFile?.length
                        ? uploadedFile[0].ufsUrl
                        : null;
                }

                if (newPhotoUrl) {
                    formData.set("photoUrl", newPhotoUrl);
                }
            }
            // Trigger the Server Action
            //  Call the action returned by useActionState
            formAction(formData);
        });
    };

    useEffect(() => {
        if (formState.succesful && formState.user) {
            const filteredData = Object.fromEntries(
                Object.entries(formState.user).filter(
                    ([_, value]) => value !== "" && value !== null
                )
            );

            update(filteredData)
                .then(() => {
                    notifications.show({
                        title: "Profile Saved!",
                        message: "Profile has been updated.",
                        color: "teal",
                        icon: <IconCheck size={20} />,
                        withBorder: true,
                        autoClose: 4000,
                    });
                })
                .catch((error) => {
                    notifications.show({
                        title: "Update Error",
                        message:
                            error instanceof Error
                                ? error.message
                                : "We encountered a problem updating the profile. Please try again.",
                        color: "red",
                        icon: <IconX size={20} />,
                        withBorder: true,
                        autoClose: 4000,
                    });
                })
                .finally(() => {
                    router.refresh();
                    close();
                });
        }
    }, [formState, formState.succesful]);

    useEffect(() => {
        let objectUrl: string | null = null;

        if (importedFile) {
            // If a file was uploaded, create a Blob URL
            objectUrl = URL.createObjectURL(importedFile);
            setPreviewUrl(objectUrl);
            setSelectedGalleryImg(null);
            setImportedFile(null);
        } else if (selectedGalleryImg) {
            // If a gallery item was clicked, use that path
            setPreviewUrl(selectedGalleryImg);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [importedFile, selectedGalleryImg]);
    return (
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
            <form onSubmit={handleSubmit}>
                <Stack>
                    <div>
                        <Text>Profile Photo</Text>
                        {!previewUrl && (
                            <Dropzone
                                onReject={(files) =>
                                    console.log("rejected files", files)
                                }
                                maxSize={4 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                onDrop={(files) => setImportedFile(files[0])}
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
                                            file should not exceed 4mb.
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
                                            if (status !== "authenticated")
                                                return;
                                            setSelectedGalleryImg(
                                                `/avatar/${path}.png`
                                            );
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
                        name="firstName"
                        label={"First Name"}
                        data-autofocus
                    />
                    <TextInput name="lastName" label={"Last Name"} />
                    <NativeSelect
                        name="gender"
                        className="w-full"
                        size="md"
                        data={userGenderValue}
                        multiple={false}
                        label="Gender"
                    />
                    <DatePickerInput
                        name="dateOfBirth"
                        leftSection={<IconCalendarDot size={16} />}
                        size="md"
                        maxDate={new Date()}
                        clearable
                        className="w-full"
                    />
                    <Button type="submit">Save</Button>
                </Stack>
            </form>
        </Modal>
    );
}
