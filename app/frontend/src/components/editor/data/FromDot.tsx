import { Button, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useContext, useState } from "react";
import { PolyculeContext } from "../../context/PolyculeContext";
import { Polycule } from "@app/common";
import { randId } from "../../../utils";

export const parseFromDot = (dot: string) => {
    const nodes: { id: string; label: string }[] = [];
    const links: { a: string; b: string; label: string }[] = [];

    let peopleFinished = false;
    for(let line of dot
        .replace(/\r/g, "")
        .split("\n")
        .map(x => x.trim())) {
        
        if(line == "graph polycule {") continue;
        if(line == "}") continue;
        if(!line) {
            peopleFinished = true;
            continue;
        };

        if(peopleFinished) {
            let [nodeA, _, nodeB, ...ex] = line.split(" ");
            let extra = ex.join(" ");
            extra = extra.substring(1, extra.length - 1);
            let props = Object.fromEntries(
                extra.split(",").map(x => x.split("=") as [string, string])
            );

            links.push({
                a: nodeA,
                b: nodeB,
                label: props["label"] || "",
            });
        } else {
            let id = line.split(" ")[0];
            let label = line.split("=\"")[1];
            label = label.slice(0, label.length - 2);
            nodes.push({ id, label });
        }
    }

    let polycule: Polycule = {
        relationships: [],
        systems: [],
    };

    let idMap: Record<string, string> = {};
    let idOf = (s: string) => idMap[s] || (idMap[s] = randId());

    for(let node of nodes) {
        let id = idOf(node.id);
        polycule.systems.push({
            id,
            name: node.label,
            members: [
                { id, name: node.label }
            ],
        });
    }

    for(let link of links) {
        polycule.relationships.push({
            a: `${idOf(link.a)}-${idOf(link.a)}`,
            b: `${idOf(link.b)}-${idOf(link.b)}`,
            label: link.label,
        });
    }

    return polycule;
};

export const FromDot = () => {
    const { setPolycule } = useContext(PolyculeContext);
    const [value, setValue] = useState("");
    const [error, setError] = useState<any>();

    return (
        <Stack>
            <Textarea
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                autosize
            />

            {error && (
                <Text c="red">
                    Error: {error?.toString?.() || error}
                </Text>
            )}

            <Button
                variant="light"
                onClick={() => {
                    try {
                        let poly = parseFromDot(value);
                        setPolycule?.(poly);
                    } catch(e) {
                        console.error(e);
                        setError(e);
                    }
                }}
            >
                Import!
            </Button>
        </Stack>
    )
};
