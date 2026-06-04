import { useUpdateService } from "@/lib/hooks/useService";
import {
    editServiceSchema,
    ServiceFormEditOuput,
} from "@/lib/validators/serviceZodSchema";
import {
    Button,
    Group,
    Modal,
    Stack,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect, startTransition } from "react";

type Props = {
    opened: boolean;
    close: () => void;
    initialData: ServiceFormEditOuput | null;
};
export default function EditServiceModal({
    opened,
    close,
    initialData,
}: Props) {
    const { mutate: updateService, isPending } = useUpdateService();

    const form = useForm<ServiceFormEditOuput>({
        initialValues: {
            id: "",
            title: "",
            gapInDays: 0,
            annualInterval: 0,
            description: "",
            reminder: "",
            inclusions: [],
        },
        validate: zod4Resolver(editServiceSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const handleSubmit = (data: ServiceFormEditOuput) => {
        startTransition(() => {
            updateService(data, {
                onSuccess: () => {
                    close();
                    notifications.show({
                        title: `Service updated!`,
                        message:
                            "The service is now up to date and visible to clients.",
                        color: "teal",
                        icon: <IconCheck size={20} />,
                    });
                },
                onError: (error) => {
                    notifications.show({
                        title: `Service update failed!`,
                        message: error.message,
                        color: "teal",
                        icon: <IconCheck size={20} />,
                    });
                },
            });
        });
    };

    useEffect(() => {
        if (initialData) {
            form.setValues(initialData);
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Edit service"
            withOverlay
            withCloseButton
        >
            <form>
                <Stack>
                    <TextInput
                        label="Title"
                        withAsterisk
                        {...form.getInputProps("title")}
                    />
                    <TextInput
                        label="Gap in days"
                        withAsterisk
                        {...form.getInputProps("gapInDays")}
                    />
                    <TextInput
                        label="Annual Interval"
                        withAsterisk
                        type="number"
                        {...form.getInputProps("annualInterval")}
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
                    <TagsInput
                        label="Inclusion"
                        withAsterisk
                        type="number"
                        {...form.getInputProps("inclusions")}
                    />

                    <Group justify="end" mt={"md"}>
                        <Button
                            onClick={() => {
                                form.onSubmit((data) => handleSubmit(data))();
                            }}
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
