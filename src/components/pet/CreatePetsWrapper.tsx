"use client";

import { CreatePet } from "@/actions/pets";
import Image from "next/image";
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Checkbox,
    Group,
    Modal,
    NativeSelect,
    Stack,
    TagsInput,
    Text,
    Textarea,
    TextInput,
    Title,
    useModalsStack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
    IconUpload,
    IconX,
    IconDog,
    IconTrashFilled,
    IconCheck,
    IconAlertCircle,
    IconArrowNarrowRightDashed,
    IconArrowNarrowDownDashed,
} from "@tabler/icons-react";
import {
    useActionState,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import BreedComboBox from "./BreedComboBox";
import {
    OWNERSHIP_STATUS,
    petGenderValues,
    speciesConst,
} from "@/db/schema/pets";
import ProfileDropzone from "../common/ProfileDropzone";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
    createPetSchema,
    PetCreateFormInput,
} from "@/lib/validators/petsZodSchema";
import { useUploadThing } from "@/lib/uploadThing";
import { notifications } from "@mantine/notifications";
import { toTitleCase } from "@/lib/toTitleCase";
import { useRouter } from "next/navigation";
import { DeleteUTFile } from "@/lib/uploadthing-util";

const formInitialValues: PetCreateFormInput = {
    name: "",
    breedId: 0,
    color: "",
    dateOfBirth: "",
    isEstimatedDOB: false,
    photoUrl: "",
    gender: petGenderValues[2],
    breedSpecification: "",
    distinguishingMarks: [],
    diet: [],
    allergies: [],
    ownershipStatus: OWNERSHIP_STATUS.OWNED,
    species: "",
};

