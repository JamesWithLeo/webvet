"use client";

import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import {
    ActionIcon,
    Group,
    Stack,
    Button,
    TextInput,
    NativeSelect,
    Modal,
    NumberInput,
    Image,
    TagsInput,
    Text,
    Drawer,
    Menu,
    Box,
    Badge,
    Divider,
    useDrawersStack,
    Paper,
    Loader,
    SimpleGrid,
    Avatar,
} from "@mantine/core";

import {
    IconArrowAutofitWidth,
    IconCheck,
    IconColumns3,
    IconDots,
    IconEdit,
    IconFolderOpen,
    IconPointerCode,
    IconSearch,
    IconSquareToggle,
    IconX,
} from "@tabler/icons-react";

import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import usePetsAdmin from "@/lib/hooks/usePetsAdmin";
import { AdminPetsSummary } from "@/types/pets";
import { toTitleCase } from "@/lib/toTitleCase";

import {
    LIFE_STATUS,
    lifeStatusEnum,
    OWNERSHIP_STATUS,
    ownershipStatusEnum,
    petGenderValues,
    reproductiveStatusEnum,
    speciesConst,
} from "@/db/schema/pets";

import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";

import {
    editPetSchemaAdmin,
    PetEditFormInput,
} from "@/lib/validators/petsZodSchema";

import { zod4Resolver } from "mantine-form-zod-resolver";
import BreedComboBox from "./pet/BreedComboBox";
import { UpdatePetAdmin } from "@/actions/pets";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { role } from "@/db/schema/users";
import useMedicalHistory from "@/lib/hooks/useMedicalHistory";

const initialValue: PetEditFormInput = {
    name: "",
    dateOfBirth: "",
    gender: petGenderValues[2],
    breedSpecification: "",
    distinguishingMarks: [],
    diet: [],
    allergies: [],
    ownershipStatus: OWNERSHIP_STATUS.OWNED,
    species: "",
    weight: 0,
    life: LIFE_STATUS.alived,
    reproductiveStatus: "UNKNOWN",
};

type Props = {
    role: (typeof role.enumValues)[number];
    id: string;
};

