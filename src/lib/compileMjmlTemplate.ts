import mjml2html from "mjml";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

export function compileMjmlTemplate(templateName: string, data: any) {
    // 1. Get the absolute path to your .mjml file
    const templatePath = path.join(
        process.cwd(),
        "src",
        "components",
        "emails",
        `${templateName}.mjml`
    );

    if (!fs.existsSync(templatePath)) {
        throw new Error(`Email template not found at: ${templatePath}`);
    }

    // 2. Read the raw MJML content
    const mjmlRaw = fs.readFileSync(templatePath, "utf8");

    // 3. Use Handlebars to process loops and variables ({{name}}, {{#each pets}})
    const hbTemplate = handlebars.compile(mjmlRaw);
    const mjmlWithData = hbTemplate(data);

    // 4. Convert the final MJML into pure HTML
    const { html, errors } = mjml2html(mjmlWithData, {
        minify: true,
        validationLevel: "soft",
    });

    if (errors.length > 0) {
        console.error("MJML Compilation Errors:", errors);
    }

    return html;
}
