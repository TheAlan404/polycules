import { PolyculeRelationship } from "@app/common"
import { Group, Paper, Text } from "@mantine/core";
import { TextEditable } from "../ui/TextEditable";
import { PersonSelect } from "./PersonSelect";

export const RelationshipCard = ({
    relationship,
    setRelationship,
}: {
    relationship: PolyculeRelationship;
    setRelationship?: (rel: PolyculeRelationship) => void;
}) => {
    return (
        <Paper withBorder p="xs">
            <Group grow justify="center">
                <PersonSelect
                    value={relationship.a}
                    onChange={setRelationship && ((a) => setRelationship({
                        ...relationship,
                        a,
                    }))}
                />
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
                <PersonSelect
                    value={relationship.b}
                    onChange={setRelationship && ((b) => setRelationship({
                        ...relationship,
                        b,
                    }))}
                />
            </Group>
        </Paper>
    )
}
