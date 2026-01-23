import CreateService from "@/actions/createService";
import { appointmentTypeValues } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    serviceVariantFormInput,
    ServiceVariantFormOutput,
    serviceVariantSchema,
} from "@/lib/validators/serviceVariantSchema";
import { ServiceFormInput } from "@/lib/validators/serviceZodSchema";
import {
    Button,
    Group,
    Modal,
    NativeSelect,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, startTransition, useEffect } from "react";
import { servicePriceVariant, servicePricesType } from "@/db/schema/services";
import CreateVariant from "@/actions/createVariant";

export default function AddVariantModal({
    serviceId,
    opened,
    close,
}: {
    serviceId: string;
    opened: boolean;
    close: () => void;
}) {
    const createVariant = CreateVariant.bind(null);
    const formInitialValues: serviceVariantFormInput = {
        variant: "",
        price: "",
        isAvailable: true,
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
            formAction({ serviceId: serviceId, variant: value });
        });
    };
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
    }, [formState]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="New variant"
            withOverlay
            withCloseButton
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
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
                        withAsterisk
                        description="Actual price (e.g: 400.00, 650)."
                        {...form.getInputProps("price")}
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
