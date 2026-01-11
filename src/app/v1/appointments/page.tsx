import AppointmentCard from "@/components/appointment/AppointmentCard";
import AppointmentController from "@/components/appointment/AppointmentController";
import { Group, Title } from "@mantine/core";

export default async function AppointmentPage() {
    return (
        <>
            <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
                <div className="min-h-screen w-full relative md:p-16 px-4 flex gap-8 flex-col">
                    <AppointmentController />
                    <Title c={"dimmed"}>
                        {new Date().getFullYear().toString()}
                    </Title>
                    <Group className="">
                        <AppointmentCard
                            name="Ara"
                            service="Vaccination"
                            species="DOG"
                            doctor="Dr. Abe"
                            date={new Date("2025-11-21")}
                        />
                        <AppointmentCard
                            name="Jin"
                            service="Grooming"
                            species="DOG"
                            doctor="Dr. Han"
                            date={new Date("2025-11-10")}
                            paid={true}
                        />
                    </Group>
                    <Title c={"dimmed"}>2025</Title>
                    <AppointmentCard
                        name="Kirby"
                        service="Check up"
                        species="CAT"
                        paid={true}
                        doctor="Dra. Carpio"
                        date={new Date("2024-04-13")}
                    />
                </div>
            </div>
        </>
    );
}
