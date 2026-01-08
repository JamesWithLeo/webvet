"use client";

import {
    Stepper,
    TextInput,
    Button,
    Modal,
    Box,
    NativeSelect,
    em,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import SelectDateCal from "./calendars/SelectDateCal";
import SelectTimeCal from "./calendars/SelectTimeCal";
import {
    AppointmentFormInput,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import z, { map } from "zod";
import { toTitleCase } from "@/lib/toTitleCase";
import SuccessModal from "./SuccessModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { appointmentTypeValues } from "@/db/schema/appointments";

type Props = {
    pets: { id: string; name: string }[];
};

export default function AppointmentStepper({ pets = [] }: Props) {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [active, setActive] = useState(0);
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);
    const [
        isOpenConfirmDialog,
        { open: openConfirmDialog, close: closeConfirmDialog },
    ] = useDisclosure(false);

    const form = useForm<AppointmentFormInput>({
        initialValues: {
            title: "",
            type: "",
            pet: "",
            selectedDate: "",
            selectedDateTime: "",
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: zod4Resolver(newAppointmentSchema),
    });
    const getStepFields = (step: number) => {
        switch (step) {
            case 0:
                return ["title", "type", "pet"];
            case 1:
                return ["selectedDate"];
            case 2:
                return ["selectedDateTime"];
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

            <div className="w-full h-full flex items-center flex-col">
                {active === 0 && (
                    <section className=" w-full  flex items-center justify-center h-full flex-col">
                        <div className="w-full justify-center gap-8 flex h-full flex-col max-w-md">
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

                            <NativeSelect
                                label="Pet"
                                name="pet"
                                withAsterisk
                                {...form.getInputProps("pet")}
                                data={[{ label: "", value: "" }].concat(
                                    pets.map((v) => ({
                                        label: toTitleCase(v.name),
                                        value: v.id,
                                    }))
                                )}
                            />
                            <div className="w-full flex justify-end">
                                <Button onClick={nextStep}>Next</Button>
                            </div>
                        </div>
                    </section>
                )}
                {active === 1 && form.values.type && (
                    <section className="w-full h-full flex flex-col justify-between max-w-7xl">
                        <SelectDateCal
                            type={form.values.type}
                            {...form.getInputProps("selectedDate")}
                            onChange={(date: string) => {
                                form.setFieldValue("selectedDate", date);
                                nextStep();
                            }}
                        />
                        <h1 className="text-sm">
                            Tip: Click on date to Select
                        </h1>
                    </section>
                )}
                {active === 2 && (
                    <section className="w-full h-full flex flex-col justify-between max-w-7xl">
                        <SelectTimeCal
                            initialDate={form.values.selectedDate}
                            value={form.values.selectedDateTime}
                            {...form.getInputProps("selectedDateTime")}
                            onChange={(time: string) => {
                                form.setFieldValue("selectedDateTime", time);
                                nextStep();
                            }}
                        />
                        <h1 className="text-sm">
                            Tip: Click on time to Select
                        </h1>
                    </section>
                )}
                {active === 3 && (
                    <section className=" w-full max-w-7xl  flex items-center justify-center h-full flex-col">
                        <div className="text-center w-full flex items-center justify-center flex-col gap-3 h-full row-start-2 col-start-2">
                            <h1 className="text-xl">
                                {toTitleCase(form.values.title)}
                            </h1>
                            <h1 className="text-lg">
                                {toTitleCase(form.values.type)}
                            </h1>
                            <h1 className="text-lg">
                                {new Date(
                                    form.values.selectedDateTime
                                ).toDateString()}{" "}
                                {new Date(
                                    form.values.selectedDateTime
                                ).toLocaleTimeString()}
                            </h1>
                            <div className="flex justify-center gap-8  col-start-2 row-start-3">
                                <Button onClick={openConfirmDialog}>
                                    Save
                                </Button>
                                <SuccessModal
                                    opened={opened}
                                    onClose={close}
                                    timeOut={2500}
                                    title="Appointment Saved"
                                />
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex border-t text-sm  w-full row-start-5 gap-1 items-center col-start-2">
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
                    </section>
                )}
            </div>

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
                                form.values.selectedDateTime
                            ).toDateString()}{" "}
                        </h1>
                        <h1 className="text-lg">Time:</h1>
                        <h1 className="text-lg ml-8">
                            {new Date(
                                form.values.selectedDateTime
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
                        <Button onClick={open}>Confirm</Button>
                    </span>
                </Box>
            </Modal>
        </>
    );
}
