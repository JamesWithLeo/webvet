import dayjs from "dayjs";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";

function StaticMiniCalendar() {
    const todayDate = dayjs().date();
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    return (
        <Calendar
            static
            size={"xs"}
            defaultValue={new Date().toDateString()}
            renderDay={(date) => {
                const day = dayjs(date).date();
                const month = dayjs(date).month();
                const year = dayjs(date).year();
                const isCurrentDate =
                    day === todayDate &&
                    month === currentMonth &&
                    year === currentYear;

                return (
                    <Indicator
                        size={6}
                        color="red"
                        offset={-2}
                        disabled={!isCurrentDate}
                    >
                        <div>{day}</div>
                    </Indicator>
                );
            }}
        />
    );
}

export default StaticMiniCalendar;
