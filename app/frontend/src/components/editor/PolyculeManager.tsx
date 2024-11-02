import { JsonInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { SystemsList } from "./SystemsList";
import { PropsWithChildren, useContext, useState } from "react";
import { PolyculeContext } from "../context/PolyculeContext";

export const PolyculeManager = ({
    children
}: PropsWithChildren) => {
    const { polycule, setPolycule } = useContext(PolyculeContext);

    let singletCount = 0;
    let systemCount = 0;
    let peopleCount = 0;
    for(let system of polycule.systems) {
        if(system.members.length == 1) {
            singletCount++;
            peopleCount++;
            continue;
        }
        systemCount++;
        peopleCount += system.members.length;
    }

    const p = (x: number) => x == 1 ? "" : "s";

    return (
        <Stack pb="xl">
            <Text c="dimmed">
                {peopleCount} people; {singletCount} singlet{p(singletCount)} and {systemCount} system{p(systemCount)} - {polycule.relationships.length} relationships total
            </Text>

            <SystemsList
                systems={polycule.systems}
                setSystems={setPolycule && ((systems) => setPolycule({
                    ...polycule,
                    systems,
                }))}
            />

            {children}
        </Stack>
    )
};
