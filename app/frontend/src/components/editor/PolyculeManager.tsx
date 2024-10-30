import { Stack, Title } from "@mantine/core";
import { SystemsList } from "./SystemsList";
import { useContext } from "react";
import { PolyculeContext } from "../context/PolyculeContext";
import { RelationshipsList } from "./RelationshipsList";

export const PolyculeManager = () => {
    const { polycule, setPolycule } = useContext(PolyculeContext);

    return (
        <Stack>
            <Title order={2}>Members</Title>
            
            <SystemsList
                systems={polycule.systems}
                setSystems={setPolycule && ((systems) => setPolycule({
                    ...polycule,
                    systems,
                }))}
            />

            <Title order={2}>Relationships</Title>

            <RelationshipsList
                relationships={polycule.relationships}
                setRelationships={setPolycule && ((relationships) => setPolycule({
                    ...polycule,
                    relationships,
                }))}
            />
        </Stack>
    )
};
