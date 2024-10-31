import { Position, TransformProvider, useRelativeDrag } from "@alan404/react-workspace";
import { PolyculeSystem, PolyculePerson } from "@app/common";
import { Stack, Avatar, Text } from "@mantine/core";
import { GraphNode } from "./types";

export const SystemMember = ({
    system, member, nodes, onDrag,
}: {
    system: PolyculeSystem;
    member: PolyculePerson;
    nodes: GraphNode[];
    onDrag: (pos: Position) => void;
}) => {
    const memberId = `${system.id}-${member.id}`;
    const node = nodes.find(x => x.id == memberId);

    const { props } = useRelativeDrag({
        onChange: onDrag,
        value: {
            x: node?.x || 0,
            y: node?.y || 0,
        },
    });


    if (!node) return;

    return (
        <TransformProvider
            position={{
                x: (node.x || 0) - 20,
                y: (node.y || 0) - 20,
            }}
            key={node.id}
        >
            <Stack
                gap={0}
                align="center"
                {...props}
            >
                <Avatar
                    name={node.label}
                    color={node.color}
                    variant="filled" />
                <Text
                    fz="sm"
                    style={{ textWrap: "nowrap" }}
                >
                    {node.label}
                </Text>
            </Stack>
        </TransformProvider>
    );
};
