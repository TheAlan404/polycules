import { ReactNode, useContext } from "react";
import { PolyculeContext } from "../context/PolyculeContext";
import { Avatar, Box, Group, Select, Text } from "@mantine/core";
import { PersonCard } from "./PersonCard";
import { IconCheck, IconMinus, IconRadiusBottomLeft } from "@tabler/icons-react";
import { ColoredPaper } from "../ui/ColoredPaper";

export const PersonSelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange?: (v: string) => void;
}) => {
    const { polycule } = useContext(PolyculeContext);

    const data: { value: string; label: string }[] = [];

    for (let system of polycule.systems) {
        if(system.members.length !== 1) data.push({
            value: system.id,
            label: system.name + "&",
        });

        for (let member of system.members) {
            data.push({
                value: `${system.id}-${member.id}`,
                label: member.name,
            });
        }
    }

    const getSystem = (id: string) => polycule.systems.find(x => x.id == (id.split("-")[0]));
    const getMember = (id: string) => getSystem(id)?.members?.find?.(x => x.id == id.split("-")[1]);

    const renderId = (id: string, pad?: boolean) => {
        const isMember = id.includes("-");

        let label;
        if (isMember) {
            let isSinglet = getSystem(id)?.members?.length === 1;
            let member = getMember(id);
            label = member ? (
                <Group gap="xs">
                    <Group gap="xs">
                        {!isSinglet && pad && (
                            <Text c="dimmed">&</Text>
                        )}

                        <Avatar
                            variant="filled"
                            name={member.name}
                            color={member.color}
                            size="sm"
                        />
                    </Group>

                    <Text>{member.name}</Text>
                </Group>
            ) : (
                <Text c="red">Not found</Text>
            )
        } else {
            let system = getSystem(id);
            label = system ? (
                <Box
                    className="person-select-system"
                    style={{
                        "--color": system.color || "#ffffff",
                        marginInlineStart: "6px",
                        position: "relative",
                        display: "flex",
                    }}
                >
                    <Group gap={0}>
                        <Text>{system.name}</Text>
                        {!pad && <Text c="dimmed">&</Text>}
                    </Group>
                </Box>
            ) : (
                <Text c="red">Not found</Text>
            )
        }

        return label;
    };

    return (
        onChange ? (
            <Select
                value={value}
                data={data}
                onChange={(v) => v && onChange(v)}
                allowDeselect={false}
                searchable
                renderOption={({ option, checked }) => {
                    return (
                        <Group flex="1" gap={0}>
                            {renderId(option.value, true)}

                            {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
                        </Group>
                    )
                }}
            />
        ) : (
            renderId(value)
        )
    )
};
