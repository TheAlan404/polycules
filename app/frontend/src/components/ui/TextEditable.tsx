import { ActionIcon, Group, PolymorphicComponentProps, Text, TextInput, TextProps } from "@mantine/core";
import { IconCheck, IconPencil } from "@tabler/icons-react";
import { ReactNode, useState } from "react";

export const TextEditable = ({
    value,
    displayValue,
    onChange,
    ...props
}: {
    value: string;
    displayValue?: ReactNode;
    onChange?: (value: string) => void;
} & Omit<PolymorphicComponentProps<"p", TextProps>, "value" | "onChange">) => {
    const [editing, setEditing] = useState(false);

    return (
        <Group wrap="nowrap">
            {editing ? (
                <TextInput
                    autoFocus
                    value={value}
                    onChange={(e) => onChange?.(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if(e.key == "Enter" || e.key == "Esc") setEditing(false);
                    }}
                />
            ) : (
                displayValue || (
                    <Text {...props}>
                        {value}
                    </Text>
                )
            )}

            {onChange && (
                editing ? (
                    <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => setEditing(false)}
                    >
                        <IconCheck />
                    </ActionIcon>
                ) : (
                    <ActionIcon
                        variant="transparent"
                        c="dimmed"
                        onClick={() => setEditing(true)}
                        size="sm"
                    >
                        <IconPencil />
                    </ActionIcon>
                )
            )}
        </Group>
    )
};
