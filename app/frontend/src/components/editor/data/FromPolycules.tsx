import { Button, JsonInput, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useContext, useState } from "react";
import { PolyculeContext } from "../../context/PolyculeContext";
import { Polycule } from "@app/common";
import { randId } from "../../../utils";

type EsGraph = {
    lastId: string;
    nodes: EsNode[];
    links: EsLink[];
};

type EsLink = {
    source: EsNode;
    target: EsNode;
    color?: string;
    centerText?: string;
    strength?: number;
    dashed?: boolean;
};

type EsNode = {
    id: number;
    name: string;
    color?: string;
};

export const parseFromEs = (graph: EsGraph) => {
    let polycule: Polycule = {
        relationships: [],
        systems: [],
    };

    let idMap: Record<string, string> = {};
    let idOf = (s: number) => idMap[s+""] || (idMap[s+""] = randId());

    for(let node of graph.nodes) {
        let id = idOf(node.id);
        polycule.systems.push({
            id,
            name: node.name,
            color: node.color,
            members: [
                { id, name: node.name, color: node.color }
            ],
        });
    }

    for(let link of graph.links) {
        polycule.relationships.push({
            a: `${idOf(link.source.id)}-${idOf(link.source.id)}`,
            b: `${idOf(link.target.id)}-${idOf(link.target.id)}`,
            label: link.centerText,
        });
    }

    return polycule;
};

export const FromEs = () => {
    const { setPolycule } = useContext(PolyculeContext);
    const [value, setValue] = useState("");
    const [error, setError] = useState<any>();

    return (
        <Stack>
            <JsonInput
                value={value}
                onChange={(v) => setValue(v)}
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
                        let poly = parseFromEs(JSON.parse(value));
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
