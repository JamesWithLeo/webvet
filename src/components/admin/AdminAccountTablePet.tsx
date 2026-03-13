"use client";

import usePets from "@/lib/hooks/usePets";
import { toTitleCase } from "@/lib/toTitleCase";
import {useRouter} from "next/navigation";
import { PetTypeModelWithBreed } from "@/types/pets";
import {
    ActionIcon,
    Avatar,
    Group,
    Loader,
    Menu,
    Paper,
    Stack,
    Text,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";

type Props = {
    ownerId: string;
};
export default function AdminAccountPetTable({ ownerId }: Props) {
    const { data, isFetching } = usePets(ownerId, "all");
    const router =useRouter()
    const columns = useMemo<DataTableColumn<PetTypeModelWithBreed>[]>(
        () => [{ accessor: "name", title: "Name" }],
        [ownerId, data]
    );
    return (
        <Group bg={"gray.0"} p={"md"}>
            {isFetching && <Loader />}
            {!isFetching && data && data.length > 0
                ? data.map((pet) => (
                      <Paper
                          miw={"300px"}
                          key={pet.id}
                          withBorder
                          p={"md"}
                          radius={"md"}
                      >
                          <Group justify="space-between">
                              <Group>
                                  <Avatar src={pet.photoUrl}>
                                      {pet.name[0]}
                                  </Avatar>
                                  <Stack gap={0}>
                                      <Text>{toTitleCase(pet.name)}</Text>
                                      <Text size="xs" c={"dimmed"}>
                                          {toTitleCase(pet.breedSpecification)}
                                      </Text>
                                  </Stack>
                              </Group>
                              <ActionIcon variant="transparent" size={"sm"}>
                                  <Menu
                                      width={"200px"}
                                      radius={"md"}
                                      withArrow
                                      arrowSize={16}
                                      shadow="md"
                                  >
                                      <Menu.Target>
                                          <IconDotsVertical />
                                      </Menu.Target>
                                      <Menu.Dropdown>
                                          <Menu.Item onClick={()=> {
router.push(`/v1/clinic/pets?highlight=${pet.id}`)
                                          }}>View on table</Menu.Item>
                                          <Menu.Item>
                                              View medical history
                                          </Menu.Item>
                                      </Menu.Dropdown>
                                  </Menu>
                              </ActionIcon>
                          </Group>
                      </Paper>
                  ))
                : null}
        </Group>
    );
}
