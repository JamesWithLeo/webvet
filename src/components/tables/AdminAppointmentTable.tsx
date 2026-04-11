"use client";

import multiMonthPlugin from "@fullcalendar/multimonth";
import dayMonthPlugin from "@fullcalendar/daygrid";
import { AdminAppointment } from "@/db/schema/appointments";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import useAppointmentAdmin from "@/lib/hooks/useAppointmentAdmin";
import useAppointmentToPetsAdmin from "@/lib/hooks/useAppointmnetToPetsAdmin";
import { toTitleCase } from "@/lib/toTitleCase";
import FullCalendar from "@fullcalendar/react";
import {
    ActionIcon,
    Avatar,
    Button,
    Group,
    Loader,
    NativeSelect,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    IconCalendarEvent,
    IconChevronLeft,
    IconChevronRight,
    IconSearch,
    IconTable,
    IconX,
} from "@tabler/icons-react";
import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import {
    DataTable,
    DataTableColumn,
    getRecordId,
    useDataTableColumns,
} from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import {
    startTransition,
    useActionState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
    DatesSetArg,
    EventClickArg,
    EventSourceInput,
} from "@fullcalendar/core/index.js";
import { throttle } from "lodash";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { invoiceStatus, paymentStatusTypeValues } from "@/db/schema/invoice";
import AppointmentDrawerAdmin from "../appointment/AppointmentDrawerAdmin";

