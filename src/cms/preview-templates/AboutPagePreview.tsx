import React from "react";
import { AboutPageTemplate } from "~templates/about-page";

interface AboutPagePreviewProps {
    entry: { getIn: (data: Array<string>) => any };
    widgetFor: (type: string) => any;
}

const AboutPagePreview: React.FC<AboutPagePreviewProps> = ({ entry, widgetFor }) => (
    <AboutPageTemplate title={entry.getIn(["data", "title"])} content={widgetFor("body")} />
);

export default AboutPagePreview;
