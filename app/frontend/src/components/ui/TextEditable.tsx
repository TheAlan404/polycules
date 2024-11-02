import { ActionIcon, Group, PolymorphicComponentProps, Text, TextInput, TextProps, Tooltip } from "@mantine/core";
import { IconCheck, IconPencil } from "@tabler/icons-react";
import { ReactNode, useState } from "react";

export const TextEditable = ({
    value,
    displayValue,
    onChange,
    icon,
    tooltip,
    ...props
}: {
    value: string;
    displayValue?: ReactNode;
    onChange?: (value: string) => void;
    icon?: React.ReactNode;
    tooltip?: React.ReactNode;
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
                    onBlur={() => setEditing(false)}
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
                    <></>
                ) : (
                    <Tooltip label={tooltip} disabled={!tooltip}>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            c="dimmed"
                            onClick={() => setEditing(true)}
                            size="sm"
                        >
                            {icon || <IconPencil />}
                        </ActionIcon>
                    </Tooltip>
                )
            )}
        </Group>
    )
};
