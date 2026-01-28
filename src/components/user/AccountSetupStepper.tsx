"use client";

import { userGenderValue } from "@/db/schema/users";
import {
    Box,
    TextInput,
    Button,
    Stepper,
    NativeSelect,
    NavLink,
    Modal,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
    useState,
    useRef,
    useActionState,
    useEffect,
    startTransition,
} from "react";
import {
    IconPaw,
    IconChevronRight,
    IconX,
    IconCurrencyPeso,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateUser } from "@/actions/user";
import SuccessModal from "../common/SuccessModal";
import { useSession } from "next-auth/react";
import { useForm } from "@mantine/form";
import {
    userSetupFormInput,
    userSetupSchema,
} from "@/lib/validators/usersZodSchema";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";

export default function AccountStepper({
    currentStep,
}: {
    currentStep: number;
}) {
    const { update, data: session } = useSession();

    const [active, setActive] = useState<number>(currentStep);
    const [isSuccesful, setIsSuccesful] = useState(false);

    const [isOpenModal, { open, close }] = useDisclosure();

    const onSave = () => {
        open();
    };

    const stepperRef = useRef<HTMLDivElement>(null);

    const form = useForm<userSetupFormInput>({
        mode: "uncontrolled",
        validate: zod4Resolver(userSetupSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const createUser = CreateUser.bind(null);

    const [formState, formAction, isPending] = useActionState(createUser, {
        succesful: false,
        user: undefined,
    });

    const handleSubmit = async (data: userSetupFormInput) => {
        startTransition(() => {
            formAction(data);
        });
    };
    useEffect(() => {
        if (formState.succesful && Boolean(formState.user)) {
            update({ ...formState.user })
                .then(() => {
                    close();
                    setIsSuccesful(true);
                })
                .catch(() => {
                    notifications.show({
                        title: "Sorry, Server update failed",
                        message: "Please contact the customer service",
                        icon: <IconX size={20} />,
                        color: "red",
                    });
                });
        }
    }, [formState]);

    return (
        <>
            <form className="w-full items-center  ">
                <Stepper
                    ref={stepperRef}
                    active={active}
                    allowNextStepsSelect={false}
                    size="md"
                >
                    <Stepper.Step
                        label="Set up Account"
                        description={session?.user.email}
                        className=""
                    >
                        <Box className="flex mt-8 gap-4 flex-col">
                            <TextInput
                                name="firstName"
                                withAsterisk
                                label={"First name"}
                                size="md"
                                {...form.getInputProps("firstName")}
                                maxLength={25}
                                variant="filled"
                            />
                            <TextInput
                                name="lastName"
                                label={"Last name"}
                                size="md"
                                {...form.getInputProps("lastName")}
                                maxLength={25}
                                variant="filled"
                                withAsterisk
                            />
                            <div className="flex w-full mt-10 justify-end gap-4">
                                <Button
                                    size="md"
                                    onClick={() => {
                                        const result =
                                            form.validateField("firstName");
                                        const result2 =
                                            form.validateField("lastName");
                                        if (
                                            !result.hasError &&
                                            !result2.hasError
                                        )
                                            setActive((prev) => prev + 1);
                                    }}
                                    variant="light"
                                >
                                    Next
                                </Button>
                            </div>
                        </Box>
                    </Stepper.Step>
                    <Stepper.Step>
                        <Box className="flex mt-8 gap-4 flex-col">
                            <NativeSelect
                                className="w-full"
                                size="md"
                                data={[""].concat(userGenderValue)}
                                multiple={false}
                                label="Gender"
                                variant="filled"
                                withAsterisk
                                {...form.getInputProps("gender")}
                            />

                            <DatePickerInput
                                name="dateOfBirth"
                                size="md"
                                {...form.getInputProps("dateOfBirth")}
                                maxDate={new Date()}
                                className="w-full"
                                label="Date of Birth"
                                variant="filled"
                                withAsterisk
                            />
                            <TextInput
                                {...form.getInputProps("contactNumber")}
                                label="Contact number"
                                className="w-full"
                                variant="filled"
                                withAsterisk
                            />
                            <div className="flex w-full mt-10 justify-end gap-4">
                                <Button
                                    size="md"
                                    onClick={() => {
                                        setActive((prev) => prev - 1);
                                    }}
                                    variant="light"
                                >
                                    Prev
                                </Button>
                                <Button
                                    size="md"
                                    onClick={onSave}
                                    variant="light"
                                >
                                    Save
                                </Button>
                            </div>
                        </Box>
                    </Stepper.Step>

                    <Stepper.Completed>
                        <Box className="flex gap-4 flex-col">
                            <h1>Completed!, Whats your next Step?</h1>
                            <Box className="mx-4 gap-2 flex flex-col">
                                <NavLink
                                    href="/v1/pets/new"
                                    label="Add a pet"
                                    leftSection={<IconPaw stroke={1.5} />}
                                    rightSection={<IconChevronRight />}
                                    variant="subtle"
                                    active
                                />
                                <NavLink
                                    href="/v1/pricing"
                                    label="View service pricing"
                                    leftSection={
                                        <IconCurrencyPeso stroke={1.5} />
                                    }
                                    rightSection={<IconChevronRight />}
                                    variant="subtle"
                                    active
                                />
                            </Box>
                        </Box>
                    </Stepper.Completed>
                </Stepper>
            </form>

            <Modal
                opened={isOpenModal}
                centered
                onClose={close}
                withCloseButton={false}
                size={"lg"}
            >
                <Box className="flex flex-col gap-6 p-4">
                    <span>
                        <h1 className="text-3xl">
                            Save your personal details?
                        </h1>
                        <h1>
                            Your details will be stored safely. You can update
                            them anytime.
                        </h1>
                    </span>
                    <span className="w-full flex justify-end gap-4">
                        <Button
                            disabled={isPending}
                            loading={isPending}
                            onClick={() => {
                                form.onSubmit((e) => handleSubmit(e))();
                            }}
                        >
                            Confirm
                        </Button>
                        <Button variant="subtle" color="gray" onClick={close}>
                            Cancel
                        </Button>
                    </span>
                </Box>
            </Modal>

            {isSuccesful && (
                <SuccessModal
                    opened={isSuccesful}
                    timeOut={3000}
                    onClose={() => {
                        close();
                        setIsSuccesful(false);
                        setActive(2);
                    }}
                    title="Profile Updated"
                    body="Your personal information has been saved successfully."
                />
            )}
        </>
    );
}
