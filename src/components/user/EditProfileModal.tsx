"use client";

import updateUser from "@/actions/user";
import { userGenderValue } from "@/types/user";
import { useUploadThing } from "@/lib/uploadThing";
import {
    Stack,
    Text,
    ScrollArea,
    Flex,
    ActionIcon,
    Modal,
    TextInput,
    Button,
    NativeSelect,
    Paper,
} from "@mantine/core";
import Image from "next/image";
import { DatePickerInput } from "@mantine/dates";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
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
import ProfileDropzone from "../common/ProfileDropzone";
import { useForm } from "@mantine/form";
import { userSetupFormInput } from "@/lib/validators/usersZodSchema";

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
    const { update, data: session } = useSession();

    const router = useRouter();
    const editUserWithId = updateUser.bind(null, {
        userId: session?.user.id,
        schema: "edit",
    });
    const [formState, formAction, isPending] = useActionState(editUserWithId, {
        success: false,
        user: undefined,
    });

    const form = useForm<userSetupFormInput>({
        initialValues: {
            firstName: session?.user.firstName ?? "",
            lastName: session?.user.lastName ?? "",
            gender: session?.user.gender ?? "",
            dateOfBirth: session?.user.dateOfBirth ?? "",
            contactNumber: session?.user.contactNumber ?? "",
        },
    });

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
        setSelectedGalleryImg(null);
        setPreviewUrl(null);
    };

    const [isPendingTransition, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending || isPendingTransition || isUploading) return;

        const formData = new FormData(e.currentTarget);

        let newPhotoUrl = selectedGalleryImg
            ? `https://www.josephmary.me${selectedGalleryImg}`
            : null;

        if (importedFile) {
            const uploadedFile = await startUpload([importedFile]);
            newPhotoUrl = uploadedFile?.[0]?.ufsUrl || null;
        }

        if (newPhotoUrl) {
            formData.set("photoUrl", newPhotoUrl);
        }

        startTransition(() => {
            formAction(formData);
        });
    };

    useEffect(() => {
        if (formState.success && formState.user) {
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
    }, [formState, formState.success]);

    useEffect(() => {
        let objectUrl: string | null = null;

        if (importedFile) {
            // If a file was uploaded, create a Blob URL
            objectUrl = URL.createObjectURL(importedFile);
            setPreviewUrl(objectUrl);
        } else if (selectedGalleryImg) {
            // If a gallery item was clicked, use that path
            setPreviewUrl(selectedGalleryImg);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [importedFile, selectedGalleryImg]);

    useEffect(() => {
        form.initialize({
            firstName: session?.user.firstName ?? "",
            lastName: session?.user.lastName ?? "",
            gender: session?.user.gender ?? "",
            dateOfBirth: session?.user.dateOfBirth ?? "",
            contactNumber: session?.user.contactNumber ?? "",
        });
    }, [session]);
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
                            <ProfileDropzone
                                onReject={(files) =>
                                    console.log("rejected files", files)
                                }
                                maxSize={4 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                onDrop={(files) => setImportedFile(files[0])}
                                multiple={false}
                                mih={180}
                                gap={"md"}
                                iconAccept={
                                    <IconUpload
                                        size={52}
                                        color="var(--mantine-color-blue-6)"
                                        stroke={1.5}
                                    />
                                }
                                iconIdle={
                                    <IconUserSquareRounded
                                        size={52}
                                        color="var(--mantine-color-dimmed)"
                                        stroke={1.5}
                                    />
                                }
                                iconReject={
                                    <IconX
                                        size={52}
                                        color="var(--mantine-color-red-6)"
                                        stroke={1.5}
                                    />
                                }
                                label={
                                    <>
                                        Drag the image here or <br />
                                        click to select image,
                                    </>
                                }
                                description={<>file should not exceed 4mb. </>}
                            />
                        )}
                        {previewUrl && (
                            <div className="mx-auto  shadow relative w-max h-max rounded-full bg-gray-50 p-2">
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
                                <div className="overflow-hidden relative w-55 h-55 rounded-full">
                                    <Image
                                        className="h-full w-full object-cover relative "
                                        src={previewUrl}
                                        fill={true}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        alt="Main Preview"
                                    />
                                </div>
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
                                        }}
                                        style={{
                                            position: "relative",
                                            cursor: "pointer",
                                            borderColor:
                                                selectedGalleryImg === path
                                                    ? "blue"
                                                    : "transparent",
                                        }}
                                    >
                                        <div className="h-16 w-16  overflow-hidden rounded-full  relative">
                                            <Image
                                                src={`/avatar/${path}.png`}
                                                className="  object-cover"
                                                fill={true}
                                                alt="Gallery option"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                // radius="sm"
                                            />
                                        </div>
                                    </Paper>
                                ))}
                            </Flex>
                        </ScrollArea>
                    </div>

                    <TextInput
                        name="firstName"
                        label={"First name"}
                        {...form.getInputProps("firstName")}
                    />
                    <TextInput
                        name="lastName"
                        label={"Last name"}
                        {...form.getInputProps("lastName")}
                    />
                    <NativeSelect
                        name="gender"
                        className="w-full"
                        size="md"
                        data={userGenderValue}
                        multiple={false}
                        label="Gender"
                        {...form.getInputProps("gender")}
                    />
                    <DatePickerInput
                        name="dateOfBirth"
                        label="Date of birth"
                        leftSection={<IconCalendarDot size={16} />}
                        size="md"
                        maxDate={new Date()}
                        clearable
                        className="w-full"
                        {...form.getInputProps("dateOfBirth")}
                    />
                    <TextInput
                        label={"Contact number"}
                        {...form.getInputProps("contactNumber")}
                    />
                    <Button type="submit">Save</Button>
                </Stack>
            </form>
        </Modal>
    );
}
