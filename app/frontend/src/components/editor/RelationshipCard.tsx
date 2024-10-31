import { PolyculeRelationship } from "@app/common"
import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { TextEditable } from "../ui/TextEditable";
import { PersonSelect } from "./PersonSelect";
import { onClickDelete } from "../../utils";
import { IconTrash } from "@tabler/icons-react";

export const RelationshipCard = ({
    relationship,
    setRelationship,
    onDelete,
}: {
    relationship: PolyculeRelationship;
    setRelationship?: (rel: PolyculeRelationship) => void;
    onDelete?: () => void;
}) => {
    return (
        <Paper withBorder={!!onDelete} p={onDelete ? "xs" : undefined}>
            <Stack w="100%">
                <Group grow justify="center">
                    <PersonSelect
                        value={relationship.a}
                        onChange={setRelationship && ((a) => setRelationship({
                            ...relationship,
                            a,
                        }))}
                    />
                    <PersonSelect
                        value={relationship.b}
                        onChange={setRelationship && ((b) => setRelationship({
                            ...relationship,
                            b,
                        }))}
                    />
                </Group>

                {onDelete && (
                    <Group flex="1">
                        <Group ta="center" justify="center">
                            <TextEditable
                                value={relationship.label || ""}
                                displayValue={(
                                    !relationship.label ? (
                                        <Text c="dimmed">add a label</Text>
                                    ) : (
                                        undefined
                                    )
                                )}
                                onChange={setRelationship && ((label) => setRelationship({
                                    ...relationship,
                                    label,
                                }))}
                            />

                        </Group>
                        <Group>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                c="dimmed"
                                onClick={onClickDelete(
                                    `Are you sure you want to delete this relationship?`,
                                    onDelete,
                                )}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Group>
                    </Group>
                )}
            </Stack>
        </Paper>
    )
}
