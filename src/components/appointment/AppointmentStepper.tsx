"use client";

import successAnim from "@/../public/lottie/Success-Animation.json";
import {
    Stepper,
    TextInput,
    Button,
    Modal,
    Box,
    em,
    Text,
    Alert,
    Group,
    Title,
    useModalsStack,
    Accordion,
    Stack,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, useEffect, useState, useTransition } from "react";
import SelectDateCal from "../calendars/SelectDateCal";
import SelectTimeCal from "../calendars/SelectTimeCal";
import {
    AppointmentFormInput,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";

import {
    IconArrowRightDashed,
    IconChevronLeft,
    IconInfoCircle,
    IconInfoTriangle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/lib/toTitleCase";
import SuccessModal from "../common/SuccessModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { AppointmentSchedulesTypeModel } from "@/db/schema/appointments";
import CreateAppointmentAction from "@/actions/createAppointment";
import { notifications } from "@mantine/notifications";
import Tips from "../common/Tips";
import { TIPS } from "@/lib/tips";
import Link from "next/link";
import PopoverViewSchedule from "../common/PopoverViewSchedule";
import { ServiceMergePriceType } from "@/db/schema/services";
import PetAccordionItem from "./PetAccordionItem";
import { useAppointment } from "@/lib/hooks/useAppointmentContext";

type Props = {
    pets: {
        id: string;
        name: string;
        species: "dog" | "cat";
        photoUrl: string | null;
        breed: string;
        weight: number | null;
    }[];
    schedules: AppointmentSchedulesTypeModel[] | null;
    services: ServiceMergePriceType[];
};

export default function AppointmentStepper({
    pets = [],
    schedules,
    services,
}: Props) {
    const { selections, clearAll } = useAppointment();

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [active, setActive] = useState(0);
    const router = useRouter();
    const successTimeOut = 4000;
    const stack = useModalsStack(["confirm-modal", "no-pets-alert-modal"]);

    const [
        isOpenedSuccessModal,
        { open: openSuccessModal, close: closeSuccessModal },
    ] = useDisclosure(false);

    const createAppointment = CreateAppointmentAction.bind(null);

    const [formState, formAction] = useActionState(createAppointment, {
        successful: false,
    });

    const [isPending, startTransition] = useTransition();

    const form = useForm<AppointmentFormInput>({
        initialValues: {
            title: "",
            selections: {},
            date: "",
            event_datetime: "",
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: zod4Resolver(newAppointmentSchema),
    });

    const nextStep = () => {
        setActive((current) => (current < 3 ? current + 1 : current));
    };

    const handleStepClick = (index: number) => {
        if (index > active) return;
        setActive(index);
    };

    const handleSubmit = async (value: AppointmentFormInput) => {
        if (isPending) return;

        startTransition(() => {
            formAction(value);
        });
    };

    const checkPets = () => {
        if (pets.length <= 0) stack.open("no-pets-alert-modal");
        else stack.close("no-pets-alert-modal");
    };

    useEffect(() => {
        form.setFieldValue("selections", selections);
    }, [selections]);

    useEffect(() => {
        if (formState.successful && formState.appointmentId) {
            stack.close("confirm-modal");
            openSuccessModal();

            setTimeout(() => {
                router.replace(`/v1/appointments/${formState.appointmentId}`);
            }, successTimeOut);
        }

        if (!formState.successful && formState.debug) {
            stack.close("confirm-modal");
            notifications.show({
                title: `Error code: ${formState.debug.code}`,
                message: `${formState.debug.message}`,
                color: "orange",
                icon: <IconInfoTriangle size={24} />,
                withBorder: true,
                autoClose: false,
            });
        }
    }, [formState]);

    useEffect(() => {
        checkPets();
    }, [pets]);

    return (
        <>
            <div>
                <Button variant="transparent" onClick={() => router.back()}>
                    <IconChevronLeft />
                </Button>
            </div>

            <div className="w-full h-full flex items-center flex-col">
                <Stepper
                    active={active}
                    onStepClick={handleStepClick}
                    size={isMobile ? "md" : "lg"}
                    orientation={isMobile ? "vertical" : "horizontal"}
                    className="h-min  w-full max-w-7xl "
                >
                    <Stepper.Step label="Step 1" description="Set details" />
                    <Stepper.Step
                        label="Step 2"
                        description="Pick an appointment date"
                    />
                    <Stepper.Step
                        label="Step 3"
                        description="Select specific time"
                    />
                    <Stepper.Completed>
                        <></>
                    </Stepper.Completed>
                </Stepper>
            </div>

            <form className="w-full h-full flex items-center flex-col">
                {active === 0 && (
                    <section className="w-full h-full items-center   flex flex-col justify-between max-w-7xl">
                        <div className="w-full justify-center  gap-8 flex h-full flex-col max-w-md">
                            <TextInput
                                label="Title / Reason:"
                                withAsterisk
                                name="title"
                                {...form.getInputProps("title")}
                            />

                            <Accordion
                                className="gap-4 flex  flex-col"
                            >
                                {pets.map((pet) => (
                                    <PetAccordionItem
                                        key={pet.id}
                                        pet={pet}
                                        services={services}
                                    />
                                ))}
                            </Accordion>
                            <div className="w-full flex justify-between">
                                <Button
                                    variant="light"
                                    disabled={!form.isDirty()}
                                    color="red"
                                    onClick={() => {
                                        form.reset();
                                        clearAll();
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    disabled={
                                        form.values.title.trim().length === 0 ||
                                        Object.keys(form.values.selections)
                                            .length === 0
                                    }
                                    onClick={() => {
                                        nextStep();
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                        <Tips
                            w={"100%"}
                            variant="light"
                            color="gray"
                            title="Advisory Tip"
                            message={TIPS.appointment.type}
                        />
                    </section>
                )}

                {active === 1 && schedules && schedules.length && (
                    <section className="w-full h-full gap-4 flex flex-col  justify-between max-w-7xl">
                        <SelectDateCal
                            {...form.getInputProps("date")}
                            onChange={(date: string) => {
                                form.setFieldValue("date", date);
                                nextStep();
                            }}
                        >
                            <PopoverViewSchedule
                                isMobile={isMobile}
                                schedules={schedules}
                                position="bottom-end"
                            />
                        </SelectDateCal>
                        <Tips
                            variant="light"
                            color="gray"
                            title="Advisory Tip"
                            message={TIPS.appointment.date}
                        />
                    </section>
                )}

                {active === 2 && (
                    <section className="w-full h-full flex flex-col justify-between max-w-7xl">
                        <SelectTimeCal
                            initialDate={form.values.date}
                            value={form.values.event_datetime}
                            {...form.getInputProps("event_datetime")}
                            onChange={(time: string) => {
                                form.setFieldValue("event_datetime", time);
                                nextStep();
                            }}
                        />
                        <Tips
                            variant="light"
                            color="gray"
                            title="Advisory Tip"
                            message={TIPS.appointment.time}
                        />
                    </section>
                )}

                {active === 3 && (
                    <section className=" w-full max-w-7xl  flex items-center justify-center h-full flex-col">
                        <div className="text-center w-full flex items-center justify-center flex-col gap-3 h-full ">
                            <div className="flex gap-8 max-w-md w-full flex-col">
                                <Stack align="flex-start" w={"100%"} gap={"xs"}>
                                    <Text c={"dimmed"} size="sm">
                                        Title / Reason
                                    </Text>
                                    <Group
                                        w={"100%"}
                                        className="shadow rounded p-4 bg-white outline"
                                    >
                                        <Text>
                                            {toTitleCase(form.values.title)}
                                        </Text>
                                    </Group>
                                </Stack>

                                <Stack align="flex-start" w={"100%"} gap={"xs"}>
                                    <Text c={"dimmed"} size="sm">
                                        Pets & Service
                                    </Text>
                                    {Object.values(form.values.selections)
                                        .flat()
                                        .map((value) => (
                                            <Group
                                                w={"100%"}
                                                key={`${value.name}-${value.id}`}
                                                className="shadow rounded p-4 bg-white outline"
                                            >
                                                <Text>
                                                    {toTitleCase(value.name)}
                                                </Text>
                                                <IconArrowRightDashed
                                                    stroke={1.5}
                                                />
                                                <Text>
                                                    {toTitleCase(value.title)}
                                                </Text>
                                            </Group>
                                        ))}
                                </Stack>
                                <Stack align="flex-start" w={"100%"} gap={"xs"}>
                                    <Text c={"dimmed"} size="sm">
                                        Date
                                    </Text>
                                    <Group
                                        w={"100%"}
                                        className="shadow rounded p-4 bg-white outline"
                                    >
                                        <Text ml={"xs"}>
                                            {new Date(
                                                form.values.event_datetime
                                            ).toDateString()}{" "}
                                            {new Date(
                                                form.values.event_datetime
                                            ).toLocaleTimeString()}
                                        </Text>
                                    </Group>
                                </Stack>
                            </div>

                            <div className="flex mt-2 justify-center gap-8  col-start-2 row-start-3">
                                <div>
                                    <Button
                                        onClick={() => {
                                            stack.open("confirm-modal");
                                        }}
                                        disabled={!form.isValid()}
                                    >
                                        Save
                                    </Button>

                                    <div className="flex   border-t text-sm  row-start-5 gap-1 items-center col-start-2">
                                        <h1 className="">Your mind changes?</h1>
                                        <button
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => {
                                                form.reset();
                                                setActive(0);
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex-1 mt-2 ">
                            <Alert
                                variant="light"
                                color="gray"
                                title="Advisory Tip"
                                icon={<IconInfoCircle />}
                            >
                                Please verify your details before submitting.
                                Once confirmed, this slot will be reserved for
                                you. If everything looks good, click Confirm to
                                finalize your appointment!
                            </Alert>
                        </div>
                    </section>
                )}
            </form>

            <SuccessModal
                animData={successAnim}
                opened={isOpenedSuccessModal}
                onClose={closeSuccessModal}
                timeOut={successTimeOut}
                title="Appointment Saved"
            />
            <Modal.Stack>
                <Modal
                    {...stack.register("confirm-modal")}
                    centered
                    title="Appointment confirmation"
                    size={"lg"}
                    radius={"lg"}
                >
                    <Box className="flex flex-col gap-6 p-4">
                        <Text size="sm">
                            Are you really sure about this appointment?
                        </Text>
                        <span className="w-full flex justify-end gap-4">
                            <Button
                                variant="default"
                                color="gray"
                                onClick={() => {
                                    stack.close("confirm-modal");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    form.onSubmit((v) => handleSubmit(v))();
                                }}
                                loading={isPending}
                            >
                                Confirm
                            </Button>
                        </span>
                    </Box>
                </Modal>

                <Modal
                    {...stack.register("no-pets-alert-modal")}
                    centered
                    withCloseButton={false}
                    size={"lg"}
                    radius={"lg"}
                >
                    <Box className="flex flex-col gap-6 p-4">
                        <Box>
                            <Title order={2}>No pets found</Title>
                            <Text>
                                A pet profile is required to schedule an
                                appointment. Would you like to add one now?
                            </Text>
                        </Box>
                        <Group justify="right">
                            <Button
                                variant="default"
                                onClick={() => {
                                    stack.close("no-pets-alert-modal");
                                }}
                            >
                                Not now
                            </Button>
                            <Button component={Link} href={"/v1/pets/new"}>
                                Add a pet
                            </Button>
                        </Group>
                    </Box>
                </Modal>
            </Modal.Stack>
        </>
    );
}
