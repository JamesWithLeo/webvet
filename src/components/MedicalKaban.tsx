"use client";

import { CreateMedical, GetMedicalLogAction } from "@/actions/medical";
import useMedicalAdmin from "@/lib/hooks/useMedicalAdmin";
import {
    InsertMedicalLog,
    insertMedicalLogSchema,
} from "@/lib/validators/newMedicalZodSchema";
import {
    Badge,
    Text,
    Group,
    Stack,
    Grid,
    Box,
    Button,
    Drawer,
    NumberInput,
    Textarea,
    LoadingOverlay,
    TextInput,
    Popover,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from "react";
import KanbanColumn from "./KanbanColumn";
import { AppointedPet } from "@/types/pets";
import { MedicalLogsTypeModel } from "@/db/schema/medicalLogs";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { format } from "date-fns";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function MedicalKanban() {
    const [dateRange, setDateRange] = useState<{
        from: string | null;
        to: string | null;
    }>({
        from: format(new Date(), "yyyy-MM-dd"),
        to: format(new Date(), "yyyy-MM-dd"),
    });

    const { data, isLoading, isError } = useMedicalAdmin(dateRange);

    // States for the Drawer
    const [selectedPet, setSelectedPet] = useState<AppointedPet | null>(null);
    const [activeApptId, setActiveApptId] = useState<string | null>(null);
    const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
    const [selectedMedical, setSelectedMedical] =
        useState<MedicalLogsTypeModel | null>(null);

    const [medicalLogState, medicalLogAction, isFetchingLog] = useActionState(
        GetMedicalLogAction,
        {
            success: false,
            error: "",
            appointmentId: "",
            serviceId: "",
            pet: {
                id: "",
                invoiceItemId: "",
                name: "",
                species: "dog",
                serviceName: "",
                serviceId: "",
                serviceType: "CHECK_UP",
                log: "",
            },
        }
    );

    const handleMedical = (
        appointmentId: string,
        invoiceId: string,
        pet: AppointedPet
    ) => {
        // Set context first
        setActiveApptId(appointmentId);
        setActiveInvoiceId(invoiceId);
        setSelectedPet(pet);

        // If a log exists, fetch it to populate the form
        if (pet.log) {
            startTransition(() => {
                medicalLogAction({
                    appointmentId,
                    pet: pet,
                    serviceId: pet.serviceId,
                });
            });
        } else {
            // New log: clear previous data
            setSelectedMedical(null);
        }
    };

    const { arrived, inProgress, completed } = useMemo(() => {
        if (!data) {
            return {
                arrived: [],

                inProgress: [],

                completed: [],
            };
        }

        const arrived = data.filter((i) => i.invoice?.status === "ARRIVED");

        const inProgress = data.filter(
            (i) => i.invoice?.status === "IN_PROGRESS"
        );

        const completed = data.filter((i) => i.invoice?.status === "COMPLETED");

        return { arrived, inProgress, completed };
    }, [data]);

    useEffect(() => {
        if (medicalLogState.success && medicalLogState.data) {
            setSelectedMedical(medicalLogState.data);
        }
    }, [medicalLogState]);

    return (
        <Stack p="md" w={"100%"}>
            <Grid justify="end">
                <Popover position="bottom-end" withArrow radius={"md"}>
                    <Popover.Target>
                        <TextInput
                            miw={300}
                            value={`${dateRange.from && new Date(dateRange.from).toDateString()} - ${dateRange.to && new Date(dateRange.to).toDateString()}`}
                            label="Filter by Date"
                            placeholder="Pick date range"
                            readOnly
                            radius={"md"}
                            rightSection={
                                <IconX
                                    stroke={1.5}
                                    size={18}
                                    onClick={() => {
                                        setDateRange({
                                            from: new Date().toISOString(),
                                            to: new Date().toISOString(),
                                        });
                                    }}
                                />
                            }
                        />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack>
                            <DatePicker
                                type="range"
                                size="sm"
                                presets={[
                                    {
                                        label: "Today",
                                        value: [
                                            dayjs().format("YYYY-MM-DD"),
                                            dayjs()
                                                .endOf("day")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "Yesterday",
                                        value: [
                                            dayjs()
                                                .subtract(1, "day")
                                                .format("YYYY-MM-DD"),
                                            dayjs()
                                                .subtract(1, "day")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "Last 7 Days",
                                        value: [
                                            dayjs()
                                                .subtract(6, "days")
                                                .format("YYYY-MM-DD"),
                                            dayjs().format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "This Month (MTD)",
                                        value: [
                                            dayjs()
                                                .startOf("month")
                                                .format("YYYY-MM-DD"),
                                            dayjs()
                                                .endOf("month")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "Last Month",
                                        value: [
                                            dayjs()
                                                .subtract(1, "month")
                                                .startOf("month")
                                                .format("YYYY-MM-DD"),
                                            dayjs()
                                                .subtract(1, "month")
                                                .endOf("month")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "Last Year",
                                        value: [
                                            dayjs()
                                                .subtract(1, "year")
                                                .startOf("year")
                                                .format("YYYY-MM-DD"),
                                            dayjs()
                                                .subtract(1, "year")
                                                .endOf("year")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                    {
                                        label: "Full Current Year",
                                        value: [
                                            dayjs()
                                                .startOf("year")
                                                .format("YYYY-MM-DD"),
                                            dayjs()
                                                .endOf("year")
                                                .format("YYYY-MM-DD"),
                                        ],
                                    },
                                ]}
                                value={[dateRange.from, dateRange.to]}
                                onChange={(e) =>
                                    setDateRange({ from: e[0], to: e[1] })
                                }
                            />
                        </Stack>
                    </Popover.Dropdown>
                </Popover>
            </Grid>
            <Grid h="100%" w={"100%"}>
                <KanbanColumn
                    title="Arrived"
                    color="gray"
                    items={arrived}
                    onMedicalClick={handleMedical}
                />
                <KanbanColumn
                    title="In Progress"
                    color="blue"
                    items={inProgress}
                    active
                    onMedicalClick={handleMedical}
                />
                <KanbanColumn
                    title="Completed"
                    color="green"
                    items={completed}
                    completed
                    onMedicalClick={handleMedical}
                />
            </Grid>

            <Drawer
                offset={8}
                radius={"md"}
                opened={!!selectedPet}
                onClose={() => {
                    setSelectedPet(null);
                    setSelectedMedical(null);
                }}
                title={
                    <Group gap="xs">
                        <Text fw={700} size="lg">
                            Medical Record:
                        </Text>

                        {selectedPet && (
                            <Badge size="lg" variant="light" color="blue">
                                {selectedPet.species?.toLowerCase() === "cat"
                                    ? "🐱"
                                    : "🐶"}{" "}
                                {selectedPet.name}
                            </Badge>
                        )}
                    </Group>
                }
                position="right"
                padding="xl"
            >
                {selectedPet && (
                    <MedicalForm
                        loading={isFetchingLog}
                        invoiceId={activeInvoiceId}
                        pet={selectedPet}
                        appointmentId={activeApptId!}
                        initialValues={selectedMedical}
                        onClose={() => setSelectedPet(null)}
                    />
                )}
            </Drawer>
        </Stack>
    );
}
interface MedicalFormProps {
    pet: AppointedPet;
    onClose: () => void;
    appointmentId: string;
    invoiceId: string | null;
    initialValues: MedicalLogsTypeModel | null;
    loading?: boolean;
}

function MedicalForm({
    pet,
    appointmentId,
    onClose,
    invoiceId,
    initialValues,
    loading,
}: MedicalFormProps) {
    const queryClient = useQueryClient();
    const [formState, formAction, isSubmitting] = useActionState(
        CreateMedical,
        { success: false, error: "" }
    );

    const form = useForm<InsertMedicalLog>({
        initialValues: {
            invoiceId: invoiceId ?? "",
            weight: 0,
            serviceId: pet.serviceId,
            temperature: 38.5,
            notes: "",
            petId: pet.id,
            appointmentId: appointmentId,
            prescription: "",
            diagnosis: "",
            symptoms: "",
        },
        validate: zod4Resolver(insertMedicalLogSchema),
    });

    useEffect(() => {
        if (initialValues) {
            form.setValues({
                ...initialValues,
                // Ensure strings for Mantine inputs
                weight: Number(initialValues.weight || "0"),
                temperature: Number(
                    initialValues.temperature?.toString() || "38.5"
                ),
            });
        } else {
            form.reset();
        }
    }, [initialValues]);

    useEffect(() => {
        if (formState.success) {
            queryClient.invalidateQueries({ queryKey: ["medical", "admin"] });
            onClose();
        }
    }, [formState.success]);

    return (
        <Box pos="relative">
            <LoadingOverlay visible={loading} />
            <form
                onSubmit={form.onSubmit((values) =>
                    startTransition(() => formAction(values))
                )}
            >
                <Stack gap="md">
                    <Group grow>
                        <NumberInput
                            label="Weight (kg)"
                            placeholder="0.00"
                            decimalScale={2}
                            fixedDecimalScale
                            min={0}
                            {...form.getInputProps("weight")}
                        />
                        <NumberInput
                            label="Temp (°C)"
                            placeholder="38.5"
                            step={0.1}
                            decimalScale={1}
                            {...form.getInputProps("temperature")}
                        />
                    </Group>

                    <Textarea
                        label="Symptoms"
                        placeholder="e.g., Lethargy, loss of appetite, coughing..."
                        minRows={3}
                        rows={5}
                        {...form.getInputProps("symptoms")}
                    />

                    <Textarea
                        label="Diagnosis"
                        placeholder="Preliminary or confirmed diagnosis..."
                        minRows={3}
                        rows={5}
                        {...form.getInputProps("diagnosis")}
                    />

                    <Textarea
                        label="Clinical Notes"
                        placeholder="Detailed examination findings..."
                        rows={5}
                        minRows={5}
                        withAsterisk
                        {...form.getInputProps("notes")}
                    />
                    <Textarea
                        label="Prescription / Medications"
                        placeholder="e.g., Amoxicillin 250mg - 1 tablet twice daily for 10 days"
                        description="Specify dosage, frequency, and duration"
                        minRows={3}
                        rows={5}
                        {...form.getInputProps("prescription")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting}
                        disabled={loading}
                    >
                        {initialValues
                            ? "Update Medical Record"
                            : "Save Medical Record"}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
