import { PolyculePerson, PolyculeSystem } from "@app/common"
import { Accordion, ActionIcon, Avatar, Button, Collapse, ColorPicker, Group, Paper, Popover, Stack, Text, TextInput, Tooltip } from "@mantine/core"
import { IconCheck, IconChevronDown, IconLink, IconPencil, IconTrash, IconUsersPlus } from "@tabler/icons-react";
import { TextEditable } from "../ui/TextEditable";
import { modals } from "@mantine/modals";
import { onClickDelete } from "../../utils";
import { useDisclosure } from "@mantine/hooks";
import { RelationshipsList } from "./RelationshipsList";
import { useContext } from "react";
import { PolyculeContext } from "../context/PolyculeContext";

export const PersonCard = ({
    person,
    system,
    setPerson,
    onDelete,
    onPluralize,
}: {
    person: PolyculePerson;
    system: PolyculeSystem;
    setPerson?: (person: PolyculePerson) => void;
    onDelete?: () => void;
    onPluralize?: () => void;
}) => {
    const { polycule } = useContext(PolyculeContext);

    const id = `${system.id}-${person.id}`;

    return (
        <Paper {...(!!onPluralize ? {
            withBorder: true,
            p: "xs",
        } : {
            px: "xs",
        })}>
            <Accordion.Item value={id}>
                <Stack>
                    <Group>
                        <Popover disabled={!setPerson}>
                            <Popover.Target>
                                <ActionIcon
                                    variant="transparent"
                                >
                                    <Avatar
                                        variant="filled"
                                        name={person.name}
                                        color={person.color}
                                        size="sm"
                                    />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <ColorPicker
                                    format="hex"
                                    fullWidth
                                    value={person.color || "#ffffff"}
                                    swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                                    onChange={(color) => setPerson?.({
                                        ...person,
                                        color,
                                    })}
                                />
                            </Popover.Dropdown>
                        </Popover>
                        <Stack flex="1">
                            <Group justify="space-between">
                                <TextEditable
                                    value={person.name}
                                    onChange={setPerson && ((name) => setPerson({
                                        ...person,
                                        name,
                                    }))}
                                />

                                <Group>
                                    {onPluralize && (
                                        <Tooltip label="Add headmate">
                                            <ActionIcon
                                                variant="subtle"
                                                color="gray"
                                                c="dimmed"
                                                onClick={onPluralize}
                                            >
                                                <IconUsersPlus />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}

                                    <Accordion.Control
                                        c="dimmed"
                                        className="hoverable"
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            height: "28px",
                                            borderRadius: "var(--mantine-radius-sm)",
                                        }}
                                    >
                                        <Tooltip label="Relationships">
                                            <Group gap={4}>
                                                <IconChevronDown
                                                    size="1em"
                                                    className="mantine-Accordion-chevron chevron"
                                                />
                                                <Text>
                                                    {polycule.relationships.filter(x => x.a == id || x.b == id).length}
                                                </Text>
                                                <IconLink />
                                            </Group>
                                        </Tooltip>
                                    </Accordion.Control>

                                    {onDelete && (
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            c="dimmed"
                                            onClick={onClickDelete(
                                                `Are you sure you want to delete ${person.name}?`,
                                                onDelete,
                                            )}
                                        >
                                            <IconTrash />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </Group>
                        </Stack>
                    </Group>
                    <Accordion.Panel p={0} pl="calc(26px + var(--mantine-spacing-md))">
                        <RelationshipsList
                            id={id}
                        />
                    </Accordion.Panel>
                </Stack>
            </Accordion.Item>
        </Paper>
    )
}
