"use client";

import { sexValues } from "@/db/schema/users";
import {
  Box,
  TextInput,
  Button,
  Stepper,
  NativeSelect,
  NavLink,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState, ReactElement, useRef } from "react";
import {
  IconPaw,
  IconCalendarPlus,
  IconChevronRight,
} from "@tabler/icons-react";

export default function AccountStepper({ stepTwo }: { stepTwo: ReactElement }) {
  const [active, setActive] = useState<number>(0);
  const nextStep = () => {
    setActive((prev) => prev + 1);
  };

  const stepperRef = useRef<HTMLDivElement>(null);

  return (
    <Stepper
      ref={stepperRef}
      active={active}
      className="w-full items-center"
      onStepClick={active === 1 ? undefined : (step) => nextStep}
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
        label="Setup Account"
        description="OcampoJames04@gmail.com"
        className=""
      >
        <Box className="flex mt-8 gap-4 flex-col">
          <TextInput
            withAsterisk
            label={"First name"}
            size="md"
            placeholder="Juan Carlo"
            variant="filled"
          />
          <TextInput
            label={"Last name"}
            size="md"
            placeholder="Legazpi"
            variant="filled"
            withAsterisk
          />
          <div className="w-full flex gap-6">
            <NativeSelect
              className="w-full"
              size="md"
              data={sexValues}
              label="Gender"
              variant="filled"
              withAsterisk
            />

            <DatePickerInput
              dropdownType="modal"
              size="md"
              className="w-full"
              label="Date of Birth"
              placeholder="November 04, 1999"
              variant="filled"
              withAsterisk
            />
          </div>
          <div className="flex w-full mt-10 justify-end gap-4">
            <Button size="md" onClick={nextStep}>
              Continue
            </Button>
          </div>
        </Box>
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
  );
}
