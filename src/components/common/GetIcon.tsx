"use client";

import { AppointmentType } from "@/db/schema/appointments";
import {
    IconPill,
    IconScissors,
    IconVaccine,
    IconZoomCheck,
} from "@tabler/icons-react";

export default function GetIcon(type: AppointmentType) {
    switch (type) {
        case "CHECK_UP":
            return <IconZoomCheck stroke={1.5} size={16} />;
        case "DEWORMING":
            return <IconPill stroke={1.5} size={16} />;
        case "GROOMING":
            return <IconScissors stroke={1.5} size={16} />;
        case "VACCINATION":
            return <IconVaccine stroke={1.5} size={16} />;
    }
}
