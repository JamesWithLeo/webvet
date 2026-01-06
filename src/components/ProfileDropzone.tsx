"use client";

import { Dropzone, FileRejection, FileWithPath } from "@mantine/dropzone";
import { Group, MantineSpacing, Text } from "@mantine/core";
import { JSX, ReactNode } from "react";

type Props = {
    accept: string[] | undefined;
    iconAccept: JSX.Element;
    iconReject: JSX.Element;
    iconIdle: JSX.Element;
    label: ReactNode | string;
    description: ReactNode | string;
    multiple?: boolean | undefined;
    maxSize?: number | undefined;
    gap?: MantineSpacing | undefined;
    mih?: string | number | undefined;
    onDrop: (files: FileWithPath[]) => void;
    onReject?: ((files: FileRejection[]) => void) | undefined;
};
export default function ProfileDropzone({
    accept,
    iconAccept,
    iconReject,
    iconIdle,
    label,
    description,
    multiple,
    maxSize,
    gap,
    mih,
    onDrop,
    onReject,
}: Props) {
    return (
        <Dropzone
            className="h-full"
            onReject={onReject}
            maxSize={maxSize ?? 4 * 1024 ** 2}
            accept={accept}
            onDrop={onDrop}
            multiple={multiple ?? false}
        >
            <Group
                justify="center"
                gap={gap}
                mih={mih}
                style={{ pointerEvents: "none" }}
            >
                <Dropzone.Accept>{iconAccept}</Dropzone.Accept>
                <Dropzone.Reject>{iconReject}</Dropzone.Reject>
                <Dropzone.Idle>{iconIdle}</Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        {label}
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        {description}
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}
