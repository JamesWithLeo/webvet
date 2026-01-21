import { Group, ThemeIcon, Box, Text } from "@mantine/core";

export default function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" color="gray" size="md">
                {icon}
            </ThemeIcon>
            <Box>
                <Text size="sm" c="dimmed" lh={1.2}>
                    {label}
                </Text>
                <Text size="md" fw={500}>
                    {value}
                </Text>
            </Box>
        </Group>
    );
}
