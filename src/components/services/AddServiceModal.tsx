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
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, startTransition, useEffect } from "react";

const formInitialValues: ServiceFormInput = {
    title: "",
    description: "",
    type: "",
    reminder: "",
    inclusions: "",
};

export default function AddServiceModal({
    opened,
    close,
}: {
    opened: boolean;
    close: () => void;
}) {
    const createService = CreateService.bind(null);

    const [formState, formAction, isPending] = useActionState(createService, {
        succesful: false,
    });

    const form = useForm<ServiceFormInput>({
        mode: "uncontrolled",
        initialValues: formInitialValues,
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
                    <TextInput
                        label="Description"
                        withAsterisk
                        {...form.getInputProps("description")}
                    />
                    <TextInput
                        label="Reminder"
                        withAsterisk
                        {...form.getInputProps("reminder")}
                    />
                    <Textarea
                        label="Inclusion"
                        withAsterisk
                        maxRows={3}
                        minRows={3}
                        rows={3}
                        description="Multiple inclusions must be seperated by period(.) ."
                        {...form.getInputProps("inclusions")}
                    />
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
