import { PolyculeRelationship } from "@app/common"
import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { RelationshipCard } from "./RelationshipCard";

export const RelationshipsList = ({
    relationships,
    setRelationships,
}: {
    relationships: PolyculeRelationship[];
    setRelationships?: (v: PolyculeRelationship[]) => void;
}) => {
    return (
        <Stack py="md">
            {relationships.map((relationship, i) => (
                <RelationshipCard
                    key={relationship.a + ";" + relationship.b}
                    relationship={relationship}
                    setRelationship={setRelationships && ((rel) => {
                        setRelationships(relationships.map((x, ii) => i === ii ? rel : x));
                    })}
                />
            ))}

            {setRelationships && (
                <Button
                    variant="light"
                    leftSection={<IconPlus />}
                    fullWidth
                    color="gray"
                >
                    Add a new relationship
                </Button>
            )}
        </Stack>
    )
}
