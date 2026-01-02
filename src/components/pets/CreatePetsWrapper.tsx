"use client";

import CreatePet from "@/actions/createPet";
import {
    ActionIcon,
    Avatar,
    Button,
    Card,
    Checkbox,
    Image,
    NativeSelect,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
    IconUpload,
    IconX,
    IconDog,
    IconTrashFilled,
    IconCheck,
} from "@tabler/icons-react";
import {
    useActionState,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import BreedComboBox from "./BreedComboBox";
import { OWNERSHIP_STATUS, petGenderValues } from "@/db/schema/pets";
import ProfileDropzone from "../ProfileDropzone";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { petCreateSchema, PetFormInput } from "@/lib/validators/petsZodSchema";
import { useUploadThing } from "@/lib/uploadThing";
import { notifications } from "@mantine/notifications";
import { toTitleCase } from "@/lib/toTitleCase";
import { useRouter } from "next/navigation";

const formInitialValues = {
    name: "",
    breedId: 0,
    color: "",
    dateOfBirth: "",
    isEstimatedDOB: false,
    photoUrl: "",
    gender: petGenderValues[2],
    breedSpecification: "",
    distinguishingMarks: "",
    diet: "",
    allergies: "",
    ownershipStatus: OWNERSHIP_STATUS.OWNED,
};

export default function CreatePetsWrapper({
    species,
    id,
}: {
    species: {
        id: number;
        name: string;
    }[];
    id: string;
}) {
    const [selectedSpecies, setSelectedSpecies] = useState<number>(
        species[0].id ?? 0
    );
    const [isLoadingBreed, setIsLoadingBreed] = useState<boolean>(false);
    const [breeds, setBreeds] = useState<{ id: string; name: string }[]>([]);
    const breedRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [importedFile, setImportedFile] = useState<FileWithPath | null>(null);
    const [isPendingTransition, startTransition] = useTransition();

    const createPet = CreatePet.bind(null);
    const [formState, formAction, isPending] = useActionState(createPet, {
        success: false,
        error: null,
        name: "",
        photoUrl: "",
    });

    const { startUpload, isUploading } = useUploadThing("petProfileUpload", {
        onClientUploadComplete: (res) => {
            close();
        },
    });

    const form = useForm<PetFormInput>({
        mode: "uncontrolled",
        initialValues: formInitialValues,
        validate: zod4Resolver(petCreateSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const removePhoto = () => {
        setImportedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (value: PetFormInput) => {
        if (isPending || isPendingTransition) return;
        if (!importedFile) return;

        // upload thing
        const uploadedFile = await startUpload([importedFile]);
        if (!uploadedFile || uploadedFile.length === 0) return;

        startTransition(async () => {
            if (!breedRef.current) return;
            const breed = breedRef.current.value;
            const isBreedExist = breeds.find(
                (v) => v.name === breed.toLowerCase()
            );

            // set all data
            if (isBreedExist) {
                value.breedId = Number(isBreedExist.id);
            } else {
                // custom breed
                value.breedId = 0;
                value.breedSpecification = breed;
            }
            value.photoUrl = uploadedFile[0].ufsUrl;
            value.ownerId = id;
            value.ownershipStatus = OWNERSHIP_STATUS.OWNED;

            console.log(value);
            formAction({
                ...value,
                photoUrlKey: uploadedFile[0].key,
                userId: id,
            });
        });
    };

    useEffect(() => {
        async function fetchBreeds() {
            setIsLoadingBreed(true);
            const response = await fetch(
                `/api/pets?species=${selectedSpecies}`
            );

            if (response.ok) {
                const data = await response.json();
                setIsLoadingBreed(false);
                console.log(data.breed);
                setBreeds(data.breed);
            } else if (response.status === 401) {
                console.error("You must be logged in to see breeds!");
                setIsLoadingBreed(false);
            }
        }

        if (selectedSpecies) fetchBreeds();
    }, [selectedSpecies]);

    // for server error
    useEffect(() => {
        console.log(formState);
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
                router.push("/dashboard/pets");
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

    return (
        <form
            onSubmit={form.onSubmit((data) => {
                handleSubmit(data);
            })}
            className="
h-full w-full max-w-2xl relative md:px-16 pb-16 px-4 py-4 flex gap-8 flex-col
        "
        >
            <div>
                {!previewUrl ? (
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
                                Drag image here or click to select file <br />
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
                            <div className="relative h-55 rounded-sm ">
                                <Image
                                    className="relative aspect-square"
                                    src={previewUrl}
                                    w={"auto"}
                                    h={"100%"}
                                    alt="pet profile preview"
                                />
                                <ActionIcon
                                    onClick={removePhoto}
                                    bg={"red"}
                                    radius={"lg"}
                                    size={"md"}
                                    style={{
                                        position: "absolute",
                                        right: -12,
                                        bottom: -8,
                                        zIndex: 1,
                                    }}
                                >
                                    <IconTrashFilled size={16} stroke={1.5} />
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
                />
                <TextInput
                    // required
                    label="Pet color"
                    withAsterisk
                    name="color"
                    {...form.getInputProps("color")}
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
                    />
                    <Checkbox
                        label="I'm not sure"
                        name="isEstimatedDOB"
                        defaultValue={false}
                        {...form.getInputProps("isEstimatedDOB")}
                    />
                </Stack>
                <NativeSelect
                    name="gender"
                    label="Gender"
                    withAsterisk
                    data={petGenderValues.map((v) => v)}
                    defaultValue={""}
                    {...form.getInputProps("gender")}
                    // required
                />
                <NativeSelect
                    name="species"
                    label="Species"
                    {...form.getInputProps("species")}
                    onChange={(e) => {
                        console.log(species);
                        const selected = species.find(
                            (v) => v.name === e.target.value.toLowerCase()
                        );
                        if (selected) {
                            setSelectedSpecies(selected?.id);
                        }
                    }}
                    data={species.map((v) => v.name)}
                    defaultValue={""}
                    withAsterisk
                    // required
                />
                <BreedComboBox
                    label="Breed"
                    ref={breedRef}
                    isLoading={isLoadingBreed}
                    options={breeds}
                    {...form.getInputProps("breedSpecification")}
                />
                <Textarea
                    // required
                    withAsterisk
                    label="Food diet"
                    description="What food do they eat?"
                    name="diet"
                    {...form.getInputProps("diet")}
                />
                <Textarea
                    // required
                    withAsterisk
                    {...form.getInputProps("distinguishingMarks")}
                    label="Distinguishing Marks"
                    name="distinguishingMarks"
                    description="Description about the pet"
                    placeholder="Birthmark on the paw and spot on the left eye"
                />
                <Textarea
                    // required
                    withAsterisk
                    {...form.getInputProps("allergies")}
                    label="Allergies"
                    description="Does your pet have any known allergies?"
                    name="allergies"
                />
            </Stack>

            <Button
                mt={"lg"}
                type="submit"
                loading={isPending || isPendingTransition}
            >
                Save
            </Button>
        </form>
    );
}
