import CreateService from "@/actions/createService";
import { appointmentTypeValues } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    createServiceSchema,
    ServiceFormInput,
} from "@/lib/validators/serviceZodSchema";
import {
    Button,
    Group,
    Modal,
    NativeSelect,
    Stack,
    Switch,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, startTransition, useEffect, useState } from "react";

export default function AddServiceModal({
    opened,
    close,
}: {
    opened: boolean;
    close: () => void;
}) {
    const createService = CreateService.bind(null);
    const [isFlat, setIsFlat] = useState<boolean>(true);

    const [formState, formAction, isPending] = useActionState(createService, {
        succesful: false,
    });

    const form = useForm<ServiceFormInput>({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            description: "",
            type: "",
            reminder: "",
            inclusions: "",
            flat: "",
            small: "",
            medium: "",
            large: "",
            isFlat: true,
        },
        validate: zod4Resolver(createServiceSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const handleSubmit = (value: ServiceFormInput) => {
        console.log("val:", value);
        startTransition(() => {
            formAction(value);
        });
    };
    useEffect(() => {
        if (formState.succesful && formState.data) {
            notifications.show({
                title: `${toTitleCase(formState.data.title)} Service Saved!`,
                message: "The service is now active and visible to clients.",
                color: "teal",
                icon: <IconCheck size={20} />,
            });
            close();
        }
    }, [formState]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="New Service"
            withOverlay
            withCloseButton
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        label="Title"
                        withAsterisk
                        {...form.getInputProps("title")}
                    />
                    <NativeSelect
                        label="Type"
                        withAsterisk
                        {...form.getInputProps("type")}
                        data={[{ label: "", value: "" }].concat(
                            appointmentTypeValues.map((v) => ({
                                label: toTitleCase(v),
                                value: v,
                            }))
                        )}
                    />
                    <Textarea
                        label="Description"
                        withAsterisk
                        {...form.getInputProps("description")}
                    />
                    <Textarea
                        label="Reminder"
                        withAsterisk
                        {...form.getInputProps("reminder")}
                    />
                    <Textarea
                        label="Inclusion"
                        withAsterisk
                        maxRows={3}
                        minRows={2}
                        rows={2}
                        description="Multiple inclusions must be seperated by period(.) ."
                        {...form.getInputProps("inclusions")}
                    />
                    <Switch
                        label="Flat rate?"
                        description="Enabled this if the service doesn't depend on size."
                        checked={isFlat}
                        onChange={(e) => {
                            const checked = e.currentTarget.checked;
                            setIsFlat(checked);
                            if (checked) {
                                form.setFieldValue("small", "");
                                form.setFieldValue("medium", "");
                                form.setFieldValue("large", "");
                            } else {
                                form.setFieldValue("flat", "");
                            }
                        }}
                    />
                    {isFlat ? (
                        <TextInput
                            label="Flat rate"
                            withAsterisk
                            {...form.getInputProps("flat")}
                        />
                    ) : (
                        <>
                            <TextInput
                                label="Small rate"
                                withAsterisk
                                {...form.getInputProps("small")}
                            />
                            <TextInput
                                label="Medium rate"
                                withAsterisk
                                {...form.getInputProps("medium")}
                            />
                            <TextInput
                                label="Large rate"
                                withAsterisk
                                {...form.getInputProps("large")}
                            />
                        </>
                    )}

                    <Group justify="end" mt={"md"}>
                        <Button
                            type="submit"
                            loading={isPending}
                            disabled={isPending || !form.isValid()}
                        >
                            Save
                        </Button>
                        <Button variant="default" onClick={close}>
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
