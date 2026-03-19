"use client";

import { ServiceMergePriceType } from "@/db/schema/services";
import {
    Alert,
    Avatar,
    Button,
    Checkbox,
    Group,
    Modal,
    NumberInput,
    Stack,
    Table,
    Text,
    useModalsStack,
} from "@mantine/core";
import { IconCheck, IconInvoice, IconX } from "@tabler/icons-react";
import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from "react";
import { PetRow } from "./PetRow";
import PetsSelectModal from "./PetsSelectModal";
import { PetTypeModel } from "@/types/pets";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { CreateInvoice } from "@/actions/invoice";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/lib/toTitleCase";
import LongItemFormatter from "@/lib/LongItemFormatter";
import { getSizeByWeight } from "@/lib/getSizeByWeight";
import { UpdatePetWeight } from "@/actions/pets";
import { useForm } from "@mantine/form";

type Props = {
    appointmentId: string;
    pets: PetServiceMerged[];
    allPets: PetTypeModel[];
    userId: string;
    services: ServiceMergePriceType[];
};

export default function AdminCreateInvoiceTable({
    appointmentId,
    userId,
    pets,
    services,
    allPets,
}: Props) {
    const [selectedRows, setSelectedRows] = useState<PetServiceMerged[]>([]);
    const [selectedPet, setSelectedPet] = useState<PetServiceMerged | null>(
        null
    );

    const router = useRouter();
    const modals = useModalsStack(["invoice", "select"]);

    const createInvoice = CreateInvoice.bind(null);
    const updatePetWeight = UpdatePetWeight.bind(null);

    const [createInvoiceState, createInvoiceAction, isPendingCreateInvoice] =
        useActionState(createInvoice, {
            success: false,
            error: "",
        });

    const [addPetWeightState, addPetWeightAction, isPendingAddPetWeight] =
        useActionState(updatePetWeight, {
            success: false,
            petId: "",
            petName: "",
        });

    const handleIssueInvoice = async () => {
        modals.close("invoice");

        startTransition(() => {
            createInvoiceAction({
                rawInvoice: {
                    status: "ARRIVED",
                    appointmentId: appointmentId,
                    userId: userId,
                },
                items: selectedRows.map((row) => ({
                    petId: row.petId,
                    priceAtInvoice: row.priceAtInvoice,
                    serviceId: row.serviceId,
                })),
            });
        });
    };

    const weightForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            weight: "0.00",
        },

        validate: {
            weight: (value) => {
                const num = parseFloat(value);
                if (!value || isNaN(num)) return "Please enter a valid weight";
                if (num <= 0) return "Weight must be greater than 0";
                if (num > 100) return "Weight seems too high";
                if (!/^\d*\.?\d*$/.test(value)) return "Invalid number format";
                return null;
            },
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
    });

    const handleAddWeight = async ({ weight }: { weight: string }) => {
        if (!selectedPet) return;

        startTransition(() => {
            addPetWeightAction({ weight: weight, petId: selectedPet.petId });
        });
    };

    const noWeightPets = useMemo(() => {
        return pets
            .filter((p) => !p.weight)
            .map((pets) => toTitleCase(pets.name));
    }, [pets]);

    const sum = useMemo(() => {
        return selectedRows.reduce((acc, row) => {
            const price = Number(row.priceAtInvoice);
            return acc + price;
        }, 0);
    }, [selectedRows]);

    const renderedRows = pets
        .map((pet) => {
            const weight = getSizeByWeight(pet.weight);
            const service = services.find((s) => s.id === pet.serviceId);

            const variant =
                service?.variants.find((v) => v.variant === weight) ||
                service?.variants.find((v) => v.variant === "FLAT");
            if (!variant) return;

            return (
                <PetRow
                    noWeight={!pet.weight}
                    key={`${pet.id}`}
                    pet={pet}
                    selectedRows={selectedRows.map((r) => ({
                        ...r,
                    }))}
                    priceAtInvoice={variant.price}
                    setSelectedRows={setSelectedRows}
                    onSetWeight={
                        !pet.weight
                            ? () => {
                                  setSelectedPet(pet);
                              }
                            : undefined
                    }
                />
            );
        })
        .filter(Boolean);

    useEffect(() => {
        if (createInvoiceState.success && createInvoiceState.invoiceId) {
            notifications.show({
                title: "Invoice Created",
                message: `Invoice #${createInvoiceState.invoiceId} has been saved successfully with ${createInvoiceState.insertedInvoiceItemsLength} item(s).`,
                color: "teal",
                icon: <IconCheck size={18} />,
                autoClose: 3000,
            });
            router.push("/v1/clinic/invoice");
        }

        if (createInvoiceState.error) {
            notifications.show({
                title: "Create Invoice failed",
                message: createInvoiceState.error,
                color: "red",
                icon: <IconX size={18} />,
                autoClose: false,
            });
        }
    }, [createInvoiceState]);

    useEffect(() => {
        if (!addPetWeightState) return;
        if (addPetWeightState.success && addPetWeightState.petName) {
            notifications.show({
                title: "Weight saved",
                message: `Weight has been saved successfully for ${addPetWeightState.petName}!`,
                color: "teal",
                icon: <IconCheck size={18} />,
                autoClose: 3000,
            });
            setSelectedPet(null);
            weightForm.reset();
            return;
        } else if (addPetWeightState.error && !addPetWeightState.success) {
            notifications.show({
                title: addPetWeightState.error,
                message: "We couldn't save the weight. Please try again.",
                color: "red",
                icon: <IconX size={18} />,
            });
        }
    }, [addPetWeightState]);

    return (
        <>
            <Stack>
                <Table
                    bg={"white"}
                    withRowBorders
                    withTableBorder={true}
                    withColumnBorders
                    striped={false}
                    tabularNums
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Pet</Table.Th>
                            <Table.Th>Source</Table.Th>
                            <Table.Th>Service</Table.Th>
                            <Table.Th>Price at booking</Table.Th>
                            <Table.Td>
                                <Checkbox
                                    aria-label="Select all row"
                                    onClick={(event) => {
                                        if (event.currentTarget.checked) {
                                            const allPets = pets.map((pet) => {
                                                if (!pet.weight) return;
                                                const weight = getSizeByWeight(
                                                    pet.weight
                                                );
                                                const service = services.find(
                                                    (s) =>
                                                        s.id === pet.serviceId
                                                );

                                                const variant =
                                                    service?.variants.find(
                                                        (v) =>
                                                            v.variant === weight
                                                    ) ||
                                                    service?.variants.find(
                                                        (v) =>
                                                            v.variant === "FLAT"
                                                    );
                                                if (!variant) return;

                                                return {
                                                    ...pet,
                                                    priceAtInvoice:
                                                        variant.price,
                                                };
                                            });
                                            setSelectedRows(
                                                allPets.filter((p) => !!p)
                                            );
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </Table.Td>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {renderedRows}
                        <Table.Tr>
                            <Table.Td colSpan={3} align="right" fw={"bold"}>
                                Total
                            </Table.Td>
                            <Table.Td fw={"bold"}>
                                {new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                    minimumFractionDigits: 2,
                                }).format(sum)}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>

                    {noWeightPets.length > 0 && (
                        <Table.Caption>
                            <Group>
                                <Text c={"red"} size="sm">
                                    Warning: Pets with no weight (
                                    {LongItemFormatter(noWeightPets)})
                                </Text>
                            </Group>
                        </Table.Caption>
                    )}
                </Table>
                <Group justify="space-between">
                    <Button
                        variant="default"
                        onClick={() => modals.open("select")}
                    >
                        Add pet
                    </Button>
                    <Button
                        leftSection={<IconInvoice size={20} />}
                        disabled={
                            noWeightPets.length > 0 ||
                            !selectedRows.length ||
                            isPendingCreateInvoice
                        }
                        radius={"md"}
                        loading={isPendingCreateInvoice}
                        onClick={() => modals.open("invoice")}
                    >
                        Create invoice
                    </Button>
                </Group>
            </Stack>
            <PetsSelectModal
                appointmentId={appointmentId}
                services={services}
                onClose={() => modals.close("select")}
                opened={modals.state.select}
                allPets={allPets}
            />
            <Modal
                centered
                withCloseButton={false}
                opened={modals.state.invoice}
                onClose={() => modals.close("invoice")}
                radius={"md"}
                size={"lg"}
                shadow="xl"
            >
                <Stack>
                    <Alert
                        color="blue"
                        title="Invoice Confirmation"
                        variant="light"
                    >
                        You are about to generate an official invoice. Please
                        ensure all services and pet details are correct before
                        proceeding.
                    </Alert>
                    <Group justify="end">
                        <Button
                            radius="md"
                            variant="default"
                            onClick={() => modals.close("invoice")}
                        >
                            Cancel
                        </Button>
                        <Button
                            radius="md"
                            bg={"red"}
                            onClick={handleIssueInvoice}
                        >
                            Confirm
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                opened={!!selectedPet}
                onClose={() => setSelectedPet(null)}
                size={"md"}
                centered
                radius={"lg"}
                withCloseButton={false}
            >
                <form
                    onSubmit={weightForm.onSubmit((value) =>
                        handleAddWeight(value)
                    )}
                >
                    <Stack p={"sm"}>
                        <Group>
                            <Avatar src={selectedPet?.photoUrl} size={"lg"}>
                                {selectedPet?.name[0]}
                            </Avatar>
                            <Stack gap={0}>
                                <Text>{selectedPet?.name}</Text>
                                <Text size="xs" c={"dimmed"}>
                                    {selectedPet?.petId}
                                </Text>
                            </Stack>
                        </Group>
                        <NumberInput
                            id="weightInput"
                            label="Weight (kg)"
                            placeholder="0.00"
                            decimalScale={2}
                            description={
                                "Set the weight of the pet to enable other services"
                            }
                            fixedDecimalScale
                            min={0}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                            withAsterisk
                            {...weightForm.getInputProps("weight")}
                        />
                        <Group justify="flex-end">
                            <Button
                                variant="default"
                                radius={"md"}
                                onClick={() => {
                                    setSelectedPet(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                radius={"md"}
                                loading={isPendingAddPetWeight}
                                type="submit"
                                disabled={!weightForm.isValid()}
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
