import { JsonInput, Stack, TextInput, Title } from "@mantine/core";
import { SystemsList } from "./SystemsList";
import { useContext, useState } from "react";
import { PolyculeContext } from "../context/PolyculeContext";
import { RelationshipsList } from "./RelationshipsList";
import { FromDot } from "./data/FromDot";
import { FromEs } from "./data/FromPolycules";

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

            {/* <Title order={2}>Relationships</Title> */}

            <RelationshipsList
                relationships={polycule.relationships}
                setRelationships={setPolycule && ((relationships) => setPolycule({
                    ...polycule,
                    relationships,
                }))}
            />

            <Title order={2}>Import/Export</Title>

            <JsonInput
                value={JSON.stringify(polycule)}
                onChange={(e) => setPolycule?.(JSON.parse(e))}
            />
        </Stack>
    )
};
