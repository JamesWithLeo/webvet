import AppointmentStepper from "@/components/AppointmentStepper";

export default async function AppointmentPage() {
    return (
        <>
            <div className="flex  gap-8 flex-col    items-center pt-16  h-full min-h-dvh md:px-16 px-4">
                <AppointmentStepper />
            </div>
        </>
    );
}