export default function PetTable({ role, id }: Props) {
    const key = "draggable-example";
    const queryClient = useQueryClient();
    const drawer = useDrawersStack(["history", "edit"]);

    const { data, isLoading, queryId, setQueryId } = usePetsAdmin();

    const [selected, setSelected] = useState<AdminPetsSummary | null>(null);
    const [selectedPetForMedical, setSelectedPetForMedical] =
        useState<AdminPetsSummary | null>(null);

    const [isLoadingBreed, setIsLoadingBreed] = useState<boolean>(false);
    const [breeds, setBreeds] = useState<{ id: string; name: string }[]>([]);

    const breedRef = useRef<HTMLInputElement>(null);
    const updatePetAdmin = UpdatePetAdmin.bind(null);

    const [formState, formAction, isPending] = useActionState(updatePetAdmin, {
        success: false,
        petId: "",
    });

    const {
        data: medicalData,
        isFetching: isFetchingMedical,
        isSuccess: isSuccessMedical,
    } = useMedicalHistory(selectedPetForMedical?.id);

    const form = useForm({
        mode: "controlled",
        validate: zod4Resolver(editPetSchemaAdmin),
        initialValues: initialValue,
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

    const allBreed = useMemo(() => {
        return new Set(data?.map((pet) => pet.breedSpecification));
    }, [data]);

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

    const handleCloseEdit = () => {
        setSelected(null);
        form.reset();
        drawer.close("edit");
    };

    const handleEditClick = (pet: AdminPetsSummary) => {
        setSelected(pet);
    };

    const handleSubmit = async (values: PetEditFormInput) => {
        if (!selected?.id) return;

        const updates = (
            Object.keys(values) as Array<keyof PetEditFormInput>
        ).reduce((acc, key) => {
            if (form.isDirty(key)) {
                (acc as any)[key] = values[key];
            }
            return acc;
        }, {} as Partial<PetEditFormInput>);

        if (Object.keys(updates).length === 0) {
            handleCloseEdit();
            return;
        }
        startTransition(async () => {
            formAction({ pet: updates, petId: selected.id });
        });
    };

    const handleSaveEditClick = () => {
        modals.openConfirmModal({
            title: "Pet edit confirmation",
            withCloseButton: false,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to save this pet edit? This action is
                    unreversable and will overwrite the pets data.
                </Text>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {},
            onConfirm: () => {
                form.onSubmit((v) => handleSubmit(v))();
            },
        });
    };

    const columns = useMemo<DataTableColumn<AdminPetsSummary>[]>(
        () => [
            {
                accessor: "id",
                title: "id",
                width: "5%",
                toggleable: true,
                resizable: true,
                ellipsis: true,
                filter: ({ close }) => (
                    <TextInput
                        label="Pet Id"
                        description="Show pet whose id include the matches the text"
                        placeholder="Search id..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                            >
                                <IconX size={14} onClick={close} />
                            </ActionIcon>
                        }
                        onChange={(e) => setQueryId(e.currentTarget.value)}
                    />
                ),
                filtering: queryId !== "",
            },
            {
                accessor: "name",
                title: "Name",
                draggable: true,
                width: "20%",
                resizable: true,
                render: (record) => `${toTitleCase(record.name)}`,
                filter: ({ close }) => (
                    <TextInput
                        label="Name"
                        description="Show name whose names include the specified text"
                        placeholder="Search name..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                    />
                ),
            },
            {
                accessor: "species",
                title: "Species",
                width: "20%",
                textAlign: "left",
                render: (record) => `${toTitleCase(record.species)}`,
            },
            {
                accessor: "breedSpecification",
                title: "Breed",
                width: "20%",
                ellipsis: true,
                textAlign: "left",
                render: (record) => `${toTitleCase(record.breedSpecification)}`,
                filter: (
                    <NativeSelect
                        label="Breed"
                        description="Shows all pets that  matches the filter"
                        data={["all"].concat([...allBreed]).map((value) => ({
                            label: toTitleCase(value),
                            value: value,
                        }))}
                    />
                ),
            },
            {
                accessor: "dateOfBirth",
                title: "Date of birth",
                width: "8%",
                textAlign: "center",
                sortable: true,
            },
            {
                accessor: "gender",
                title: "Gender",
                width: "8%",
                textAlign: "center",
                sortable: true,
            },
            {
                accessor: "life",
                title: "Is alived?",
                width: "8%",
                textAlign: "center",
                render: (record) => `${record.life}`,
            },
            {
                accessor: "weight",
                title: "Weight",
                textAlign: "center",
                width: "8%",
                sortable: true,
            },
            {
                accessor: "reproductiveStatus",
                title: "Reproductive Status",
                textAlign: "center",
                width: "8%",
            },
            {
                accessor: "ownershipStatus",
                title: "Ownership status",
                textAlign: "center",
                width: "8%",
                resizable: true,
            },
            {
                accessor: "action",
                title: (
                    <Group justify="center" wrap="nowrap">
                        <IconPointerCode size={16} />
                    </Group>
                ),
                // hidden: role === "vet",
                width: "6%",
                textAlign: "center",
                render: (record) => (
                    <Group justify="center">
                        <Menu
                            width={"200px"}
                            shadow="xl"
                            offset={-4}
                            radius={"md"}
                            withArrow
                            arrowSize={12}
                            position="bottom-end"
                        >
                            <Menu.Target>
                                <ActionIcon
                                    variant="transparent"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <IconDots />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {role !== "vet" && (
                                    <Menu.Item
                                        rightSection={
                                            <IconEdit size={16} color="gray" />
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(record);
                                        }}
                                    >
                                        Edit
                                    </Menu.Item>
                                )}
                                <Menu.Item
                                    rightSection={
                                        <IconFolderOpen
                                            size={16}
                                            color="gray"
                                        />
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPetForMedical(record);
                                    }}
                                >
                                    View Medical History
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                ),
            },
        ],
        [setSelected, setSelectedPetForMedical]
    );

    const {
        effectiveColumns,
        resetColumnsOrder,
        resetColumnsWidth,
        resetColumnsToggle,
    } = useDataTableColumns<AdminPetsSummary>({
        key,
        columns: columns,
    });

    useEffect(() => {
        if (selected) {
            form.setValues(selected);
            form.resetDirty();
            drawer.open("edit");
        }
    }, [selected]);

    useEffect(() => {
        if (selectedPetForMedical) drawer.open("history");
        console.log(medicalData);
    }, [selectedPetForMedical, isFetchingMedical, medicalData]);

    useEffect(() => {
        if (formState.error) {
            notifications.show({
                title: "Pet update failed",
                icon: <IconX size={16} />,
                color: "red",
                message: formState.error
                    ? `Could not update ${formState.petId}: ${formState.error}`
                    : `An unexpected error occurred while saving changes to ${formState.petId}.`,
            });
            handleCloseEdit();
        }

        if (formState.success && formState.pet) {
            notifications.show({
                title: "Pet updated",
                icon: <IconCheck size={16} />,
                color: "teal",
                message: `Changes to ${formState.pet.id} have been synced.`,
            });
            queryClient.invalidateQueries({ queryKey: ["pets", "admin"] });
            handleCloseEdit();
        }
    }, [formState]);

    return (
        <Stack>
            <Group justify="flex-end">
                <Button
                    size="xs"
                    onClick={resetColumnsToggle}
                    variant="default"
                    rightSection={<IconSquareToggle size={16} />}
                >
                    Reset Toggle
                </Button>

                <Button
                    size="xs"
                    onClick={resetColumnsOrder}
                    variant="default"
                    rightSection={<IconColumns3 size={16} />}
                >
                    Reset Order
                </Button>
                <Button
                    size="xs"
                    onClick={resetColumnsWidth}
                    variant="default"
                    rightSection={<IconArrowAutofitWidth size={16} />}
                >
                    Reset Width
                </Button>
            </Group>
            <DataTable
                withTableBorder={true}
                withColumnBorders={false}
                withRowBorders
                // striped
                pinLastColumn
                highlightOnHover
                verticalSpacing="sm"
                borderRadius="sm"
                records={data}
                totalRecords={1500}
                storeColumnsKey={key}
                page={1}
                minHeight={200}
                fetching={isLoading}
                recordsPerPage={20}
                onPageChange={() => {}}
                columns={effectiveColumns}
                rowExpansion={{
                    allowMultiple: true,
                    content: ({ record }) => (
                        <Box p="md" bg="var(--mantine-color-gray-0)">
                            <Group align="flex-start" gap="xl" wrap="nowrap">
                                <Box
                                    className="relative group shrink-0 overflow-hidden shadow-md rounded-lg"
                                    w={200}
                                    h={200}
                                >
                                    {/* Blurred Background Layer */}
                                    <Image
                                        src={record.photoUrl}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover"
                                        style={{
                                            filter: "blur(12px) brightness(0.8)",
                                            transform: "scale(1.2)",
                                        }}
                                    />

                                    {/* Foreground Image Layer */}
                                    <Image
                                        src={record.photoUrl}
                                        alt={record.name}
                                        fit="contain"
                                        className="relative z-10 w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Box>

                                <Stack gap="md" style={{ flex: 1 }}>
                                    <Box>
                                        <Text
                                            fw={700}
                                            size="sm"
                                            c="dimmed"
                                            tt="uppercase"
                                            mb={4}
                                        >
                                            Distinguishing Marks
                                        </Text>
                                        <Group gap={6}>
                                            {record.distinguishingMarks.length >
                                            0 ? (
                                                record.distinguishingMarks.map(
                                                    (mark, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="light"
                                                            color="blue"
                                                            radius="sm"
                                                        >
                                                            {mark}
                                                        </Badge>
                                                    )
                                                )
                                            ) : (
                                                <Text size="sm" c="gray.5">
                                                    None recorded
                                                </Text>
                                            )}
                                        </Group>
                                    </Box>

                                    <Box>
                                        <Text
                                            fw={700}
                                            size="sm"
                                            c="dimmed"
                                            tt="uppercase"
                                            mb={4}
                                        >
                                            Food Diet
                                        </Text>
                                        <Group gap={6}>
                                            {record.diet.map((item, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="dot"
                                                    color="teal"
                                                    radius="sm"
                                                >
                                                    {item}
                                                </Badge>
                                            ))}
                                        </Group>
                                    </Box>

                                    <Box>
                                        <Text
                                            fw={700}
                                            size="sm"
                                            c="dimmed"
                                            tt="uppercase"
                                            mb={4}
                                        >
                                            Allergies / Medical Alerts
                                        </Text>
                                        <Group gap={6}>
                                            {record.allergies &&
                                            record.allergies?.length > 0 ? (
                                                record.allergies.map(
                                                    (allergy, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="filled"
                                                            color="red"
                                                            radius="sm"
                                                        >
                                                            {allergy}
                                                        </Badge>
                                                    )
                                                )
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    color="gray"
                                                >
                                                    No known allergies
                                                </Badge>
                                            )}
                                        </Group>
                                    </Box>
                                </Stack>
                            </Group>
                        </Box>
                    ),
                    collapseProps: {
                        transitionDuration: 500,
                        animateOpacity: true,
                        transitionTimingFunction: "ease-in-out",
                    },
                }}
            />

            <Drawer
                radius={"md"}
                position="right"
                offset={8}
                opened={drawer.state.edit}
                onClose={handleCloseEdit}
                title={"Edit Pet"}
            >
                <form>
                    <Stack>
                        <TextInput
                            name="name"
                            label="Name"
                            {...form.getInputProps("name")}
                        />
                        <NativeSelect
                            name="species"
                            label="Species"
                            data={speciesConst.map((v) => ({
                                label: toTitleCase(v),
                                value: v,
                            }))}
                            {...form.getInputProps("species")}
                        />

                        <BreedComboBox
                            label="Breed"
                            ref={breedRef}
                            isLoading={isLoadingBreed}
                            options={breeds}
                            {...form.getInputProps("breedSpecification")}
                        />

                        <DatePickerInput
                            name="dateOfBirth"
                            label="Date of Birth"
                            {...form.getInputProps("dateOfBirth")}
                        />

                        <NativeSelect
                            name="life"
                            label="Life status"
                            data={lifeStatusEnum.enumValues}
                            {...form.getInputProps("life")}
                        />

                        <NumberInput
                            allowNegative={false}
                            label="Weight"
                            name="weight"
                            {...form.getInputProps("weight")}
                        />

                        <NativeSelect
                            data={reproductiveStatusEnum.enumValues}
                            label="Reproductive Status"
                            {...form.getInputProps("reproductiveStatus")}
                        />
                        <NativeSelect
                            data={ownershipStatusEnum.enumValues}
                            label="Ownership status"
                            {...form.getInputProps("ownershipStatus")}
                        />

                        <TagsInput
                            label="Allergies"
                            {...form.getInputProps("allergies")}
                        />
                        <TagsInput
                            label="Diet"
                            {...form.getInputProps("diet")}
                        />
                        <TagsInput
                            label="Distinguishable Marks"
                            {...form.getInputProps("distinguishingMarks")}
                        />

                        <Group justify="right" mt={"lg"}>
                            <Button variant="default" onClick={handleCloseEdit}>
                                Discard changes
                            </Button>
                            <Button
                                onClick={handleSaveEditClick}
                                disabled={!form.isValid()}
                                loading={isPending}
                            >
                                Save edit
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Drawer>
            <Drawer
                opened={drawer.state.history}
                onClose={() => {
                    setSelectedPetForMedical(null);
                    drawer.close("history");
                }}
                radius="md"
                size="xl"
                position="right"
                offset={8}
                title={
                    <Text fw={700} size="xl">
                        Medical History
                    </Text>
                }
            >
                <Stack gap="md">
                    {selectedPetForMedical && (
                        <Group>
                            <Avatar
                                size={"lg"}
                                src={selectedPetForMedical.photoUrl}
                            >
                                {selectedPetForMedical.name[0].toUpperCase()}
                            </Avatar>

                            <Stack gap={0}>
                                <Text fw={"bold"}>
                                    {toTitleCase(selectedPetForMedical.name)}
                                </Text>
                                <Text size="xs" c={"dimmed"}>
                                    {selectedPetForMedical.id}
                                </Text>
                                <Group>
                                    <Badge
                                        variant="light"
                                        size="lg"
                                        leftSection={
                                            selectedPetForMedical.species ===
                                            "cat"
                                                ? "🐱"
                                                : "🐶"
                                        }
                                    >
                                        {toTitleCase(
                                            selectedPetForMedical.breedSpecification
                                        )}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Group>
                    )}
                    <Divider
                        orientation="horizontal"
                        label={
                            <>
                                <IconFolderOpen size={14} stroke={1.5} />
                                <Text ml={5} size={"sm"}>
                                    records: {medicalData?.length ?? 0}
                                </Text>
                            </>
                        }
                    />
                    {isFetchingMedical && (
                        <>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Paper
                                    key={index}
                                    p="md"
                                    // withBorder
                                    bg={"gray.1"}
                                    radius="md"
                                    h={"300px"}
                                    className="animate-pulse"
                                >
                                    <div></div>
                                </Paper>
                            ))}
                        </>
                    )}

                    {/* DATA STATE */}
                    {!isFetchingMedical &&
                    isSuccessMedical &&
                    medicalData?.length > 0
                        ? medicalData.map((log) => (
                              <Paper
                                  key={log.id}
                                  p="md"
                                  withBorder
                                  radius="md"
                                  shadow="xs"
                                  className="hover:shadow-md transition-shadow"
                              >
                                  <Group justify="space-between" mb="xs">
                                      <Badge
                                          color="blue"
                                          variant="light"
                                          size="sm"
                                      >
                                          {log.service?.title ||
                                              "Service Record"}
                                      </Badge>
                                      <Text size="xs" c="dimmed" fw={500}>
                                          {new Date(
                                              log.createdAt
                                          ).toLocaleDateString(undefined, {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })}
                                      </Text>
                                  </Group>

                                  <SimpleGrid cols={2} spacing="xs" mb="sm">
                                      <Box>
                                          <Text
                                              size="xs"
                                              c="dimmed"
                                              tt="uppercase"
                                              fw={700}
                                          >
                                              Weight
                                          </Text>
                                          <Text size="sm" fw={500}>
                                              {log.weight} kg
                                          </Text>
                                      </Box>
                                      <Box>
                                          <Text
                                              size="xs"
                                              c="dimmed"
                                              tt="uppercase"
                                              fw={700}
                                          >
                                              Temp
                                          </Text>
                                          <Text size="sm" fw={500}>
                                              {log.temperature}°C
                                          </Text>
                                      </Box>
                                  </SimpleGrid>

                                  <Divider my="sm" variant="dashed" />

                                  <Stack gap={4}>
                                      <Text size="sm" fw={700}>
                                          Diagnosis:
                                      </Text>
                                      <Text size="sm" c="gray.7" mb="xs">
                                          {log.diagnosis ||
                                              "No diagnosis provided"}
                                      </Text>

                                      <Text size="sm" fw={700}>
                                          Symptoms:
                                      </Text>
                                      <Text size="sm" c="gray.7" mb="xs">
                                          {log.symptoms || "N/A"}
                                      </Text>

                                      <Text size="sm" fw={700}>
                                          Prescription:
                                      </Text>
                                      <Text size="sm" c="indigo.8">
                                          {log.prescription || "None"}
                                      </Text>
                                  </Stack>

                                  {log.notes && (
                                      <Box
                                          mt="md"
                                          p="xs"
                                          bg="gray.0"
                                          style={{ borderRadius: "4px" }}
                                      >
                                          <Text size="xs" fw={700} c="dimmed">
                                              CLINICAL NOTES
                                          </Text>
                                          <Text size="sm">{log.notes}</Text>
                                      </Box>
                                  )}
                              </Paper>
                          ))
                        : /* EMPTY STATE (only show if not fetching) */
                          !isFetchingMedical && (
                              <Stack align="center" mt="xl" gap="xs">
                                  <Text c="dimmed" size="sm">
                                      No medical records found for this pet.
                                  </Text>
                              </Stack>
                          )}
                </Stack>
            </Drawer>
        </Stack>
    );
}
