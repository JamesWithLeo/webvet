import { toTitleCase } from "@/lib/toTitleCase";
import {
    serviceVariantFormInput,
    serviceVariantSchema,
} from "@/lib/validators/serviceVariantSchema";
import {
    Button,
    Group,
    Modal,
    NativeSelect,
    Stack,
    Switch,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, startTransition, useEffect } from "react";
import { servicePriceVariant } from "@/db/schema/services";
import { CreateVariant } from "@/actions/variant";

export default function AddVariantModal({
    serviceId,
    opened,
    close,
}: {
    serviceId: string | null;
    opened: boolean;
    close: () => void;
}) {
    const createVariant = CreateVariant.bind(null);
    const formInitialValues: serviceVariantFormInput = {
        variant: "",
        serviceId: "",
        price: "",
        isAvailable: false,
    };

    const [formState, formAction, isPending] = useActionState(createVariant, {
        succesful: false,
    });

    const form = useForm<serviceVariantFormInput>({
        mode: "uncontrolled",
        initialValues: formInitialValues,
        validate: zod4Resolver(serviceVariantSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const handleSubmit = (value: serviceVariantFormInput) => {
        startTransition(() => {
            console.log(value);
            formAction({ ...value });
        });
    };
    useEffect(() => {
        if (serviceId) form.setFieldValue("serviceId", serviceId);
    }, [serviceId]);

    useEffect(() => {
        if (formState.succesful && formState.data) {
            notifications.show({
                title: `New variant is added Saved!`,
                message: "The service is now active and visible to clients.",
                color: "teal",
                icon: <IconCheck size={20} />,
            });
            close();
        }
        if (!formState.succesful && formState.error) {
            notifications.show({
                title: `Variant not saved!`,
                message: formState.error,
                color: "Red",
                icon: <IconX size={20} />,
            });
            close();
        }
    }, [formState]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="New variant"
            withOverlay
            withCloseButton
        >
            <form>
                <Stack>
                    <NativeSelect
                        label="Variant"
                        withAsterisk
                        {...form.getInputProps("variant")}
                        data={[{ label: "", value: "" }].concat(
                            servicePriceVariant.map((v) => ({
                                label: toTitleCase(v),
                                value: v,
                            }))
                        )}
                    />
                    <TextInput
                        label="Price"
                        type="number"
                        withAsterisk
                        description="Actual price (e.g: 400.00, 650)."
                        {...form.getInputProps("price")}
                    />

                    <Switch
                        label="Available?"
                        description="This is to indicate whether the variant is available to the clients"
                        {...form.getInputProps("isAvailable", {
                            type: "checkbox",
                        })}
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
