import { PolyculeRelationship } from "@app/common"
import { ActionIcon, Avatar, Box, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { TextEditable } from "../ui/TextEditable";
import { onClickDelete } from "../../utils";
import { IconCheck, IconEdit, IconPencilPlus, IconTrash, IconUnlink, IconX } from "@tabler/icons-react";
import { useContext, useMemo, useState } from "react";
import { PolyculeContext } from "../context/PolyculeContext";

const InlineCard = ({
    id,
    pad,
}: {
    id: string;
    pad?: boolean;
}) => {
    const { polycule } = useContext(PolyculeContext);
    
    const getSystem = (id: string) => polycule.systems.find(x => x.id == (id.split("-")[0]));
    const getMember = (id: string) => getSystem(id)?.members?.find?.(x => x.id == id.split("-")[1]);

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
                    marginInlineStart: "12px",
                    position: "relative",
                    display: "flex",
                    paddingInlineEnd: "var(--mantine-spacing-xs)",
                }}
            >
                <Group gap={0}>
                    <Text>{system.name || "unnamed"}</Text>
                    {!pad && <Text c="dimmed">&</Text>}
                </Group>
            </Box>
        ) : (
            <Text c="red">Not found</Text>
        )
    }

    return label;
};

type SelectEntry = {
    value: string;
    label: string;
    disabled?: boolean;
};

export const RelationshipCard = ({
    id,
    relationship,
    setRelationship,
    onDelete,
}: {
    id: string;
    relationship: PolyculeRelationship;
    setRelationship?: (rel: PolyculeRelationship) => void;
    onDelete?: () => void;
}) => {
    const { polycule } = useContext(PolyculeContext);
    const otherId = relationship.a == id ? relationship.b : relationship.a;
    const [editing, setEditing] = useState(otherId == "");

    const data: SelectEntry[] = useMemo(() => {
        let data: SelectEntry[] = [];
        if(!editing) return data;

        let blacklist = new Set();
        blacklist.add(id);

        for(let rel of polycule.relationships) {
            if(rel.a == id) blacklist.add(rel.b);
            if(rel.b == id) blacklist.add(rel.a);
        }

        for (let system of polycule.systems) {
            if (
                system.members.length !== 1
                && !blacklist.has(system.id)
            ) data.push({
                value: system.id,
                label: system.name + "&",
                disabled: id.includes("-") && (system.id == id.split("-")[0])
            });
    
            for (let member of system.members) {
                let value = `${system.id}-${member.id}`;
                if(blacklist.has(value)) continue;
                data.push({
                    value,
                    label: member.name,
                });
            }
        }

        return data;
    }, [editing, polycule, id]);

    return (
        <Paper>
            <Stack w="100%">
                <Group justify="space-between">
                    <Group>
                        {editing ? (
                            <Group>
                                <Select
                                    value={otherId}
                                    data={data}
                                    onChange={(v) => {
                                        setEditing(false);

                                        if(v) setRelationship?.({
                                            ...relationship,
                                            a: v,
                                            b: id,
                                        })
                                    }}
                                    onBlur={() => setEditing(false)}
                                    allowDeselect={false}
                                    autoFocus
                                    searchable
                                    renderOption={({ option, checked }) => {
                                        return (
                                            <Group flex="1" gap={0}>
                                                <InlineCard
                                                    id={option.value}
                                                    pad
                                                />

                                                {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
                                            </Group>
                                        )
                                    }}
                                />
                            </Group>
                        ) : (
                            <Group>
                                <InlineCard
                                    id={otherId}
                                />

                                {setRelationship && (
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        c="dimmed"
                                        onClick={() => setEditing(true)}
                                    >
                                        <IconEdit />
                                    </ActionIcon>
                                )}
                            </Group>
                        )}

                        <TextEditable
                            c="dimmed"
                            value={relationship.label || ""}
                            icon={!relationship.label && <IconPencilPlus />}
                            tooltip={!relationship.label && "Add a label"}
                            onChange={setRelationship && ((label) => setRelationship({
                                ...relationship,
                                label,
                            }))}
                        />
                    </Group>

                    <Group>
                        {onDelete && (
                            <Group>
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    c="dimmed"
                                    onClick={onClickDelete(
                                        `Delete relationship?`,
                                        onDelete,
                                    )}
                                >
                                    <IconX />
                                </ActionIcon>
                            </Group>
                        )}
                    </Group>
                </Group>
            </Stack>
        </Paper>
    )
}
