"use client";

import { userGenderValue } from "@/db/schema/users";
import {
    Box,
    TextInput,
    Button,
    Stepper,
    NativeSelect,
    NavLink,
    Image,
    Modal,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState, useRef } from "react";
import {
    IconPaw,
    IconCalendarPlus,
    IconChevronRight,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import updateUser from "@/actions/updateUser";
import SuccessModal from "./SuccessModal";
import { useSession } from "next-auth/react";

export default function AccountStepper({
    currentStep,
    userId,
}: {
    currentStep: number;
    userId: string;
}) {
    const { update, data: session } = useSession();

    const [active, setActive] = useState<number>(currentStep);
    const [isSuccesful, setIsSuccesful] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [sex, setSex] = useState<(typeof userGenderValue)[number]>("other");

    const [isOpenModal, { open, close }] = useDisclosure();
    const onSave = () => {
        open();
    };

    const stepperRef = useRef<HTMLDivElement>(null);

    const onConfirm = async () => {
        // todo error
        if (!sex || !dateOfBirth || !userId) {
            return;
        }
        const form = new FormData();
        form.append("firstName", firstName);
        form.append("lastName", lastName);
        form.append("sex", sex);
        form.append("dateOfBirth", dateOfBirth);
        const updatedUser = await updateUser(
            { userId: userId, schema: "setup" },
            null,
            form
        );

        if (updatedUser.succesful && updatedUser.user) {
            await update({
                ...updatedUser.user,
            }).then(() => {
                close();
                setIsSuccesful(true);
            });
        }
    };

    return (
        <>
            <Stepper
                ref={stepperRef}
                active={active}
                className="w-full items-center  "
                allowNextStepsSelect={false}
                size="xl"
            >
                <Stepper.Step
                    icon={
                        <Image
                            src="https://picsum.photos/200"
                            alt="Pet icon"
                            radius="xl"
                            width={32}
                            height={32}
                        />
                    }
                    label="Set up Account"
                    description={session?.user.email}
                    className=""
                >
                    <form>
                        <Box className="flex mt-8 gap-4 flex-col">
                            <TextInput
                                name="firstName"
                                withAsterisk
                                label={"First name"}
                                size="md"
                                maxLength={25}
                                placeholder="Juan Carlo"
                                variant="filled"
                                onChange={(event) =>
                                    setFirstName(event.currentTarget.value)
                                }
                            />
                            <TextInput
                                name="lastName"
                                label={"Last name"}
                                size="md"
                                placeholder="Legazpi"
                                maxLength={25}
                                variant="filled"
                                onChange={(event) =>
                                    setLastName(event.currentTarget.value)
                                }
                                withAsterisk
                            />
                            <div className="w-full flex gap-6">
                                <NativeSelect
                                    name="sex"
                                    className="w-full"
                                    size="md"
                                    data={userGenderValue}
                                    value={sex}
                                    multiple={false}
                                    label="Gender"
                                    variant="filled"
                                    withAsterisk
                                    onChange={(e) =>
                                        setSex(
                                            e.currentTarget.value as
                                                | "male"
                                                | "female"
                                                | "other"
                                        )
                                    }
                                />

                                <DatePickerInput
                                    name="dateOfBirth"
                                    size="md"
                                    onChange={setDateOfBirth}
                                    maxDate={new Date()}
                                    className="w-full"
                                    label="Date of Birth"
                                    placeholder="November 04, 1999"
                                    variant="filled"
                                    withAsterisk
                                />
                            </div>
                            <div className="flex w-full mt-10 justify-end gap-4">
                                <Button
                                    size="md"
                                    onClick={onSave}
                                    variant="light"
                                >
                                    Save
                                </Button>
                            </div>
                        </Box>
                    </form>
                </Stepper.Step>

                <Stepper.Completed>
                    <Box className="flex gap-4 flex-col">
                        <h1>Completed!, Whats your next Step?</h1>
                        <Box className="mx-4 gap-2 flex flex-col">
                            <NavLink
                                href="/v1/pet/"
                                label="Add a pet"
                                leftSection={<IconPaw stroke={1.5} />}
                                rightSection={<IconChevronRight />}
                                variant="subtle"
                                active
                            />
                            <NavLink
                                href="/v1/appointment/"
                                label="Set an Appointment"
                                leftSection={<IconCalendarPlus stroke={1.5} />}
                                rightSection={<IconChevronRight />}
                                variant="subtle"
                                active
                            />
                        </Box>
                    </Box>
                </Stepper.Completed>
            </Stepper>

            <Modal
                opened={isOpenModal}
                centered
                onClose={close}
                withCloseButton={false}
                size={"lg"}
            >
                <Box className="flex flex-col gap-6 p-4">
                    <span>
                        <h1 className="text-3xl">
                            Save your personal details?
                        </h1>
                        <h1>
                            Your details will be stored safely. You can update
                            them anytime.
                        </h1>
                    </span>
                    <span className="w-full flex justify-end gap-4">
                        <Button onClick={onConfirm}>Confirm</Button>
                        <Button variant="subtle" color="gray" onClick={close}>
                            Cancel
                        </Button>
                    </span>
                </Box>
            </Modal>

            {isSuccesful && (
                <SuccessModal
                    opened={isSuccesful}
                    timeOut={3000}
                    onClose={() => {
                        setIsSuccesful(false);
                        setActive((prev) => prev + 1);
                    }}
                    title="Profile Updated"
                    body="Your personal information has been saved successfully."
                />
            )}
        </>
    );
}
