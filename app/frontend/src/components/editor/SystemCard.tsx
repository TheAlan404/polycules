import { PolyculeSystem } from "@app/common";
import { ActionIcon, ColorPicker, Group, Paper, Popover, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { ColoredPaper } from "../ui/ColoredPaper";
import { PersonCard } from "./PersonCard";
import { TextEditable } from "../ui/TextEditable";
import { IconPalette, IconTrash, IconUsersPlus } from "@tabler/icons-react";
import { onClickDelete, randId } from "../../utils";

export const SystemCard = ({
    system,
    setSystem,
    onDelete,
}: {
    system: PolyculeSystem;
    setSystem?: (system: PolyculeSystem) => void;
    onDelete?: () => void;
}) => {
    const isSinglet = system.members.length === 1;

    if (isSinglet) return (
        <PersonCard
            person={system.members[0]}
            setPerson={setSystem && ((person) => {
                setSystem({
                    ...system,
                    members: [person],
                });
            })}
            onDelete={onDelete}
            onPluralize={setSystem && (() => {
                setSystem({
                    ...system,
                    members: [
                        ...system.members,
                        { id: randId(), name: "New headmate" },
                    ],
                });
            })}
        />
    );

    return (
        <ColoredPaper color={system.color || "#ffffffff"} withBorder p="xs" pr={0}>
            <Stack w="100%">
                <Group justify="space-between" pr="xs">
                    <TextEditable
                        value={system.name || ""}
                        onChange={(name) => setSystem?.({
                            ...system,
                            name,
                        })}
                        displayValue={(
                            <Group gap={0} pl="xs">
                                <Text>{system.name || "unnamed"}</Text>
                                <Text c="dimmed">&</Text>
                            </Group>
                        )}
                    />

                    <Group>
                        <Popover disabled={!setSystem}>
                            <Popover.Target>
                                <ActionIcon
                                    variant="transparent"
                                    c="dimmed"
                                >
                                    <IconPalette />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <ColorPicker
                                    format="hex"
                                    fullWidth
                                    value={system.color || "#ffffff"}
                                    swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                                    onChange={(color) => setSystem?.({
                                        ...system,
                                        color,
                                    })}
                                />
                            </Popover.Dropdown>
                        </Popover>

                        {setSystem && (
                            <Tooltip label="New headmate">
                                <ActionIcon
                                    variant="transparent"
                                    c="dimmed"
                                    onClick={() => setSystem({
                                        ...system,
                                        members: [
                                            ...system.members,
                                            { id: randId(), name: "New headmate", color: system.color },
                                        ],
                                    })}
                                >
                                    <IconUsersPlus />
                                </ActionIcon>
                            </Tooltip>
                        )}

                        {onDelete && (
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                c="dimmed"
                                onClick={onClickDelete(
                                    `Are you sure you want to delete ${system.name || "this system"} and its ${system.members.length} members?`,
                                    onDelete,
                                )}
                            >
                                <IconTrash />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>

                {system.members.map((member, i) => (
                    <PersonCard
                        person={member}
                        setPerson={setSystem && ((person) => {
                            setSystem({
                                ...system,
                                members: system.members.map(x => x.id == member.id ? person : x),
                            });
                        })}
                        onDelete={setSystem && (() => {
                            setSystem({
                                ...system,
                                members: system.members.filter(x => x.id !== member.id),
                            })
                        })}
                        key={member.id}
                    />
                ))}
            </Stack>
        </ColoredPaper>
    )
};
