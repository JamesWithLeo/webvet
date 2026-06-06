import CenterPattern from "@/components/common/CenterPattern";
import LogoWithText from "@/components/common/LogoWithText";
import { Button, Paper, Text, Title } from "@mantine/core";
const heart = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="#000000"
        stroke="#14678f"
        viewBox="0 0 256 256"
    >
        <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
    </svg>
);
const stress = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="#000000"
        stroke="#14678f"
        viewBox="0 0 256 256"
    >
        <path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.54A96.3,96.3,0,0,1,24,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM200,96H40v40a80.27,80.27,0,0,0,45.12,72h69.76A80.27,80.27,0,0,0,200,136Zm32,24a24,24,0,0,0-16-22.62V136a95.78,95.78,0,0,1-1.2,15A24,24,0,0,0,232,128Z"></path>
    </svg>
);
const care = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="#000000"
        stroke="#14678f"
        viewBox="0 0 256 256"
    >
        <path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"></path>
    </svg>
);
export default function Page() {
    return (
        <div className="h-full  items-center justify-between flex-col min-h-dvh md:px-16 px-8 py-8 pb-16  w-full flex">
            <CenterPattern />
            <div className="flex flex-col  h-220 justify-center items-center gap-16 max-w-4xl">
                <LogoWithText href="/" />
                <Text
                    fz={{ xs: "md", sm: "xl" }}
                    ta={"center"}
                    ff={"monospace"}
                    fs={"italic"}
                >
                    At Joseph & Mary Veterinary Clinic, we prioritize heart over
                    transactions. We’ve created a sanctuary for our community
                    where every pet is treated like family. Our mission is
                    simple: providing compassionate, expert care for your pets
                    and total peace of mind for you.
                </Text>
            </div>

            <div className=" flex flex-col w-full gap-16 mb-36 max-w-7xl">
                <Title order={2} ta={"center"} fw={"500"}>
                    What Makes Us Different:
                </Title>
                <div className="flex max-w-7xl  w-full gap-8 flex-col sm:flex-row  ">
                    <Paper withBorder p={"xl"} w="100%">
                        {heart()}
                        <Text c={"primary"} mt={"sm"} fw={"600"} size="lg">
                            Family First
                        </Text>
                        <Text>We treat your pets like our own.</Text>
                    </Paper>
                    <Paper withBorder p={"xl"} w="100%">
                        {stress()}
                        <Text c={"primary"} mt={"sm"} fw={"600"} size="lg">
                            Stress Free Visits
                        </Text>
                        <Text>A calm environment for happy tails.</Text>
                    </Paper>
                    <Paper withBorder p={"xl"} w="100%">
                        {care()}
                        <Text c={"primary"} mt={"sm"} fw={"600"} size="lg">
                            Expert Care
                        </Text>
                        <Text>A calm environment for happy tails.</Text>
                    </Paper>
                </div>
            </div>
            <div className="max-w-4xl gap-4 flex flex-col">
                <div className="flex gap-4 items-center justify-center w-full ">
                    <Text>Ready to join the Joseph & Mary family?</Text>
                    <Button
                        size="sm"
                        variant="gradient"
                        component={"a"}
                        href="/v1/appointments/new"
                    >
                        Book an Appointment
                    </Button>
                </div>
            </div>
        </div>
    );
}
