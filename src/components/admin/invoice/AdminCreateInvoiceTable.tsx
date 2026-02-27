"use client";

import { ServiceMergePriceType } from "@/db/schema/services";
import { toTitleCase } from "@/lib/toTitleCase";
import {
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
import { paymentStatusType } from "@/db/schema/invoice";
import { useRouter } from "next/navigation";

type Props = {
    pets: PetServiceMerged[];
    allPets: PetTypeModel[];
    services: ServiceMergePriceType[];
    appointmentId: string;
    clientId: string;
};

export default function AdminCreateInvoiceTable({
    pets,
    services,
    allPets,
    appointmentId,
    clientId,
}: Props) {
    const [selectedRows, setSelectedRows] = useState<PetServiceMerged[]>([]);

    const router = useRouter();

    const [opened, { close, open }] = useDisclosure();

    const [
        openedPaymentStatus,
        { close: closePaymentStatus, open: openPaymentStatus },
    ] = useDisclosure();

    const createInvoice = CreateInvoice.bind(null);

    const [formState, formAction, isPending] = useActionState(createInvoice, {
        success: false,
        invoiceId: null,
        error: "",
    });

    const handleIssueInvoice = async (
        paymentStatus: (typeof paymentStatusType.enumValues)[number]
    ) => {
        closePaymentStatus();
        startTransition(() => {
            formAction({
                rawInvoice: {
                    userId: clientId,
                    totalAmount: sum.toFixed(2),
                    status: paymentStatus,
                    appointmentId: appointmentId,
                },
                items: selectedRows.map((row) => ({
                    petId: row.petId,
                    priceAtInvoice: row.priceAtBooking.toFixed(2),
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
            const price = Number(row.priceAtBooking) || 0;
            return acc + price;
        }, 0);
    }, [selectedRows]);

    const rows = pets.map((pet) => (
        <PetRow
            key={pet.id}
            pet={pet}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
        />
    ));

    useEffect(() => {
        if (formState.success && formState.invoiceId) {
            notifications.show({
                title: "Invoice Created",
                message: `Invoice #${formState.invoiceId} has been saved successfully.`,
                color: "green",
                icon: <IconCheck size={18} />,
                autoClose: 3000,
            });
            router.push("/v1/admin/invoice");
        }

        if (formState.error) {
            notifications.show({
                title: "Action Failed",
                message: formState.error,
                color: "red",
                icon: <IconX size={18} />,
                autoClose: false,
            });
        }
    }, [formState]);

    return (
        <>
            <Stack>
                <Table
                    withRowBorders
                    withTableBorder={false}
                    withColumnBorders
                    striped
                    tabularNums
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td>
                                <Checkbox
                                    aria-label="Select all row"
                                    onClick={(event) => {
                                        if (event.currentTarget.checked)
                                            setSelectedRows(pets);
                                        else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </Table.Td>
                            <Table.Th>Pet</Table.Th>
                            <Table.Th>Source</Table.Th>
                            <Table.Th>Service</Table.Th>
                            <Table.Th>Price at booking</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                        <Table.Tr>
                            <Table.Td colSpan={4} align="right" fw={"bold"}>
                                Total
                            </Table.Td>
                            <Table.Td colSpan={2} fw={"bold"}>
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
                                    {noWeightPets.join(", ")})
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
                        loading={isPending}
                        onClick={() => openPaymentStatus()}
                    >
                        Issue Invoice
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
                title="Payment Status"
                centered
                withCloseButton
                opened={openedPaymentStatus}
                onClose={closePaymentStatus}
                radius={"lg"}
                size={"md"}
                shadow="xl"
            >
                <Group justify="center">
                    <Button
                        size="md"
                        onClick={() => handleIssueInvoice("PAID")}
                    >
                        Save & mark as paid
                    </Button>
                    <Button
                        size="md"
                        onClick={() => handleIssueInvoice("UNPAID")}
                    >
                        Save as unpaid
                    </Button>
                </Group>
            </Modal>
        </>
    );
}
