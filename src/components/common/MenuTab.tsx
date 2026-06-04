"use client";
import { Tabs } from "@mantine/core";
import { IconCalendar, IconDog, IconHome, IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import classes from "../components/css/MenuTab.module.css";

export default function MenuTab() {
    const router = useRouter();
    const path = usePathname();
    return (
        <>
            <Tabs
                value={path}
                variant="unstyled"
                // variant="pills"
                onChange={(value) => router.push(`${value}`)}
                classNames={classes}
            >
                <Tabs.List grow className="h-full">
                    <Tabs.Tab
                        value="/v1/dashboard"
                        leftSection={<IconHome size={20} />}
                    >
                        Dashboard
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="/v1/pets"
                        leftSection={<IconDog size={20} />}
                    >
                        Pets
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="/v1/appointment"
                        leftSection={<IconCalendar size={20} />}
                    >
                        Appointment
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="/v1/appointment"
                        leftSection={<IconUser size={20} />}
                    >
                        Profile
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </>
    );
}
