import AppointmentSaved from "@/components/emails/AppointmentSaved";
import IncomingAppointmentEmail from "@/components/emails/IncomingAppointmentEmail";
import MagicLinkEmail from "@/components/emails/otp";
import PaymentReceived from "@/components/emails/PaymentReceived";
import { render } from "@react-email/render";

export default async function Page() {
    const incomming = await render(
        <IncomingAppointmentEmail
            id="123"
            name="123"
            pets="123"
            type="123"
            eventDateTime="123"
        />,
        {
            pretty: true,
        }
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
            // baseUrl="1234"
            // identifier="james123@gmail.com"
            // token="12345"
            name={"james123@gmail.com".split("@")[0]}
            otp="123456"
            // providerName="Google"
        />,
        { pretty: true }
    );

    const payment = await render(
        <PaymentReceived
            id="123"
            amount="600.00"
            name="James"
            pets={["Doggy"]}
            eventDateTime="Dec 12 2025"
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
        </>
    );
}
