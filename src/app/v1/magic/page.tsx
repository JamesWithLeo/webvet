import AppointmentSaved from "@/components/emails/AppointmentSaved";
import IncomingAppointmentEmail from "@/components/emails/IncomingAppointmentEmail";
import MissedAppointmentEmail from "@/components/emails/MissedAppointmentEmail";
import MagicLinkEmail from "@/components/emails/otp";
import PaymentReceived from "@/components/emails/PaymentReceived";
import TestCron from "@/components/testCron";
import { formatDateToReadable } from "@/lib/formatDateToReadable";
import { render } from "@react-email/render";

export default async function Page() {
    const incomming = await render(
        <IncomingAppointmentEmail
            id="123"
            name="123"
            petsWithServiceType={[{ name: "chloe", type: "GROOMING" }]}
            eventDateTime={formatDateToReadable(new Date())}
        />
    );
    const missed = await render(
        <MissedAppointmentEmail
            id="123"
            name="123"
            title="Grooming"
            eventDateTime={formatDateToReadable(new Date())}
        />
    );

    const saved = await render(
        <AppointmentSaved
            eventDateTime={new Date().toDateString()}
            id="123456"
            pets="Dash, Foxley, and Ara"
            name={"James"}
            type="Deworming"
        />,
        { pretty: true }
    );

    const otp = await render(
        <MagicLinkEmail
            name={"james123@gmail.com".split("@")[0]}
            otp="123456"
        />,
        { pretty: true }
    );

    const payment = await render(
        <PaymentReceived
            id="123"
            amount="600.00"
            name="James"
            pets={["Doggy"]}
            paidAt={formatDateToReadable(new Date())}
        />,
        { pretty: true }
    );

    return (
        <>
            <iframe
                srcDoc={incomming}
                title="Email Preview"
                className="w-full h-200 bg-white rounded shadow-sm"
            />
            <iframe
                srcDoc={missed}
                title="Email Preview"
                className="w-full h-200 bg-white rounded shadow-sm"
            />
            <iframe
                srcDoc={saved}
                title="Email Preview"
                className="w-full h-200 bg-white rounded shadow-sm"
            />

            <iframe
                srcDoc={otp}
                title="Email Preview"
                className="w-full h-200 bg-white rounded shadow-sm"
            />

            <iframe
                srcDoc={payment}
                title="Email Preview"
                className="w-full h-200 bg-white rounded shadow-sm"
            />

            <TestCron bearer={process.env.CRON_SECRET!} />
        </>
    );
}
