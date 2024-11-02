import { PolyculeRelationship } from "@app/common"
import { Button, Group, Paper, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { RelationshipCard } from "./RelationshipCard";
import { useContext, useMemo, useState } from "react";
import { PolyculeContext } from "../context/PolyculeContext";

export const RelationshipsList = ({
    id,
}: {
    id: string;
}) => {
    const { polycule, setPolycule } = useContext(PolyculeContext);

    const relationships = useMemo(() => (
        polycule.relationships
            .map((x,i) => [x, i] as [PolyculeRelationship, number])
            .filter(([x, i]) => x.a == id || x.b == id)
    ), [polycule.relationships]);

    return (
        <Stack>
            {relationships.map(([relationship, idx]) => (
                <RelationshipCard
                    id={id}
                    key={relationship.a + ";" + relationship.b}
                    relationship={relationship}
                    setRelationship={setPolycule && ((rel) => {
                        setPolycule({
                            ...polycule,
                            relationships: polycule.relationships
                                .map((x, i) => i === idx ? rel : x)
                        });
                    })}
                    onDelete={setPolycule && (() => {
                        setPolycule({
                            ...polycule,
                            relationships: polycule.relationships
                                .filter((_, i) => i !== idx)
                        });
                    })}
                />
            ))}

            {setPolycule && (
                <Group>
                    <Button
                        variant="subtle"
                        color="gray"
                        c="dimmed"
                        leftSection={<IconPlus />}
                        onClick={() => {
                            setPolycule({
                                ...polycule,
                                relationships: [
                                    ...polycule.relationships,
                                    { a: id, b: "" },
                                ],
                            });
                        }}
                    >
                        Add a {id.includes("-") ? "" : "system"} relationship
                    </Button>
                </Group>
            )}
        </Stack>
    )
}
