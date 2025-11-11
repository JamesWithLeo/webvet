"use client";

import { Stepper, TextInput, Button, Divider, Modal, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import AppoinmentComboBox from "./AppointmentCombobox";
import SelectDateCal from "./calendars/SelectDateCal";
import SelectTimeCal from "./calendars/SelectTimeCal";
import { newAppointmentSchema } from "@/lib/validators/newAppointmentSchema";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { appointmentTypeValues } from "@/db/schema/appointments";
import z from "zod";
import { toTitleCase } from "@/lib/toTitleCase";
import SuccessModal from "./SuccessModal";
import { useDisclosure } from "@mantine/hooks";

const STEP_FIELDS: Record<
    number,
    ("title" | "type" | "selectedDate" | "selectedDateTime")[]
> = {
    0: ["title", "type"],
    1: ["selectedDate"],
    2: ["selectedDateTime"],
};

type IAppointmentFormValues = z.infer<typeof newAppointmentSchema>;
export default function AppointmentStepper() {
    const [active, setActive] = useState(0);
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);
    const [
        isOpenConfirmDialog,
        { open: openConfirmDialog, close: closeConfirmDialog },
    ] = useDisclosure(false);

    const form = useForm<IAppointmentFormValues>({
        initialValues: {
            title: "",
            type: "",
            selectedDate: "",
            selectedDateTime: "",
        },

        validate: zod4Resolver(newAppointmentSchema),
    });

    const nextStep = () => {
        const fieldsToValidate =
            STEP_FIELDS[active as keyof typeof STEP_FIELDS];

        if (fieldsToValidate) {
            // 1. Initialize a flag to track validation success.
            let allFieldsValid = true;

            // 2. Iterate over the fields for the current step.
            for (const fieldKey of fieldsToValidate) {
                const validationResult = form.validateField(fieldKey);

                // If any field returns an error, set the flag to false.
                if (validationResult.hasError) {
                    allFieldsValid = false;
                    // Break early if we find an error, no need to check the rest.
                    break;
                }
            }

            // 3. Proceed only if all fields passed validation.
            if (allFieldsValid) {
                setActive((current) => (current < 3 ? current + 1 : current));
            }
        } else if (active === 3) {
            console.log("Form Completed and ready to submit:", form.values);
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
                    size="lg"
                    className="h-min  w-full max-w-7xl "
                >
                    <Stepper.Step
                        label="Step 1"
                        description="Set title & appointmet type"
                    />
                    <Stepper.Step
                        label="Step 2"
                        description="Pick an appointment date"
                    />
                    <Stepper.Step
                        label="Step 1"
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
                                name="title"
                                placeholder="Jin's Gala"
                                {...form.getInputProps("title")}
                            />
                            <AppoinmentComboBox
                                label="Type"
                                value={form.values.type}
                                {...form.getInputProps("type")}
                            />

                            <div className="w-full flex justify-end">
                                <Button onClick={nextStep}>Next</Button>
                            </div>
                        </div>
                    </section>
                )}
                {active === 1 && form.values.type !== "" && (
                    <section className="w-full h-full flex flex-col justify-between max-w-7xl">
                        <SelectDateCal
                            value={form.values.selectedDate}
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
                        <Button onClick={open}>Confirm</Button>
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={closeConfirmDialog}
                        >
                            Cancel
                        </Button>
                    </span>
                </Box>
            </Modal>
        </>
    );
}
