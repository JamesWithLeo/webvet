import { CreateService } from "@/actions/Service";
import { appointmentTypeValues } from "@/db/schema/appointments";
import { speciesConst } from "@/db/schema/pets";
import { useCreateService } from "@/lib/hooks/useService";
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
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { startTransition, useState } from "react";

export default function AddServiceModal({
    opened,
    close,
}: {
    opened: boolean;
    close: () => void;
}) {
    const [isFlat, setIsFlat] = useState<boolean>(true);
    const { mutate: createService, isPending } = useCreateService();

    const form = useForm<ServiceFormInput>({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            species: "",
            description: "",
            type: "",
            reminder: "",
            inclusions: [],
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
        const {
            title,
            species,
            description,
            reminder,
            type,
            inclusions,
            isFlat,
            flat,
            small,
            medium,
            large,
        } = value;
        const payload = {
            serviceData: {
                title: title,
                description: description,
                reminder: reminder,
                type: type,
                inclusions: inclusions,
                species: species,
                isFlat: isFlat,
            },
            initailPrice: {
                flat: flat,
                small: small,
                medium: medium,
                large: large,
            },
        };
        startTransition(() => {
            createService(payload, {
                onSuccess: () => {
                    notifications.show({
                        title: `Service Saved!`,
                        message:
                            "The service is now active and visible to clients.",
                        color: "teal",
                        icon: <IconCheck size={20} />,
                    });
                    close();
                },
                onError: (error) => {
                    notifications.show({
                        title: `Service not saved`,
                        message: error.message,
                        color: "red",
                        icon: <IconX size={20} />,
                    });
                    close();
                },
            });
        });
    };

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
                        label="Species"
                        withAsterisk
                        {...form.getInputProps("")}
                        data={[{ label: "", value: "" }].concat(
                            speciesConst.map((v) => ({
                                label: toTitleCase(v),
                                value: v,
                            }))
                        )}
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
                        label="Gap in days"
                        withAsterisk
                        // {...form.getInputProps("description")}
                    />
                    <TextInput label="Annual Interval" withAsterisk />

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
                            form.setFieldValue("isFlat", checked);
                            if (checked) {
                                form.setFieldValue("small", "");
                                form.setFieldValue("medium", "");
                                form.setFieldValue("large", "");
                                form.clearFieldError("small");
                                form.clearFieldError("medium");
                                form.clearFieldError("large");
                            } else {
                                form.setFieldValue("flat", "");
                                form.clearFieldError("flat");
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
