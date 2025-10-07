"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function ModalConfirmation({
    date,
    time,
    onCancel,
    name,
    type,
}: {
    date: string | null;

    time: string | null;
    onCancel: () => void;
    name: string;
    type: string;
}) {
    if (!date || !time) return null;

    // Format time to 12-hour format
    const formattedTime = new Date(`1970-01-01T${time}:00`).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );

    const onSave = () => {
        console.log(date, time);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

            <div className="fixed inset-0 flex shadow items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        Appointment: {name} {type.replaceAll("_", " ")}
                    </h2>
                    <p className="mb-4">
                        Your selected Date is: {date} at {formattedTime}
                    </p>

                    <div className="flex justify-end gap-4">
                        <Button>Confirm</Button>
                        <Button onClick={onCancel} variant={"secondary"}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
