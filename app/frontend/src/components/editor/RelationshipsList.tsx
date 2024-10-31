import { PolyculeRelationship } from "@app/common"
import { Button, Paper, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { RelationshipCard } from "./RelationshipCard";
import { useState } from "react";

export const RelationshipsList = ({
    relationships,
    setRelationships,
}: {
    relationships: PolyculeRelationship[];
    setRelationships?: (v: PolyculeRelationship[]) => void;
}) => {
    const [add, setAdd] = useState<PolyculeRelationship>({
        a: "",
        b: "",
    });

    return (
        <Stack py="md">
            {relationships.map((relationship, i) => (
                <RelationshipCard
                    key={relationship.a + ";" + relationship.b}
                    relationship={relationship}
                    setRelationship={setRelationships && ((rel) => {
                        setRelationships(relationships.map((x, ii) => i === ii ? rel : x));
                    })}
                    onDelete={setRelationships && (() => {
                        setRelationships(relationships.filter((x, ii) => i !== ii));
                    })}
                />
            ))}

            {setRelationships && (
                <Paper withBorder p="md">
                    <Stack>
                        <RelationshipCard
                            relationship={add}
                            setRelationship={setAdd}
                        />
                        
                        <Button
                            variant="light"
                            leftSection={<IconPlus />}
                            fullWidth
                            color="gray"
                            disabled={!add.a || !add.b}
                            onClick={() => setRelationships([
                                ...relationships,
                                { ...add }
                            ])}
                        >
                            Add a new relationship
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Stack>
    )
}
