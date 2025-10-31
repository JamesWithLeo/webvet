"use client";

import { Stepper, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import AppoinmentComboBox from "./AppointmentCombobox";
import SelectDateCal from "./Calendars/SelectDateCal";
import SelectTimeCal from "./Calendars/SelectTimeCal";
import { newAppointmentSchema } from "@/lib/validators/newAppointmentSchema";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const STEP_FIELDS: Record<
    number,
    ("title" | "type" | "selectedDate" | "selectedDateTime")[]
> = {
    0: ["title", "type"],
    1: ["selectedDate"],
    2: ["selectedDateTime"],
};

export default function AppointmentStepper() {
    const [active, setActive] = useState(0);
    const router = useRouter();

    const form = useForm({
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
                {active === 1 && (
                    <section className="w-full h-full max-w-7xl">
                        <SelectDateCal
                            value={form.values.selectedDate}
                            {...form.getInputProps("selectedDate")}
                            onChange={(date: string) => {
                                form.setFieldValue("selectedDate", date);
                                nextStep();
                            }}
                        />
                        <h1 className="text-lg">
                            Tip: Click on date to Select
                        </h1>
                    </section>
                )}
                {active === 2 && (
                    <section className="w-full h-full max-w-7xl">
                        <SelectTimeCal
                            initialDate={form.values.selectedDate}
                            value={form.values.selectedDateTime}
                            {...form.getInputProps("selectedDateTime")}
                            onChange={(time: string) => {
                                form.setFieldValue("selectedDateTime", time);
                                nextStep();
                            }}
                        />
                    </section>
                )}
                {active === 3 && (
                    <section className=" w-full  flex items-center justify-center h-full flex-col">
                        <h1>{form.values.title}</h1>
                        <h1>{form.values.type}</h1>
                        <h1>
                            {new Date(
                                form.values.selectedDateTime
                            ).toLocaleString()}
                        </h1>
                    </section>
                )}
            </div>

            {/* <div className="w-full flex items-center flex-col">
                {active !== 0 && (
                    <Button onClick={prevStep} variant="transparent">
                        <IconCircleArrowLeftFilled size={42} />
                    </Button>
                )}
            </div> */}
        </>
    );
}
