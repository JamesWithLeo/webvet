"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { appointmentTypeValues } from "@/db/schema/appointments";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentDialog() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>New appointment</Button>
            </DialogTrigger>
            <DialogContent className="w-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        Set an Appoinment
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 flex-col">
                    <Label htmlFor="name" className="text-sm">
                        Name
                    </Label>
                    <Input
                        placeholder="Gin's check"
                        id="name"
                        className="w-80"
                    />
                    <Label htmlFor="type" className="text-sm">
                        Type
                    </Label>
                    <Select
                        onValueChange={(newValue) => {
                            setSelectedType(newValue);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypeValues.map((value) => {
                                return (
                                    <SelectItem key={value} value={value}>
                                        {value
                                            .replaceAll("_", " ")
                                            .toLocaleUpperCase()}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="default"
                            onClick={() => {
                                const name = (
                                    document.getElementById(
                                        "name"
                                    ) as HTMLInputElement
                                ).value
                                    .trim()
                                    .replaceAll(" ", "-");

                                if (!name || !selectedType) {
                                    alert(
                                        "Please enter a name and select a type."
                                    );
                                    return;
                                }
                                router.push(
                                    `appointments/${encodeURIComponent(name)}/${encodeURIComponent(selectedType.toLocaleLowerCase().replaceAll("_", "-"))}/date`
                                );
                            }}
                        >
                            Next
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
