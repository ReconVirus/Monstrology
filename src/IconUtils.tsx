import * as React from "react";

export const globalStyle = { verticalAlign: "sub", fontSize: "1.5em" };

export const generateIcon = (IconComponent: React.ElementType, color: string) => (
    <IconComponent style={{ ...globalStyle, color }} />
);
