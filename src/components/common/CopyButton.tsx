import { ActionIcon, CopyButton as CB, Tooltip } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

type Props = {
    value: string;
};
export default function CopyButton({ value }: Props) {
    return (
        <CB value={value} timeout={3000}>
            {({ copied, copy }) => (
                <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                >
                    <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                    >
                        {copied ? (
                            <IconCheck size={16} />
                        ) : (
                            <IconCopy size={16} />
                        )}
                    </ActionIcon>
                </Tooltip>
            )}
        </CB>
    );
}
