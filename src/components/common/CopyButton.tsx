import { ActionIcon, CopyButton as CB, Tooltip } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

type Props = {
    value: string;
    copylabel?: string;
    copiedLable?: string;
};

export default function CopyButton({ value, copiedLable, copylabel }: Props) {
    return (
        <CB value={value} timeout={3000}>
            {({ copied, copy }) => (
                <Tooltip
                    label={
                        copied
                            ? (copiedLable ?? "Copied")
                            : (copylabel ?? "Copy")
                    }
                    withArrow
                    position="right"
                >
                    <ActionIcon
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
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
