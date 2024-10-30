import { Paper, PaperProps, PolymorphicComponentProps } from "@mantine/core"

export const ColoredPaper = ({
    color,
    children,
    ...props
}: {
    color: string;
} & PolymorphicComponentProps<"div", PaperProps>) => {
    return (
        <Paper
            className="colored-paper"
            pt="xs"
            pb="xs"
            pl="lg"
            style={{
                position: "relative",
                display: "flex",
                paddingInlineStart: "22px",
                paddingInlineEnd: "var(--mantine-spacing-xs)",
                "--color": color,
            }}
            {...props}
        >
            {children}
        </Paper>
    )
}