export default function CreatePetsWrapper({ id }: { id: string }) {
    const [isLoadingBreed, setIsLoadingBreed] = useState<boolean>(false);
    const [isForced, setIsForced] = useState(false);
    const [breeds, setBreeds] = useState<{ id: string; name: string }[]>([]);
    const breedRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [importedFile, setImportedFile] = useState<FileWithPath | null>(null);
    const uploadDataRef = useRef<{ url: string; key: string } | null>(null);
    const modalsStack = useModalsStack(["confirm-modal", "force-modal"]);

    const createPet = CreatePet.bind(null);
    const [formState, formAction, isPending] = useActionState(createPet, {
        success: false,
    });

    const { startUpload, isUploading } = useUploadThing("petProfileUpload", {});

    const [isPendingTransition, startTransition] = useTransition();

    const form = useForm<PetCreateFormInput>({
        mode: "uncontrolled",
        initialValues: formInitialValues,
        validate: zod4Resolver(createPetSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    form.watch("species", ({ previousValue, value }) => {
        if (!value) {
            setBreeds([]);
            return;
        }
        if (previousValue !== value) fetchBreeds(value);
    });

    const fetchBreeds = async (species: string) => {
        setIsLoadingBreed(true);
        const response = await fetch(`/api/pets/breeds?species=${species}`);

        if (response.ok) {
            const data = await response.json();
            setIsLoadingBreed(false);
            console.log(data.breed);
            setBreeds(data.breed);
        } else if (response.status === 401) {
            console.error("You must be logged in to see breeds!");
            setIsLoadingBreed(false);
        }
    };

    const removePhoto = () => {
        setImportedFile(null);
        setPreviewUrl(null);
    };

    const processAndSubmit = (
        value: PetCreateFormInput,
        url: string,
        key: string,
        force: boolean
    ) => {
        startTransition(async () => {
            const breed = breedRef.current?.value || "";
            const isBreedExist = breeds.find(
                (v) => v.name === breed.toLowerCase()
            );

            const finalValue = {
                ...value,
                breedId: isBreedExist ? Number(isBreedExist.id) : null,
                breedSpecification: breed,
                photoUrl: url,
                photoUrlKey: key,
                isForce: force,
                ownerId: id,
                ownershipStatus: OWNERSHIP_STATUS.OWNED,
            };

            formAction(finalValue);
        });
    };

    const handleSubmit = async (value: PetCreateFormInput) => {
        if (isForced && uploadDataRef.current) {
            processAndSubmit(
                value,
                uploadDataRef.current.url,
                uploadDataRef.current.key,
                true
            );
            return;
        }

        if (!importedFile || isUploading) return;
        const uploadedFile = await startUpload([importedFile]);

        if (uploadedFile?.[0]) {
            const { ufsUrl, key } = uploadedFile[0];
            // Cache it in the ref
            uploadDataRef.current = { url: ufsUrl, key: key };
            processAndSubmit(value, ufsUrl, key, false);
        }
    };

    // for server error
    useEffect(() => {
        if (formState.existingPet && formState.name && formState.photoUrl) {
            console.log("existing pet:", formState);
            modalsStack.open("force-modal");
        }

        if (typeof formState.error === "string") {
            notifications.show({
                title: "Pet not saved",
                message: formState.error,
                color: "red",
                icon: <IconX size={20} />,
                withBorder: true,
                autoClose: 4000,
            });
        }
        if (formState.debug) {
            console.log(formState.debug.message);
            notifications.show({
                title: `Error code: ${formState.debug.code}`,
                message: `${formState.debug.message}`,
                color: "red",
                icon: <IconX size={20} />,
                withBorder: true,
                autoClose: 4000,
            });
        }
        if (formState.success && formState.name) {
            notifications.show({
                title: `Pet saved!`,
                message: `${toTitleCase(formState.name)} is now present in your pets list.`,
                color: "teal",
                icon: <IconCheck size={20} />,

                withBorder: true,
                autoClose: 6000,
            });
            const timer = setTimeout(() => {
                router.push("/v1/pets");
            }, 1500);

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [formState]);

    // For pet profile picture
    useEffect(() => {
        let objectUrl: string | null = null;
        if (importedFile) {
            // If a file was uploaded, create a Blob URL
            objectUrl = URL.createObjectURL(importedFile);
            setPreviewUrl(objectUrl);
            form.setFieldValue("photoUrl", objectUrl);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
        // create preview
    }, [importedFile]);

    // For duplicate pet
    useEffect(() => {
        if (isForced && uploadDataRef.current) {
            form.onSubmit((v) => handleSubmit(v))();
            setIsForced(false);
            modalsStack.close("force-modal");
        }
    }, [isForced]);

    return (
        <>
            <form className="h-full w-full max-w-2xl relative md:px-16 pb-16 px-4 py-4 flex gap-8 flex-col">
                <div>
                    {!previewUrl ? (
                        <ProfileDropzone
                            disabled={
                                isPending || isPendingTransition || isUploading
                            }
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
                            onDrop={(files) => {
                                setImportedFile(files[0]);
                                form.clearFieldError("photoUrl");
                            }}
                            onReject={(files) => {
                                (form.setFieldError(
                                    "photoUrl",
                                    "Invalid image, Please try again or select different image."
                                ),
                                    console.log("rejected files", files));
                            }}
                        />
                    ) : (
                        <Card withBorder>
                            <div className="aspect-square h-55 flex  flex-col items-center  ">
                                <div className="relative w-55 h-full  ">
                                    <Image
                                        className="h-full object-cover relative w-full rounded overflow-hidden     aspect-square"
                                        src={previewUrl}
                                        fill={true}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        alt="pet profile preview"
                                    />
                                    <ActionIcon
                                        onClick={removePhoto}
                                        bg={"red"}
                                        radius={"lg"}
                                        size={"md"}
                                        disabled={
                                            isPending ||
                                            isPendingTransition ||
                                            isUploading
                                        }
                                        style={{
                                            position: "absolute",
                                            right: -12,
                                            bottom: -8,
                                            zIndex: 1,
                                        }}
                                    >
                                        <IconTrashFilled
                                            size={16}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </div>
                            </div>
                        </Card>
                    )}
                    <Text size="xs" c={"red"} mt={"4px"}>
                        {form.errors?.photoUrl}
                    </Text>
                </div>

                <Stack>
                    <TextInput
                        // required
                        {...form.getInputProps("name")}
                        label="Pet name"
                        withAsterisk
                        name="name"
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                    />
                    <TextInput
                        // required
                        label="Pet color"
                        withAsterisk
                        name="color"
                        {...form.getInputProps("color")}
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                    />
                    <Stack align="end" gap={"xs"}>
                        <DateInput
                            valueFormat="YYYY-MM-DD"
                            w={"100%"}
                            clearable
                            // required
                            label="Date of birth"
                            name="dateOfBirth"
                            maxDate={new Date()}
                            {...form.getInputProps("dateOfBirth")}
                            disabled={
                                isPending || isPendingTransition || isUploading
                            }
                        />
                        <Checkbox
                            label="I'm not sure"
                            name="isEstimatedDOB"
                            defaultValue={false}
                            {...form.getInputProps("isEstimatedDOB")}
                            disabled={
                                isPending || isPendingTransition || isUploading
                            }
                        />
                    </Stack>
                    <NativeSelect
                        name="gender"
                        label="Gender"
                        withAsterisk
                        data={petGenderValues.map((v) => v)}
                        defaultValue={""}
                        {...form.getInputProps("gender")}
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                        // required`
                    />
                    <NativeSelect
                        name="species"
                        label="Species"
                        data={[{ label: "", value: "" }].concat(
                            speciesConst.map((v) => ({
                                label: toTitleCase(v),
                                value: v,
                            }))
                        )}
                        {...form.getInputProps("species")}
                        defaultValue={""}
                        withAsterisk
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                        // required
                    />
                    <BreedComboBox
                        label="Breed"
                        ref={breedRef}
                        isLoading={isLoadingBreed}
                        options={breeds}
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                        {...form.getInputProps("breedSpecification")}
                    />
                    <TagsInput
                        withAsterisk
                        label="Food diet"
                        min={1}
                        description="What food do they eat?"
                        name="diet"
                        {...form.getInputProps("diet")}
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                    />
                    <TagsInput
                        withAsterisk
                        {...form.getInputProps("distinguishingMarks")}
                        label="Distinguishing Marks"
                        name="distinguishingMarks"
                        min={1}
                        description="Description about the pet"
                        placeholder="Birthmark on the paw and spot on the left eye"
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                    />
                    <TagsInput
                        {...form.getInputProps("allergies")}
                        label="Allergies"
                        description="Does your pet have any known allergies?"
                        name="allergies"
                        disabled={
                            isPending || isPendingTransition || isUploading
                        }
                    />
                </Stack>

                <Button
                    disabled={!form.isValid()}
                    mt={"lg"}
                    onClick={() => {
                        const { hasErrors } = form.validate();
                        if (!hasErrors) modalsStack.open("confirm-modal");
                    }}
                    loading={isPending || isUploading || isPendingTransition}
                >
                    Save
                </Button>
            </form>

            <Modal.Stack>
                <Modal
                    {...modalsStack.register("confirm-modal")}
                    title="Confirmation"
                    size={"lg"}
                    centered
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                >
                    <Stack>
                        <div className="flex items-center sm:items-start sm:flex-row flex-col gap-8">
                            {previewUrl && (
                                <div className="  relative h-55 w-55">
                                    <Image
                                        className="h-full object-cover brelative w-full rounded overflow-hidden aspect-square"
                                        src={previewUrl}
                                        sizes="100vw"
                                        fill={true}
                                        alt="Preview"
                                    />
                                </div>
                            )}

                            <Box style={{ flex: 1 }}>
                                <Title order={3}>
                                    {toTitleCase(form.getValues().name) ||
                                        "Unnamed Pet"}
                                </Title>
                                <Text c="dimmed">
                                    Gender:{" "}
                                    {toTitleCase(form.getValues().gender)}
                                    <br />
                                    Species:{" "}
                                    {toTitleCase(form.getValues().species)}
                                    <br />
                                    Breed:{" "}
                                    {breedRef.current?.value || "Unknown Breed"}
                                    <br />
                                    Date of birth:{" "}
                                    {form.getValues().dateOfBirth}
                                </Text>
                            </Box>
                        </div>

                        <Card withBorder padding="sm">
                            <Text size="xs" fw={700} c="dimmed" mb={5}>
                                ADDITIONAL DETAILS
                            </Text>
                            <Group grow>
                                <div>
                                    <Text size="sm" fw={500}>
                                        Diet
                                    </Text>
                                    <Text>
                                        {form.getValues().diet ||
                                            "None specified"}
                                    </Text>
                                </div>
                                <div>
                                    <Text size="sm" fw={500}>
                                        Allergies
                                    </Text>
                                    <Text
                                        c={
                                            form.getValues().allergies
                                                ? "red"
                                                : "dimmed"
                                        }
                                    >
                                        {form.getValues().allergies ||
                                            "No known allergies"}
                                    </Text>
                                </div>
                            </Group>
                        </Card>

                        <Group justify="end" mt="md">
                            <Button
                                variant="default"
                                onClick={() =>
                                    modalsStack.close("confirm-modal")
                                }
                            >
                                Edit Details
                            </Button>
                            <Button
                                onClick={() => {
                                    form.onSubmit((v) => handleSubmit(v))();
                                    modalsStack.close("confirm-modal");
                                }}
                            >
                                Confirm & Save
                            </Button>
                        </Group>
                    </Stack>
                </Modal>

                <Modal
                    withCloseButton={false}
                    withOverlay={true}
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                    centered
                    size={"lg"}
                    closeOnClickOutside={false}
                    closeOnEscape={false}
                    {...modalsStack.register("force-modal")}
                >
                    <Stack p={"md"} gap={"lg"}>
                        <Stack c={"red.5"} gap={"xs"} align="center">
                            <IconAlertCircle size={52} />
                            <Title order={3}>
                                Potential Duplicate Record Found
                            </Title>
                        </Stack>
                        <Text>
                            We found an existing profile for a
                            <Text span fw={700} c="blue">
                                {" "}
                                {formState.existingPet?.breedSpecification ??
                                    "?"}
                            </Text>{" "}
                            named
                            <Text span fw={700} c="blue">
                                {" "}
                                {formState.existingPet?.name ?? "Chloe"}
                            </Text>{" "}
                            registered to this owner. Please review the details
                            below to ensure you aren't creating a double entry
                            for the same pet.
                        </Text>
                        <div className="flex w-full items-center sm:flex-row sm:justify-evenly justify-between flex-col">
                            <div className="flex gap-2 items-center flex-col">
                                <div className="rounded-sm overflow-hidden   relative  aspect-square w-48 md:w-60 shadow p-4 border-8 border-gray-50">
                                    {formState.photoUrl && (
                                        <Image
                                            src={formState.photoUrl}
                                            fill={true}
                                            priority={true}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="rounded-sm object-cover"
                                            alt={"Pet to create picture"}
                                        />
                                    )}
                                </div>
                                <Text fw={"bold"}>Pet to create</Text>
                            </div>

                            <Box c={"dimmed"}>
                                <IconArrowNarrowRightDashed
                                    className="hidden sm:block"
                                    size={42}
                                    stroke={1.5}
                                />
                                <IconArrowNarrowDownDashed
                                    className=" sm:hidden"
                                    size={42}
                                    stroke={1.5}
                                />
                            </Box>

                            <div className="flex gap-2 items-center flex-col">
                                <div className="rounded-sm overflow-hidden   relative  aspect-square w-48 md:w-60 shadow p-4 border-8 border-gray-50">
                                    {formState.existingPet?.photoUrl && (
                                        <Image
                                            src={formState.existingPet.photoUrl}
                                            className="rounded-sm object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            objectFit="cover"
                                            fill={true}
                                            priority={true}
                                            alt={"Existing pet picture"}
                                        />
                                    )}
                                </div>
                                <Text fw={"bold"}>Existing pet</Text>
                            </div>
                        </div>
                        <Group w={"100%"} mt={"xl"} justify="end">
                            <Button
                                variant="default"
                                onClick={async () => {
                                    modalsStack.close("force-modal");
                                    await DeleteUTFile(formState.photoUrl!!);
                                }}
                            >
                                Cancel Operation
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsForced(true);
                                }}
                            >
                                Proceed and add anyways
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Modal.Stack>
        </>
    );
}
