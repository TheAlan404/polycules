import { PolyculePerson } from "@app/common"
import { ActionIcon, Avatar, ColorPicker, Group, Paper, Popover, Stack, Text, TextInput, Tooltip } from "@mantine/core"
import { IconCheck, IconPencil, IconTrash, IconUsersPlus } from "@tabler/icons-react";
import { TextEditable } from "../ui/TextEditable";
import { modals } from "@mantine/modals";
import { onClickDelete } from "../../utils";

export const PersonCard = ({
    person,
    setPerson,
    onDelete,
    onPluralize,
}: {
    person: PolyculePerson;
    setPerson?: (person: PolyculePerson) => void;
    onDelete?: () => void;
    onPluralize?: () => void;
}) => {
    return (
        <Paper {...(!!onPluralize ? {
            withBorder: true,
            p: "xs",
        } : {
            px: "xs",
        })}>
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
                                        variant="transparent"
                                        color="gray"
                                        c="dimmed"
                                        onClick={onPluralize}
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
        </Paper>
    )
}
