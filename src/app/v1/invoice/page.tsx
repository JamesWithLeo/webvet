import InvoiceSummaryTable from "@/components/InvoiceSummaryTable";
import InvoiceTable from "@/components/InvoiceTable";
import {
    Stack,
    Anchor,
    Text,
    Title,
    Breadcrumbs,
    Button,
    Group,
    Box,
} from "@mantine/core";

const items = [
    { title: "Appointment", href: "#" },
    { title: "Ara's Grooming", href: "#" },
    { title: "invoice", href: "#" },
].map((item, index) => (
    <Anchor href={item.href} variant="gradient" key={index}>
        {item.title}
    </Anchor>
));
export default function Invoice() {
    return (
        <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
            <div className="min-h-screen w-full relative md:p-16 items-center  px-4 flex gap-8 flex-col">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 0",
                        maskImage: `
          repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
      `,
                        WebkitMaskImage: `
    repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
      `,
                        maskComposite: "intersect",
                        WebkitMaskComposite: "source-in",
                    }}
                />
                <Box w={"100%"}>
                    <Breadcrumbs>{items}</Breadcrumbs>
                </Box>
                <Stack gap={"xl"}>
                    <Group w={"1000"} justify="space-between">
                        <Title c={"primary"}>Invoice</Title>
                        <Button variant="default" disabled>
                            Download
                        </Button>
                    </Group>

                    <Stack gap={0}>
                        <Text>Invoice Number: 3232-4324-4352-4496</Text>
                        <Text>11-21-2025</Text>
                    </Stack>

                    <Stack gap={0}>
                        <Title order={4} c={"dimmed"}>
                            Billing Details
                        </Title>
                        <Text>Client: Juan Miguel Legazpi</Text>
                        <Text>Service: Vaccination</Text>
                        <Text>Pet: Ara</Text>
                    </Stack>

                    <Stack w={1000}>
                        <Title order={4} c={"dimmed"}>
                            Billing Breakdown
                        </Title>
                        <InvoiceTable />
                    </Stack>
                    <Stack w={1000}>
                        <Title order={4} c={"dimmed"}>
                            Summary
                        </Title>
                        <InvoiceSummaryTable />
                    </Stack>
                    <Stack align="end" w={"1000"}>
                        <Button>Process Payment</Button>
                    </Stack>
                </Stack>
            </div>
        </div>
    );
}
