import { PolyculeSystem } from "@app/common";
import { Button, Stack } from "@mantine/core";
import { SystemCard } from "./SystemCard";
import { IconPlus } from "@tabler/icons-react";
import { randId } from "../../utils";

export const SystemsList = ({
    systems,
    setSystems,
}: {
    systems: PolyculeSystem[];
    setSystems?: (systems: PolyculeSystem[]) => void;
}) => {
    return (
        <Stack py="md">
            {systems.map((system) => (
                <SystemCard
                    system={system}
                    setSystem={setSystems && ((sys) => {
                        setSystems(systems.map(x => x.id == system.id ? sys : x));
                    })}
                    onDelete={() => {
                        setSystems?.(systems.filter(x => x.id !== system.id));
                    }}
                    key={system.id}
                />
            ))}

            {setSystems && (
                <Button
                    variant="light"
                    leftSection={<IconPlus />}
                    fullWidth
                    color="gray"
                    onClick={() => setSystems([...systems, {
                        id: randId(),
                        members: [{ id: randId(), name: "New person" }],
                    }])}
                >
                    Add new person
                </Button>
            )}
        </Stack>
    )
};
