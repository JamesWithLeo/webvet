"use client";

import { PetTypeModel } from "@/types/pets";
import calculatePetAge from "@/lib/calculatePetAge";
import { toTitleCase } from "@/lib/toTitleCase";
import Cropper from "react-easy-crop";
import getCroppedImage from "@/lib/GetCroppedImage";
import {
    Stack,
    Title,
    Text,
    List,
    Space,
    ActionIcon,
    Modal,
    Group,
    Button,
    Slider,
} from "@mantine/core";
import {
    IconCheck,
    IconChevronLeft,
    IconDog,
    IconPhotoEdit,
    IconUpload,
    IconX,
} from "@tabler/icons-react";
import NextImage from "next/image";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import ProfileDropzone from "../common/ProfileDropzone";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
    startTransition,
    useActionState,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useUploadThing } from "@/lib/uploadThing";
import { UpdatePetPhoto } from "@/actions/pets";
import { notifications } from "@mantine/notifications";

type Props = {
    data: PetTypeModel;
};

export default function PetProfile({
    data: {
        id,
        photoUrl,
        name,
        gender,
        distinguishingMarks,
        breedSpecification,
        photoKey,
        dateOfBirth,
        weight,
        archivedAt,
    },
}: Props) {
    const { displayAge } = calculatePetAge(dateOfBirth);
    const router = useRouter();

    const [opened, { open, close }] = useDisclosure(false);

    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const updatePetPhoto = UpdatePetPhoto.bind(null);

    const [formState, formAction, isPendingUpdatePhoto] = useActionState(
        updatePetPhoto,
        { success: false, petId: id }
    );

    const onCropComplete = useCallback((sa: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onDrop = (files: File[]) => {
        const file = files[0];

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const result = reader.result as string;
            setImage(result);
            setOriginalImage(result);
        });

        reader.readAsDataURL(file);
    };

    const handleClose = () => {
        setPreviewUrl(null);
        setImage(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });

        setCroppedAreaPixels(null);
        close();
    };

    const { startUpload, isUploading } = useUploadThing("petProfileUpload", {
        onClientUploadComplete: (res) => {
            const imageData = res[0];
            startTransition(() => {
                formAction({
                    petId: id,
                    photoUrl: imageData.ufsUrl,
                    photoKey: imageData.key,
                    oldKey: photoKey,
                });
            });
            handleClose();
        },
        onUploadError: (error) => {
            console.error("UploadThing Error:", error.message);
            alert("Upload failed. Please try again.");
        },
    });

    const handleSaveImage = async () => {
        // Determine which source to use (original dropped image or a preview)
        const source = originalImage;
        if (!source || !croppedAreaPixels) return;

        try {
            const result = await getCroppedImage(source, croppedAreaPixels);
            if (result) {
                // CRITICAL: Pass the file array directly to startUpload
                await startUpload([result.file]);
            }
        } catch (e) {
            console.error("Error during crop/upload flow:", e);
        }
    };
    useEffect(() => {
        if (formState?.success) {
            notifications.show({
                title: "Success!",
                message: "Image uploaded.",
                icon: <IconCheck size={16} />,
                color: "teal",
            });
        }

        // 2. Handle Error
        if (formState?.error) {
            notifications.show({
                title: "Upload Failed",
                message:
                    formState.error ||
                    "Something went wrong. Please try again.",
                icon: <IconX size={16} />,
                color: "red",
            });
        }
    }, [formState]);
    console.log(photoUrl);

    return (
        <>
            <div className="flex w-full  justify-between">
                <div className="flex gap-2 ">
                    <ActionIcon
                        variant="transparent"
                        c={"dimmed"}
                        size={"input-sm"}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <IconChevronLeft />
                    </ActionIcon>
                </div>
                <div className="flex gap-2 ">
                    <NewAppointmentButton size="sm" />
                </div>
            </div>
            <div className="flex flex-col items-center sm:items-start  justify-start w-full gap-4 lg:gap-8 md:flex-row">
                <div className="relative group min-h-75   aspect-square  w-xs   overflow-hidden">
                    <div
                        onClick={open}
                        className="absolute inset-0 z-10 cursor-pointer hidden group-hover:flex items-center justify-center bg-black/20 rounded-md transition-all"
                    >
                        <IconPhotoEdit className="text-white w-10 h-10" />
                    </div>

                    <NextImage
                        className="rounded-md z-0 relative aspect-square     w-full object-cover"
                        priority
                        src={photoUrl}
                        fill={true}
                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={breedSpecification}
                    />
                </div>
                <div className="grow  flex h-full w-full sm:w-auto  items-start  justify-between">
                    <div>
                        <Stack h={"100%"} w={"100%"} gap={3} justify="center">
                            <Title c={"primary"}>{toTitleCase(name)}</Title>
                            <Title order={6} c={"dimmed"}>
                                {toTitleCase(gender)} / {displayAge}
                            </Title>
                            <Title order={6} c={"dimmed"}>
                                Weight: {weight ? weight : "To be assigned"}
                            </Title>
                            <Space h={"sm"} />
                            {/* <Text>Last Vaccination: Null</Text>
                            <Text>Last Grooming: Null</Text> */}
                            <Text>Descriptive Features</Text>

                            <List listStyleType="disc">
                                {distinguishingMarks?.map((v) => (
                                    <List.Item key={v}>{v}</List.Item>
                                ))}
                            </List>
                        </Stack>
                        <Stack
                            // w={"100%"}
                            h={"100%"}
                            align="flex-start"
                            justify="flex-start"
                        >
                            {/* <Button color="red">Payment</Button> */}
                        </Stack>
                    </div>
                </div>
            </div>

            <Modal
                centered
                withCloseButton={false}
                radius={"md"}
                size={"md"}
                opened={opened}
                onClose={handleClose}
                // autoFocus={false}
                trapFocus={false}
            >
                <Stack>
                    {previewUrl && (
                        <div className="relative group  aspect-square  overflow-hidden">
                            <NextImage
                                src={previewUrl}
                                alt="Cropped preview"
                                fill={true}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="rounded-md z-0  relative w-full object-cover"
                            />
                        </div>
                    )}
                    {!image && !previewUrl && (
                        <ProfileDropzone
                            accept={IMAGE_MIME_TYPE}
                            iconAccept={
                                <IconUpload
                                    size={52}
                                    stroke={1.5}
                                    color="var(--mantine-color-blue-6)"
                                />
                            }
                            iconIdle={
                                <IconDog
                                    size={52}
                                    stroke={1.5}
                                    color="var(--mantine-color-dimmed)"
                                />
                            }
                            iconReject={
                                <IconX
                                    size={52}
                                    stroke={1.5}
                                    color="var(--mantine-color-blue-6)"
                                />
                            }
                            label={"Pet profile picture"}
                            description={
                                <>
                                    Drag image here or click to select file{" "}
                                    <br />
                                    Image should not exceed 5mb
                                </>
                            }
                            gap={"xl"}
                            mih={"220"}
                            multiple={false}
                            onDrop={onDrop}
                            onReject={() => {
                                console.log("rejected");
                            }}
                        />
                    )}
                    {image && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            <div
                                className="rounded-sm overflow-hidden"
                                style={{
                                    position: "relative",
                                    height: 300,
                                    width: "100%",
                                    background: "#333",
                                }}
                            >
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1 / 1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <Text size="sm">Zoom</Text>{" "}
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={setZoom}
                            />
                        </div>
                    )}

                    <Group wrap="nowrap">
                        {previewUrl && (
                            <>
                                <Button
                                    fullWidth
                                    variant="default"
                                    color="red"
                                    onClick={() => {
                                        setImage(null);
                                        setPreviewUrl(null);
                                    }}
                                >
                                    Remove
                                </Button>
                                <Button
                                    loading={
                                        isUploading || isPendingUpdatePhoto
                                    }
                                    fullWidth
                                    disabled={
                                        !previewUrl ||
                                        !croppedAreaPixels ||
                                        isPendingUpdatePhoto
                                    }
                                    onClick={handleSaveImage}
                                >
                                    Save
                                </Button>
                            </>
                        )}
                        {!previewUrl && (
                            <>
                                <Button
                                    fullWidth
                                    variant="default"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    disabled={!image}
                                    onClick={async () => {
                                        if (!image) return;

                                        try {
                                            const result =
                                                await getCroppedImage(
                                                    image,
                                                    croppedAreaPixels
                                                );
                                            if (result) {
                                                setPreviewUrl(result.fileUrl);

                                                // 2. Clear the "editor" state to close the cropper UI
                                                setImage(null);
                                            }
                                        } catch (e) {
                                            console.error(
                                                "Error creating preview:",
                                                e
                                            );
                                        }
                                    }}
                                >
                                    Select
                                </Button>
                            </>
                        )}
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
