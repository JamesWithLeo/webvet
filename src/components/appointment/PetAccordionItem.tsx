import { ServiceMergePriceType } from "@/db/schema/services";
import { getSizeByWeight } from "@/lib/getSizeByWeight";
import { useAppointment } from "@/lib/hooks/useAppointmentContext";
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
import { useMemo } from "react";

type Props = {
    pet: {
        id: string;
        name: string;
        photoUrl: string | null;
        breed: string;
        weight: number | null;
        species: "dog" | "cat";
    };
    services: ServiceMergePriceType[];
};
export default function PetAccordionItem({ pet, services }: Props) {
    const { selections, toggleService, removePet } = useAppointment();
    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });
    const totalServices = useMemo(() => {
        return selections[pet.id]?.length ?? 0;
    }, [selections, pet.id]);
    return (
        <Accordion.Item
            value={pet.id}
            className="outline outline-gray-300 p-3 bg-white rounded"
        >
            <Accordion.Control
                icon={
                    <Avatar src={pet.photoUrl} size={"lg"} radius="xl">
                        {pet.name[0]}
                    </Avatar>
                }
            >
                <Group justify="space-between" pr="md">
                    <Stack gap={0}>
                        <Text fw={600}>{toTitleCase(pet.name)}</Text>
                        <Text c={"dimmed"}>{toTitleCase(pet.breed)}</Text>
                    </Stack>
                    <Badge
                        variant="light"
                        size="md"
                        color={totalServices > 0 ? "blue" : "gray"}
                    >
                        {totalServices}{" "}
                        {totalServices > 1 ? `services` : `service`}
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Stack gap={0}>
                    {services.length > 0 ? (
                        <>
                            {services
                                .filter(
                                    (s) =>
                                        s.species === null ||
                                        s.species === pet.species
                                )
                                .map((service) => {
                                    // 1. Check if weight is valid
                                    const hasWeight =
                                        typeof pet.weight === "number" &&
                                        pet.weight > 0;

                                    // 2. Safely get the size for TS
                                    const petSize = hasWeight
                                        ? getSizeByWeight(pet.weight as number)
                                        : null;

                                    // 3. Find the variant
                                    const matchingVariant =
                                        service.variants.find(
                                            (v: any) =>
                                                v.variant === "FLAT" ||
                                                (petSize &&
                                                    v.variant === petSize)
                                        );
                                    const isCurrentlyChecked = !!selections[
                                        pet.id
                                    ]?.some((item) => item.id === service.id);

                                    if (!matchingVariant && !hasWeight) {
                                        return (
                                            <Group
                                                key={service.id}
                                                justify="space-between"
                                                wrap="nowrap"
                                                className="cursor-pointer hover:bg-gray-100 rounded-sm select-none"
                                                p={"sm"}
                                                onClick={() => {
                                                    toggleService(pet.id, {
                                                        name: pet.name,
                                                        priceAtBooking: "0",
                                                        ...service,
                                                    });
                                                }}
                                            >
                                                <Stack gap={0} flex={1}>
                                                    <Checkbox
                                                        key={`${service.id}-${isCurrentlyChecked}`}
                                                        checked={
                                                            isCurrentlyChecked
                                                        }
                                                        label={toTitleCase(
                                                            service.title
                                                        )}
                                                        readOnly
                                                        styles={{
                                                            input: {
                                                                pointerEvents:
                                                                    "none",
                                                            },
                                                        }}
                                                    />

                                                    <Text
                                                        size="xs"
                                                        c="orange"
                                                        ml={"xl"}
                                                    >
                                                        Size-dependent: Price
                                                        will be assigned by
                                                        staff upon arrival.
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
                                    }

                                    if (!matchingVariant) return null;
                                    return (
                                        <Group
                                            key={service.id}
                                            justify="space-between"
                                            mb="xs"
                                            wrap="nowrap"
                                            gap={0}
                                            p="sm"
                                            className="cursor-pointer select-none hover:bg-gray-100 rounded-sm"
                                            onClick={() => {
                                                toggleService(pet.id, {
                                                    name: pet.name,
                                                    priceAtBooking:
                                                        matchingVariant.price,
                                                    ...service,
                                                });
                                            }}
                                        >
                                            <Stack gap="4px" flex={1}>
                                                <Checkbox
                                                    key={`${service.id}-${isCurrentlyChecked}`}
                                                    checked={isCurrentlyChecked}
                                                    label={toTitleCase(
                                                        service.title
                                                    )}
                                                    readOnly
                                                    styles={{
                                                        input: {
                                                            pointerEvents:
                                                                "none",
                                                        },
                                                    }}
                                                />
                                                <Badge
                                                    ml={"xl"}
                                                    color="gray"
                                                    variant="outline"
                                                >
                                                    {matchingVariant.variant ===
                                                    "FLAT"
                                                        ? "Standard"
                                                        : matchingVariant.variant}
                                                </Badge>
                                            </Stack>

                                            <Text size="sm" fw={700}>
                                                {currencyFormatter.format(
                                                    Number(
                                                        matchingVariant.price
                                                    )
                                                )}
                                            </Text>
                                        </Group>
                                    );
                                })}
                        </>
                    ) : (
                        <Text size="sm">
                            No service available at the moment
                        </Text>
                    )}
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
