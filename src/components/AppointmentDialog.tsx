"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { appointmentTypeValues } from "@/db/schema/appointments";
import AppoinmentComboBox from "./AppointmentCombobox";

export default function AppointmentDialog() {
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);
    const [type, setType] = useState<
        (typeof appointmentTypeValues)[number] | ""
    >("");
    const onReset = () => {
        setType("");
        (
            document.getElementById("AppointmentNameInput") as HTMLInputElement
        ).value = "";
    };
    return (
        <>
            <Modal
                title="Appointment"
                centered
                opened={opened}
                onClose={close}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <div className="flex gap-4 flex-col">
                    <TextInput
                        id="AppointmentNameInput"
                        label="name"
                        placeholder="Jin's Gala"
                    />
                    <AppoinmentComboBox value={type} setValue={setType} />
                    <div className="mt-8 w-full grid grid-cols-[1fr_auto] gap-2">
                        <Button>Next</Button>
                        <Button variant="light" color="red" onClick={onReset}>
                            Reset
                        </Button>
                    </div>
                </div>
            </Modal>
            <Button onClick={open}>Create New</Button>
        </>
    );
}