export default function AdminAppointmentTable({
    scope,
}: {
    scope: "all" | "incoming" | "past";
}) {
    const router = useRouter();
    const [now, setNow] = useState(new Date());
    const [currentTitle, setCurrentTitle] = useState("");
    const calendarRef = useRef<FullCalendar>(null);
    const [openedDrawer, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 64rem)", false, {
        getInitialValueInEffect: true,
    });
    const isMedium = useMediaQuery("(max-width: 80rem)", false, {
        getInitialValueInEffect: true,
    });

    const {
        data,
        isLoading,
        setSortStatus,
        sortStatus,
        searchName,
        setSearchName,
        filterInvoiceStatus,
        filterPaymentStatus,
        setFilterInvoiceStatus,
        setFilterPaymentStatus,
        dateRange,
        setDateRange,
    } = useAppointmentAdmin(scope);
    const [selectedRecord, setSelectedRecord] =
        useState<AdminAppointment | null>(null);

    const columns = useMemo<DataTableColumn<AdminAppointment>[]>(
        () => [
            {
                accessor: "firstName", // Use dot notation for nested fields
                title: "Full name",

                render: (
                    { user } // Destructure user from the record
                ) => (
                    <Text>
                        {toTitleCase(user.firstName)}{" "}
                        {toTitleCase(user.lastName)}
                    </Text>
                ),
                filter: (
                    <TextInput
                        label="Clients"
                        description="Show client whose names include the specified text"
                        placeholder="Search client..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                                onClick={() => setSearchName("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                        defaultValue={searchName}
                        onChange={(e) => {
                            setSearchName(e.currentTarget.value);
                        }}
                    />
                ),
                filtering: searchName !== "",
            },
            { accessor: "title", title: "Title / Reason" },
            {
                accessor: "contactNumber",
                title: "contact no.",
                resizable: true,
                render: ({ user }) => (
                    <Text>{toTitleCase(user.contactNumber)}</Text>
                ),
            },
            {
                accessor: "event_datetime",
                title: "Event Date time",
                resizable: true,
                sortable: true,

                filter: ({ close }) => (
                    <Stack>
                        <DatePicker
                            type="range"
                            defaultValue={dateRange}
                            onChange={(e) => {
                                setDateRange(e);
                            }}
                            presets={[
                                {
                                    label: "Today",
                                    value: [dayjs().format("YYYY-MM-DD"), null],
                                },
                                {
                                    label: "Yesterday",
                                    value: [
                                        dayjs()
                                            .subtract(1, "day")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "day")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last 7 Days",
                                    value: [
                                        dayjs()
                                            .subtract(6, "days")
                                            .format("YYYY-MM-DD"),
                                        dayjs().format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "This Month (MTD)",
                                    value: [
                                        dayjs()
                                            .startOf("month")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .endOf("month")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last Month",
                                    value: [
                                        dayjs()
                                            .subtract(1, "month")
                                            .startOf("month")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "month")
                                            .endOf("month")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last Year",
                                    value: [
                                        dayjs()
                                            .subtract(1, "year")
                                            .startOf("year")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "year")
                                            .endOf("year")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Full Current Year",
                                    value: [
                                        dayjs()
                                            .startOf("year")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .endOf("year")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                            ]}
                        />
                        <Button
                            variant="light"
                            onClick={() => setDateRange([null, null])}
                        >
                            clear date
                        </Button>
                    </Stack>
                ),
                render: (data) => {
                    const eventDate = new Date(data.event_datetime);

                    return (
                        <Text>
                            {eventDate.toLocaleString()}
                            {" ⇒ "}
                            {formatDistance(eventDate, subDays(new Date(), 0), {
                                addSuffix: true,
                            })}
                        </Text>
                    );
                },
                filtering: !!(dateRange[0] || dateRange[1]),
            },
            {
                accessor: "created_at",
                title: "createdAt",
                resizable: true,
                sortable: true,
                render: (data) => (
                    <Text>
                        {new Date(data.created_at).toLocaleString()}
                        {" ⇒ "}
                        {formatDistanceToNow(data.created_at, {
                            addSuffix: true,
                        })}
                    </Text>
                ),
            },
            {
                accessor: "invoice.status",
                title: "Status",
                resizable: true,
                render: (data) => (
                    <Text ta={"center"} size="sm">
                        {data.invoice?.status}
                    </Text>
                ),
                filtering: filterInvoiceStatus !== "ALL",
                filter: () => (
                    <NativeSelect
                        label="Invoice status"
                        onChange={(e) =>
                            setFilterInvoiceStatus(e.currentTarget.value)
                        }
                        description="Shows all appointment that  matches the filter"
                        data={["ALL"].concat(invoiceStatus.enumValues)}
                    />
                ),
            },
            {
                accessor: "invoice.paymentStatus",
                title: "Payment status",
                resizable: true,
                render: (data) => (
                    <Text ta={"center"} size="sm">
                        {data.invoice?.paymentStatus}
                    </Text>
                ),
                filtering: filterPaymentStatus !== "ALL",
                filter: () => (
                    <NativeSelect
                        label="Invoice payment status"
                        onChange={(e) =>
                            setFilterPaymentStatus(e.currentTarget.value)
                        }
                        description="Shows all appointment that  matches the filter"
                        data={["ALL"].concat(paymentStatusTypeValues)}
                    />
                ),
            },

            {
                accessor: "user.id",
                title: "Action",
                textAlign: "right",
                render: (record) => {
                    const invoice = record.invoice;
                    return (
                        <>
                            <Group justify="right">
                                {!invoice ? (
                                    <Button
                                        fullWidth
                                        variant="default"
                                        size="xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(
                                                `/v1/clinic/invoice/new/${record.id}`
                                            );
                                        }}
                                    >
                                        Arrived & Create Invoice
                                    </Button>
                                ) : (
                                    <>
                                        {invoice && (
                                            <Button
                                                variant="default"
                                                size="xs"
                                                fullWidth
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(
                                                        `/v1/clinic/invoice/${invoice.id}`
                                                    );
                                                }}
                                            >
                                                View Invoice
                                            </Button>
                                        )}

                                        {invoice.paymentStatus === "UNPAID" &&
                                            invoice.status === "COMPLETED" && (
                                                <Button
                                                    size="xs"
                                                    fullWidth
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(
                                                            `/v1/clinic/invoice/${invoice.id}`
                                                        );
                                                    }}
                                                >
                                                    Generate Invoice
                                                </Button>
                                            )}

                                        {/* {invoice.status === "ARRIVED" &&
                                            invoice.paymentStatus !==
                                                "VOID" && (
                                                <Button
                                                    fullWidth
                                                    variant="light"
                                                    color="orange"
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    Void invoice
                                                </Button>
                                            )} */}
                                    </>
                                )}
                            </Group>
                        </>
                    );
                },
            },
        ],
        [dateRange, searchName, filterInvoiceStatus, filterPaymentStatus]
    );

    const onEventClick = useCallback(
        throttle(
            (info: EventClickArg) => {
                setSelectedRecord(info.event.extendedProps as AdminAppointment);
                open();
            },
            3000,
            { trailing: false }
        ), // { trailing: false } ensures it fires immediately on the first click
        []
    );

    const getEventClassnames = useCallback((arg: string) => {
        const event_datetime = new Date(arg);
        if (event_datetime && event_datetime < now) return "fc-past-event";
        return "";
    }, []);

    const getEvent = (): EventSourceInput | undefined => {
        const events =
            data && data.length > 0
                ? data.map((event) => {
                      const status = event.invoice?.paymentStatus;

                      let statusClass = "bg-blue-500 border-blue-600"; // Default
                      if (status === "PAID" || status === "REFUNDED")
                          statusClass = "!bg-green-500 !border-green-600";
                      else if (status === "UNPAID")
                          statusClass = "!bg-red-400 dark:!bg-red-900/10";
                      else if (status === "VOID")
                          statusClass =
                              "!bg-gray-400 !border-gray-500 !opacity-50 italic";

                      return {
                          title: event.title,
                          start: new Date(event.event_datetime).toISOString(),
                          end: new Date(event.event_datetime).toISOString(),
                          display: "block",
                          extendedProps: {
                              ...event,
                          },
                          // Combine your existing past-event logic with the status logic
                          className: `${getEventClassnames(event.event_datetime)} ${statusClass} text-white px-1 rounded-sm`,
                      };
                  })
                : undefined;

        return events;
    };

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };

    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "table";

    // 2. To change the view, just update the URL
    const toggleView = () => {
        const params = new URLSearchParams(searchParams);
        params.set("view", view === "table" ? "calendar" : "table");
        router.push(`?${params.toString()}`);
    };

    const key = `admin-appointment-table-${scope}`;
    const { effectiveColumns } = useDataTableColumns<AdminAppointment>({
        key,
        columns: columns,
    });

    useEffect(() => {
        const calendar = calendarRef.current?.getApi();
        const timer = setInterval(() => setNow(new Date()), 60000);

        if (calendar && view === "calendar") {
            setCurrentTitle(calendar.view.title);
        }

        return () => clearInterval(timer);
    }, [view]);

    return (
        <Stack gap={"xl"}>
            <Stack>
                <Group justify="space-between">
                    <Title order={isMobile ? 3 : 1}>Appointment</Title>
                </Group>
                <Group
                    justify={view === "calendar" ? "space-between" : "flex-end"}
                >
                    <label
                        className="lg:text-2xl flex-1 text-lg "
                        hidden={view !== "calendar" && !!currentTitle}
                    >
                        {currentTitle}
                    </label>
                    <div className="flex gap-2" hidden={view !== "calendar"}>
                        <Button.Group>
                            <Button
                                onClick={() =>
                                    calendarRef.current?.getApi().prev()
                                }
                                radius={"md"}
                                size={isMobile ? "xs" : "sm"}
                                variant="default"
                                c="gray.7"
                            >
                                <IconChevronLeft size={20} />
                            </Button>
                            <Button
                                onClick={() =>
                                    calendarRef.current?.getApi().next()
                                }
                                radius={"md"}
                                size={isMobile ? "xs" : "sm"}
                                variant="default"
                                c="gray.7"
                            >
                                <IconChevronRight size={20} />
                            </Button>
                        </Button.Group>
                    </div>
                    <Button
                        variant="default"
                        radius={"md"}
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => {
                            toggleView();
                        }}
                    >
                        {view === "calendar" ? "Table view" : "Calendar view"}
                    </Button>
                </Group>
            </Stack>
            {view === "table" ? (
                <div className="block">
                    <DataTable
                        key={`${scope}-appointment-table`}
                        idAccessor={"id"}
                        withTableBorder={true}
                        withColumnBorders={true}
                        withRowBorders
                        verticalSpacing={"xs"}
                        horizontalSpacing={"xs"}
                        borderRadius="md"
                        pinFirstColumn
                        highlightOnHover={true}
                        fetching={isLoading}
                        minHeight={250}
                        columns={effectiveColumns}
                        pinLastColumn={true}
                        rowExpansion={{
                            allowMultiple: true,
                            content: ({ record, index, collapse }) => (
                                <AppointmentToPetsTable id={record.id} />
                            ),
                        }}
                        records={data}
                        totalRecords={data && data.length ? data.length : 0}
                        page={1}
                        onPageChange={() => {}}
                        recordsPerPage={10}
                        onSortStatusChange={setSortStatus}
                        sortStatus={sortStatus}
                        rowClassName={({ invoice }) => {
                            if (!invoice) return "";

                            switch (invoice.paymentStatus) {
                                case "PAID":
                                    return "!bg-green-50 dark:!bg-green-900/10";
                                case "REFUNDED":
                                    return "!bg-green-50 dark:!bg-green-900/10";
                                case "UNPAID":
                                    return "!bg-red-50 dark:!bg-red-900/10";
                                case "VOID":
                                    // Using gray-100 for a clear "disabled" look
                                    // Added 'text-gray-400' to dim the text
                                    return "!bg-gray-100 dark:!bg-zinc-800 !text-gray-400 italic";
                                default:
                                    return "";
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="block">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[multiMonthPlugin, dayMonthPlugin]}
                        multiMonthMaxColumns={isMedium ? 1 : 2}
                        aspectRatio={isMobile ? 0.8 : 1.9}
                        events={getEvent()}
                        headerToolbar={false}
                        datesSet={handleDatesSet}
                        eventClick={onEventClick}
                        viewClassNames={"cursor-pointer"}
                        dayMaxEventRows={1}
                        dayMaxEvents={1}
                    />
                </div>
            )}

            {selectedRecord && (
                <AppointmentDrawerAdmin
                    selectedRow={selectedRecord}
                    opened={openedDrawer}
                    close={close}
                />
            )}
        </Stack>
    );
}

const AppointmentToPetsTable = ({ id }: { id: string }) => {
    const { data } = useAppointmentToPetsAdmin(id);
    return (
        <Stack p={"md"}>
            {data && data.pets ? (
                data.pets.map((pet) => (
                    <Group key={`${id}-${pet.id}`} gap={"4rem"}>
                        <Group>
                            <Avatar src={pet.photoUrl}>{pet.name[0]}</Avatar>
                            <Stack gap={0}>
                                <Text>{toTitleCase(pet.name)}</Text>
                                <Text size="xs" c={"dimmed"}>
                                    {pet.id}
                                </Text>
                            </Stack>
                        </Group>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Service
                            </Text>
                            <Text size="sm">{pet.title}</Text>
                        </Stack>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Amount
                            </Text>
                            <Text size="sm">
                                {CurrencyFormatter(pet.priceAtBooking)}
                            </Text>
                        </Stack>
                    </Group>
                ))
            ) : (
                <Loader />
            )}
        </Stack>
    );
};
