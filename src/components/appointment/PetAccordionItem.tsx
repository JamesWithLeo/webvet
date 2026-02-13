import { ServiceMergePriceType } from "@/db/schema/services";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    Accordion,
    Avatar,
    Badge,
    Group,
    Stack,
    Text,
    Checkbox,
    Tooltip,
} from "@mantine/core";

type Props = {
    pet: {
        id: string;
        name: string;
        photoUrl: string | null;
        breed: string;
        weight: number | null;
    };
    services: ServiceMergePriceType[];
};
export default function PetAccordionItem({ pet, services }: Props) {
    return (
        <Accordion.Item value={pet.id} className="outline bg-white rounded">
            <Accordion.Control
                icon={
                    <Avatar src={pet.photoUrl} size={36} radius="xl">
                        {pet.name[0]}
                    </Avatar>
                }
            >
                <Group justify="space-between" pr="md">
                    <Stack gap={0}>
                        <Text fw={500}>{pet.name}</Text>
                        <Text size="xs" c={"dimmed"}>
                            {toTitleCase(pet.breed)}
                        </Text>
                    </Stack>
                    {/* Badge shows count of selected services */}
                    <Badge variant="light">0 Services</Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                {services.length > 0 ? (
                    <Checkbox.Group>
                        {services.map((s) => {
                            const flatPrice = s.variants.find(
                                (v) => v.variant === "FLAT"
                            );
                            // If there's no flat rate and no pet size, we can't show a price
                            if (!flatPrice)
                                return (
                                    <Group
                                        key={s.id}
                                        justify="space-between"
                                        mb="sm"
                                        h={"2rem"}
                                    >
                                        <Stack gap={0}>
                                            <Checkbox
                                                value={s.id} // This is the ID we save to the DB
                                                label={toTitleCase(s.title)}
                                            />
                                            <Text
                                                size="xs"
                                                c="orange"
                                                ml={"xl"}
                                            >
                                                Size-dependent: Price will be
                                                assigned by staff upon arrival.
                                            </Text>
                                        </Stack>
                                        <Tooltip
                                            label="To be disclosed"
                                            withArrow
                                        >
                                            <Badge
                                                size="sm"
                                                color="gray"
                                                variant="outline"
                                            >
                                                TBD
                                            </Badge>
                                        </Tooltip>
                                    </Group>
                                );
                            else
                                return (
                                    <Group
                                        key={s.id}
                                        justify="space-between"
                                        mb="sm"
                                        h={"2rem"}
                                    >
                                        <Checkbox
                                            value={s.id} // This is the ID we save to the DB
                                            label={toTitleCase(s.title)}
                                        />
                                        <Stack gap={0} align="flex-end">
                                            <Text fw={700}>
                                                ₱{flatPrice.price}
                                            </Text>
                                            {/* Visual cue to show it's a flat rate or size-specific */}
                                            {/* <Badge
                                                                    size="sm"
                                                                    variant="dot"
                                                                    color={
                                                                        s
                                                                            .variants[
                                                                            active
                                                                        ]
                                                                            .variant ===
                                                                        "FLAT"
                                                                            ? "green"
                                                                            : "blue"
                                                                    }
                                                                >
                                                                    {"FLAT"}
                                                                </Badge> */}
                                        </Stack>
                                    </Group>
                                );
                        })}
                    </Checkbox.Group>
                ) : (
                    <Text size="sm">No service available at the moment</Text>
                )}
            </Accordion.Panel>
        </Accordion.Item>
    );
}
