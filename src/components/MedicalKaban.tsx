"use client";

import { MarkAsInProgressAction, MarkAsComplete } from "@/actions/medical";
import { CreateMedical } from "@/actions/medical";
import { AppointmentType } from "@/db/schema/appointments";
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
    Checkbox,
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

export default function MedicalKanban() {
    const { data } = useMedicalAdmin();
    const [selectedPet, setSelectedPet] = useState<AppointedPet | null>(null);
    const [activeApptId, setActiveApptId] = useState<string | null>(null);
    const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);

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

    const handleOpenMedical = (
        pet: AppointedPet,
        apptId: string,
        invoiceId: string | null
    ) => {
        setSelectedPet(pet);
        setActiveApptId(apptId);
        setActiveInvoiceId(invoiceId);
    };

    return (
        <Box p="md" h="calc(100vh - 60px)">
            <Grid h="100%" gutter="md">
                <KanbanColumn
                    title="Arrived / Waiting"
                    color="blue"
                    items={arrived}
                    onMedicalClick={handleOpenMedical}
                />
                <KanbanColumn
                    title="In Progress"
                    color="green"
                    items={inProgress}
                    active
                    onMedicalClick={handleOpenMedical}
                />
                <KanbanColumn
                    title="Completed"
                    color="gray"
                    items={completed}
                    completed
                    onMedicalClick={handleOpenMedical}
                />
            </Grid>

            <Drawer
                opened={!!selectedPet}
                onClose={() => setSelectedPet(null)}
                withinPortal
                position="right"
                radius={"md"}
                offset={8}
                padding="xl"
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
            >
                {selectedPet && (
                    <MedicalForm
                        invoiceId={activeInvoiceId}
                        pet={selectedPet}
                        appointmentId={activeApptId}
                        onClose={() => setSelectedPet(null)}
                    />
                )}
            </Drawer>
        </Box>
    );
}

interface MedicalFormProps {
    pet: AppointedPet;
    appointmentId: string | null;
    onClose: () => void;
    invoiceId: string | null;
}

function MedicalForm({
    pet,
    appointmentId,
    onClose,
    invoiceId,
}: MedicalFormProps) {
    const queryClient = useQueryClient();
    const createMedical = CreateMedical.bind(null);

    const [formState, formAction, isCreating] = useActionState(createMedical, {
        success: false,
    });

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
            diagnosis: null,
        },
        validate: zod4Resolver(insertMedicalLogSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
        mode: "uncontrolled",
    });

    useEffect(() => {
        if (formState.success) {
            queryClient.invalidateQueries({ queryKey: ["medical", "admin"] });
            onClose();
        }
    }, [formState]);

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                if (invoiceId) {
                    form.setValues({ invoiceId: invoiceId });
                    startTransition(() => {
                        formAction(values);
                    });
                }
            })}
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
                    minRows={2}
                    {...form.getInputProps("symptoms")}
                />

                <Textarea
                    label="Diagnosis"
                    placeholder="Preliminary or confirmed diagnosis..."
                    minRows={2}
                    {...form.getInputProps("diagnosis")}
                />

                <Textarea
                    label="Clinical Notes"
                    placeholder="Detailed examination findings..."
                    minRows={5}
                    withAsterisk
                    {...form.getInputProps("notes")}
                />
                <Textarea
                    label="Prescription / Medications"
                    placeholder="e.g., Amoxicillin 250mg - 1 tablet twice daily for 10 days"
                    description="Specify dosage, frequency, and duration"
                    minRows={3}
                    {...form.getInputProps("prescription")}
                />

                <Button
                    fullWidth
                    mt="md"
                    type="submit"
                    disabled={isCreating || !form.isValid()}
                    loading={isCreating}
                >
                    Save Medical Record
                </Button>
            </Stack>
        </form>
    );
}
