"use client";

import {
    Stepper,
    TextInput,
    Button,
    Modal,
    Box,
    NativeSelect,
    em,
    Text,
    Alert,
    MultiSelect,
    Group,
    Avatar,
    Title,
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
    IconChevronLeft,
    IconInfoCircle,
    IconInfoTriangle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/lib/toTitleCase";
import SuccessModal from "../common/SuccessModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
    AppointmentSchedulesTypeModel,
    appointmentTypeValues,
} from "@/db/schema/appointments";
import CreateAppointmentAction from "@/actions/createAppointment";
import { notifications } from "@mantine/notifications";
import Tips from "../common/Tips";
import { TIPS } from "@/lib/tips";
import Link from "next/link";
import PopoverViewSchedule from "../common/PopoverViewSchedule";

type Target = Record<
    string,
    { photoUrl: string | null; id: string; breed: string; name: string }
>;

type Props = {
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        breed: string;
    }[];
    schedules: AppointmentSchedulesTypeModel[] | null;
};

export default function AppointmentStepper({ pets = [], schedules }: Props) {
    const converted: Target = pets.reduce((acc, item) => {
        acc[item.id] = {
            id: item.id,
            photoUrl: item.photoUrl ?? null,
            breed: item.breed,
            name: item.name,
        };
        return acc;
    }, {} as Target);

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [active, setActive] = useState(0);
    const router = useRouter();
    const successTimeOut = 4000;

    const [
        isOpenedSuccessModal,
        { open: openSuccessModal, close: closeSuccessModal },
    ] = useDisclosure(false);

    const [
        isOpenConfirmDialog,
        { open: openConfirmDialog, close: closeConfirmDialog },
    ] = useDisclosure(false);

    const [
        openedNoPetsAlert,
        { open: openNoPetsAlert, close: closeNoPetsAlert },
    ] = useDisclosure(pets.length <= 0);

    const createAppointment = CreateAppointmentAction.bind(null);

    const [formState, formAction] = useActionState(createAppointment, {
        succesful: false,
    });

    const [isPending, startTransition] = useTransition();

    const form = useForm<AppointmentFormInput>({
        initialValues: {
            title: "",
            type: "",
            petIds: [],
            date: "",
            event_datetime: "",
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: zod4Resolver(newAppointmentSchema),
    });

    const getStepFields = (step: number) => {
        switch (step) {
            case 0:
                return ["title", "type", "petIds"];
            case 1:
                return ["date"];
            case 2:
                return ["event_datetime"];
            default:
                return [];
        }
    };

    const nextStep = () => {
        // 2. Validate all fields
        const validation = form.validate();

        // 3. Check if the fields in the CURRENT step have errors
        const currentStepFields = getStepFields(active);
        const hasErrorsInCurrentStep = currentStepFields.some(
            (field) => validation.errors[field]
        );

        if (!hasErrorsInCurrentStep) {
            setActive((current) => (current < 3 ? current + 1 : current));
        }
        console.log(form.values);
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
        if (pets.length <= 0) openNoPetsAlert();
        else closeNoPetsAlert();
    };

    useEffect(() => {
        if (formState?.succesful && formState.appointmentId) {
            openSuccessModal();

            setTimeout(() => {
                router.replace(`/v1/appointments/${formState.appointmentId}`);
            }, successTimeOut);
        }

        if (!formState.succesful && formState.debug) {
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
                                label="Title"
                                withAsterisk
                                name="title"
                                placeholder="Ara's Gala"
                                {...form.getInputProps("title")}
                            />
                            <NativeSelect
                                label="Type"
                                {...form.getInputProps("type")}
                                withAsterisk
                                data={[{ label: "", value: "" }].concat(
                                    appointmentTypeValues.map((v) => ({
                                        label: toTitleCase(v),
                                        value: v,
                                    }))
                                )}
                            />

                            <MultiSelect
                                label="Pet"
                                name="pet"
                                withAsterisk
                                {...form.getInputProps("petIds")}
                                data={pets.map((v) => ({
                                    label: toTitleCase(v.name),
                                    value: v.id,
                                }))}
                                searchable
                                renderOption={({ option }) => (
                                    <Group gap="sm">
                                        <Avatar
                                            src={
                                                converted[option.value]
                                                    ?.photoUrl ?? null
                                            }
                                            size={36}
                                            radius="xl"
                                        >
                                            {option.label[0]}
                                        </Avatar>
                                        <div>
                                            <Text size="sm">
                                                {option.label}
                                            </Text>
                                            <Text size="xs" c={"dimmed"}>
                                                {toTitleCase(
                                                    converted[option.value]
                                                        .breed
                                                )}
                                            </Text>
                                        </div>
                                    </Group>
                                )}
                            />
                            <div className="w-full flex justify-end">
                                <Button
                                    onClick={() => {
                                        checkPets();
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

                {active === 1 &&
                    form.values.type &&
                    schedules &&
                    schedules.length && (
                        <section className="w-full h-full gap-4 flex flex-col  justify-between max-w-7xl">
                            <SelectDateCal
                                schedules={schedules}
                                type={form.values.type}
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
                        <div className="text-center w-full flex items-center justify-center flex-col gap-3 h-full row-start-2 col-start-2">
                            <div className="max-w-md w-full  border-b border-gray-200 items-start flex flex-col">
                                <Text c={"dimmed"} size="xs">
                                    Title
                                </Text>
                                <Text ml={"xs"}>
                                    {toTitleCase(form.values.title)}
                                </Text>
                            </div>
                            <div className="max-w-md w-full  border-b border-gray-200 items-start flex flex-col">
                                <Text c={"dimmed"} size="xs">
                                    Type
                                </Text>
                                <Text ml={"xs"}>
                                    {toTitleCase(form.values.type)}
                                </Text>
                            </div>
                            <div className="max-w-md w-full  border-b border-gray-200 items-start flex flex-col">
                                <Text c={"dimmed"} size="xs">
                                    Pet
                                </Text>
                                <Text ml={"xs"}>
                                    {form.values.petIds
                                        .map((v) => {
                                            return toTitleCase(
                                                converted[v].name
                                            );
                                        })
                                        .join(", ")}
                                </Text>
                            </div>
                            <div className="max-w-md w-full  border-b border-gray-200 items-start flex flex-col">
                                <Text c={"dimmed"} size="xs">
                                    Date
                                </Text>
                                <Text ml={"xs"}>
                                    {new Date(
                                        form.values.event_datetime
                                    ).toDateString()}{" "}
                                    {new Date(
                                        form.values.event_datetime
                                    ).toLocaleTimeString()}
                                </Text>
                            </div>
                            <div className="flex mt-2 justify-center gap-8  col-start-2 row-start-3">
                                <div>
                                    <Button
                                        onClick={openConfirmDialog}
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
                                <SuccessModal
                                    opened={isOpenedSuccessModal}
                                    onClose={closeSuccessModal}
                                    timeOut={successTimeOut}
                                    title="Appointment Saved"
                                />
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

            <Modal
                opened={isOpenConfirmDialog}
                centered
                onClose={closeConfirmDialog}
                withCloseButton={false}
                size={"lg"}
            >
                <Box className="flex flex-col gap-6 p-4">
                    <span>
                        <h1 className="text-3xl">
                            Confirm Your Appointment Details?
                        </h1>
                        <h1>
                            Please carefully review the following details before
                            you confirm.
                        </h1>
                    </span>
                    <span className="grid grid-cols-[1fr_9fr]  ">
                        <h1 className="text-xl col-span-2">
                            {toTitleCase(form.values.title)}
                        </h1>
                        <h1 className="text-lg">Service:</h1>
                        <h1 className="text-lg ml-8">
                            {toTitleCase(form.values.type)}
                        </h1>

                        <h1 className="text-lg">Date:</h1>
                        <h1 className="text-lg ml-8">
                            {new Date(
                                form.values.event_datetime
                            ).toDateString()}{" "}
                        </h1>
                        <h1 className="text-lg">Time:</h1>
                        <h1 className="text-lg ml-8">
                            {new Date(
                                form.values.event_datetime
                            ).toLocaleTimeString()}
                        </h1>
                    </span>
                    <span className="w-full flex justify-end gap-4">
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={closeConfirmDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("is valid:", form.errors);
                                // hit the form action
                                form.onSubmit((v) => handleSubmit(v))();
                            }}
                        >
                            Confirm
                        </Button>
                    </span>
                </Box>
            </Modal>

            <Modal
                onClose={closeNoPetsAlert}
                opened={openedNoPetsAlert}
                centered
                withCloseButton={false}
                size={"lg"}
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
                        <Button variant="default" onClick={closeNoPetsAlert}>
                            Not now
                        </Button>
                        <Button component={Link} href={"/v1/pets/new"}>
                            Add a pet
                        </Button>
                    </Group>
                </Box>
            </Modal>
        </>
    );
}
