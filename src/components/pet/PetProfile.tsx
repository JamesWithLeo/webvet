"use client";

import { PetTypeModel } from "@/types/pets";
import calculatePetAge from "@/lib/calculatePetAge";
import { toTitleCase } from "@/lib/toTitleCase";
import { Stack, Title, Text, List, Space, ActionIcon } from "@mantine/core";
import { IconArchive, IconChevronLeft, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { useRouter } from "next/navigation";
type Props = {
    data: PetTypeModel;
};
export default function PetProfile({
    data: {
        photoUrl,
        name,
        gender,
        distinguishingMarks,
        breedSpecification,
        dateOfBirth,
        weight,
        archivedAt,
    },
}: Props) {
    const age = calculatePetAge(dateOfBirth);
    const router = useRouter();
    return (
        <>
            {/* <Grid.Col span={12}>
                <Alert
                    variant="light"
                    color="red"
                    withCloseButton
                    w={"100%"}
                    title="Unsettled Payment"
                    closeButtonLabel="Dismiss payment remainder"
                    icon={<IconInfoCircle />}
                />
            </Grid.Col> */}
            <div className="flex w-full  justify-between">
                <div className="flex gap-2 ">
                    <ActionIcon
                        variant="transparent"
                        c={"dimmed"}
                        size={"input-sm"}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <IconChevronLeft />
                    </ActionIcon>
                </div>
                <div className="flex gap-2 ">
                    <NewAppointmentButton size="sm" />
                </div>
            </div>
            <div className="flex flex-col items-center sm:items-start  justify-start w-full gap-4 lg:gap-8 md:flex-row">
                <div className="relative  min-h-75 w-96 lg:w-120 lg:min-h-94 ">
                    <Image
                        className="rounded-md relative  w-full"
                        priority
                        src={photoUrl}
                        quality={100}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={breedSpecification}
                    />
                </div>
                <div className="grow flex h-full w-full sm:w-auto  items-start  justify-between">
                    <div>
                        <Stack h={"100%"} w={"100%"} gap={3} justify="center">
                            <Title c={"primary"}>{toTitleCase(name)}</Title>
                            <Title order={6} c={"dimmed"}>
                                {toTitleCase(gender)} /{" "}
                                {age.years ? age.years : age.months} years old
                            </Title>
                            <Title order={6} c={"dimmed"}>
                                Weight: {weight ? weight : "To be assigned"}
                            </Title>
                            <Space h={"sm"} />
                            <Text>Last Vaccination: Null</Text>
                            <Text>Last Grooming: Null</Text>
                            <Text>Descriptive Features</Text>

                            <List listStyleType="disc">
                                {distinguishingMarks?.map((v) => (
                                    <List.Item key={v}>{v}</List.Item>
                                ))}
                            </List>
                        </Stack>
                        <Stack
                            // w={"100%"}
                            h={"100%"}
                            align="flex-start"
                            justify="flex-start"
                        >
                            {/* <Button color="red">Payment</Button> */}
                        </Stack>
                    </div>
                </div>
            </div>
        </>
    );
}
