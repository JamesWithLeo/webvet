import AppointmentSaved from "@/components/emails/AppointmentSaved";
import MagicLinkEmail from "@/components/emails/MagicLinkEmail";

export default function Page() {
    return (
        <>
            <AppointmentSaved
                id="123456"
                pets="Dash, Foxley, and Ara"
                name={"James"}
                type="Deworming"
            />

            <MagicLinkEmail
                baseUrl="1234"
                identifier="james123@gmail.com"
                token="12345"
                name={"james123@gmail.com".split("@")[0]}
                providerName="Google"
            />
        </>
    );
}
