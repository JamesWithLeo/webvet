import { Alert, AlertProps, Text, Transition } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import "../css/Tips.css";

type TipProps = AlertProps & { message: string[]; intervalMs?: number };

export default function Tips({
    intervalMs = 8000,
    message,
    ...props
}: TipProps) {
    const [index, setIndex] = useState(0);
    const [opened, setOpened] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % message.length);
        }, intervalMs);

        return () => {
            clearInterval(timer);
        };
    }, [index, intervalMs]);
    return (
        <Alert
            {...props}
            key={index}
            icon={<IconInfoCircle />}
            className="tip-pop-text"
        >
            <div> {`${message[index]}`}</div>
        </Alert>
    );
}
