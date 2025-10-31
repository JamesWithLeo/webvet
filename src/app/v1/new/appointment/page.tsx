import AppointmentStepper from "@/components/AppointmentStepper";

export default async function AppointmentPage() {
    return (
        <>
            <div className="grid grid-rows-[auto_auto_8fr_1fr] min-h-screen  grid-cols-1  gap-8  w-full items-center pt-16  h-full md:px-16 px-4">
                <AppointmentStepper />
            </div>
        </>
    );
}
