"use client";

import { ServiceMergePriceType } from "@/db/schema/services";
import {
    Alert,
    Button,
    Checkbox,
    Group,
    Modal,
    Stack,
    Table,
    Text,
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
import { useDisclosure } from "@mantine/hooks";
import { PetTypeModel } from "@/types/pets";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { CreateInvoice } from "@/actions/invoice";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/lib/toTitleCase";
import LongItemFormatter from "@/lib/LongItemFormatter";
import { getSizeByWeight } from "@/lib/getSizeByWeight";

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

    const router = useRouter();

    const [opened, { close, open }] = useDisclosure();

    const [
        openedCreateInvoiceModal,
        { close: closeCreateInvoiceModal, open: openCreateInvoiceModal },
    ] = useDisclosure();

    const createInvoice = CreateInvoice.bind(null);

    const [formState, formAction, isPending] = useActionState(createInvoice, {
        success: false,
        error: "",
    });

    const handleIssueInvoice = async () => {
        closeCreateInvoiceModal();

        startTransition(() => {
            formAction({
                rawInvoice: {
                    status: "ARRIVED",
                    appointmentId: appointmentId,
                    userId: userId,
                },
                items: selectedRows.map((row) => ({
                    petId: row.petId,
                    priceAtInvoice: "0.00",
                    serviceId: row.serviceId,
                })),
            });
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
                />
            );
        })
        .filter(Boolean);

    useEffect(() => {
        if (formState.success && formState.invoiceId) {
            notifications.show({
                title: "Invoice Created",
                message: `Invoice #${formState.invoiceId} has been saved successfully with ${formState.insertedInvoiceItemsLength} item(s).`,
                color: "green",
                icon: <IconCheck size={18} />,
                autoClose: 3000,
            });
            router.push("/v1/clinic/invoice");
        }

        if (formState.error) {
            notifications.show({
                title: "Create Invoice failed",
                message: formState.error,
                color: "red",
                icon: <IconX size={18} />,
                autoClose: false,
            });
        }
    }, [formState]);

    useEffect(() => {
        console.log(pets);
    }, [pets]);

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
                    <Button variant="default" onClick={open}>
                        Add pet
                    </Button>
                    <Button
                        leftSection={<IconInvoice size={20} />}
                        disabled={
                            noWeightPets.length > 0 ||
                            !selectedRows.length ||
                            isPending
                        }
                        radius={"md"}
                        loading={isPending}
                        onClick={() => openCreateInvoiceModal()}
                    >
                        Create invoice
                    </Button>
                </Group>
            </Stack>

            <PetsSelectModal
                appointmentId={appointmentId}
                services={services}
                onClose={close}
                opened={opened}
                allPets={allPets}
            />

            <Modal
                centered
                withCloseButton={false}
                opened={openedCreateInvoiceModal}
                onClose={closeCreateInvoiceModal}
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
                            onClick={closeCreateInvoiceModal}
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
        </>
    );
}
