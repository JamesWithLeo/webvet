import { useActionState, useEffect, startTransition } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Stack, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { markAsArrivedAction } from "@/actions/invoice";
import { toTitleCase } from "@/lib/toTitleCase";
import { AdminAppointment } from "@/db/schema/appointments";
import { useRouter } from "next/navigation";

export function useMarkAsArrived(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [formState, formAction, isPending] = useActionState(
        markAsArrivedAction,
        {
            success: false,
        }
    );

    useEffect(() => {
        if (formState.success) {
            notifications.show({
                title: "Success",
                message: "Client checked in. Invoice generated.",
                color: "green",
            });
            queryClient.invalidateQueries({
                queryKey: ["appointments", "admin"],
            });
            if (onSuccess) onSuccess();
        }
        if (formState.error) {
            notifications.show({
                title: "Error",
                message: "Could not complete check-in.",
                color: "red",
            });
        }
    }, [formState.success, formState.error]);

    const handleMarkAsArrived = (record: AdminAppointment) => {
        router.push(`/v1/clinic/invoice/new/${record.id}`);

        // modals.openConfirmModal({
        //     title: "Confirm Client Arrival",

        //     centered: true,
        //     radius: "lg",
        //     size: "md",
        //     labels: { confirm: "Confirm Arrival", cancel: "Go Back" },
        //     confirmProps: { color: "red", radius: "md" },
        //     children: (
        //         <Stack gap={0}>
        //             <Text>
        //                 Are you sure you want to mark{" "}
        //                 <b>
        //                     {toTitleCase(
        //                         `${record.user.firstName} ${record.user.lastName}`
        //                     )}
        //                 </b>
        //                 with title / reason of <b>{record.title} </b> as
        //                 arrived?
        //             </Text>
        //             <Text size="sm" c="dimmed">
        //                 This will update the appointment status and generate an
        //                 initial invoice.
        //             </Text>
        //         </Stack>
        //     ),
        //     onConfirm: () => {
        //         startTransition(() => {
        //             formAction({
        //                 appointmentId: record.id,
        //                 userId: record.user.id,
        //             });
        //         });
        //     },
        // });
    };

    return {
        handleMarkAsArrived,
        isPending,
        isSuccess: formState.success,
        state: formState,
    };
}
