"use client";

import UpdateSchedule from "@/actions/updateSchedule";
import { AppointmentSchedulesTypeModel } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    ServiceScheduleInput,
    updateServiceScheduleSchema,
} from "@/lib/validators/serviceScheduleZodScheme";
import {
    Stack,
    MultiSelect,
    Group,
    Box,
    Text,
    Switch,
    Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useActionState, useEffect, useState } from "react";

const dayInAweek = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
];

const getInitialValues = (
    schedules: AppointmentSchedulesTypeModel[] | null
): ServiceScheduleInput => {
    const defaults: ServiceScheduleInput = {
        GROOMING: [],
        VACCINATION: [],
        CHECK_UP: [],
        DEWORMING: [],
    };

    if (!schedules) return defaults;

    schedules.forEach((s) => {
        const key = s.appointmentType as keyof ServiceScheduleInput;
        if (key in defaults) {
            defaults[key] = s.availableDays.map((day) => String(day)) as (
                | "0"
                | "1"
                | "2"
                | "3"
                | "4"
                | "5"
                | "6"
            )[];
        }
    });

    return defaults;
};

export default function AdminCalendarSchedules({
    schedules,
}: {
    schedules: AppointmentSchedulesTypeModel[] | null;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const updateSchedule = UpdateSchedule.bind(null);

    const [formState, formAction, isPending] = useActionState(updateSchedule, {
        success: false,
    });

    const form = useForm<ServiceScheduleInput>({
        validateInputOnChange: true,
        validate: zod4Resolver(updateServiceScheduleSchema),
        validateInputOnBlur: true,
        initialValues: getInitialValues(schedules),
    });
    const handleSubmit = (values: ServiceScheduleInput) => {
        startTransition(() => {
            formAction(values);
        });
    };
    useEffect(() => {
        if (formState.success && formState.data) {
            notifications.show({
                title: "Updated successfuly!",
                message: "The service schedules is now updated!",
                icon: <IconCheck size={20} />,
                color: "teal",
                autoClose: 6000,
            });
            form.resetDirty();
            setIsEditing(false);
        }

        if (!formState.success && formState.error) {
            notifications.show({
                title: "Update failed!",
                message: `${formState.error}`,
                icon: <IconX size={20} />,
                color: "red",
                autoClose: 6000,
            });
        }
    }, [formState]);
    return (
        <>
            <Group justify="space-between">
                <Text size="xl" fw={700} c="dimmed" mb="xs" tt="uppercase">
                    Scheduling
                </Text>

                <Button
                    leftSection={<IconEdit size={20} />}
                    variant="subtle"
                    c={"dimmed"}
                    size="sm"
                    onClick={() => {
                        setIsEditing(!isEditing);
                    }}
                >
                    Edit
                </Button>
            </Group>
            <Stack gap="xl">
                <form>
                    <Stack>
                        {schedules &&
                            schedules.map((v) => (
                                <MultiSelect
                                    readOnly={!isEditing}
                                    key={v.appointmentType}
                                    label={`${toTitleCase(v.appointmentType)} days`}
                                    {...form.getInputProps(v.appointmentType)}
                                    description={`Select which days of the week ${v.appointmentType.toLowerCase()} is available`}
                                    data={dayInAweek.map((v) => ({
                                        value: v.value.toString(),
                                        label: v.label,
                                    }))}
                                />
                            ))}
                        <Group hidden={!isEditing} justify="flex-end">
                            <Button
                                size="xs"
                                fw={"600"}
                                variant="default"
                                onClick={() => {
                                    form.reset();
                                    form.resetDirty();
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="xs"
                                fw={"600"}
                                loading={isPending}
                                disabled={!form.isValid() || !isEditing}
                                onClick={() => {
                                    form.onSubmit((v) => {
                                        handleSubmit(v);
                                    })();
                                }}
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>

                <Group justify="space-between" wrap="nowrap">
                    <Box>
                        <Text fw={500}>Manual Approval</Text>
                        <Text size="xs" c="dimmed">
                            Require staff review for all appointments
                        </Text>
                    </Box>
                    <Switch size="lg" onLabel="ON" offLabel="OFF" />
                </Group>
            </Stack>
        </>
    );
}
