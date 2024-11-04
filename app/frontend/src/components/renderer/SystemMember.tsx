import { getMouseButtons, Position, TransformProvider, useGlobalTransform, useRelativeDrag, vec2 } from "@alan404/react-workspace";
import { PolyculeSystem, PolyculePerson } from "@app/common";
import { Stack, Avatar, Text } from "@mantine/core";
import { GraphNode } from "./types";
import { useRef } from "react";

export const SystemMember = ({
    system, member, nodes, onDrag, onDragEnd,
}: {
    system: PolyculeSystem;
    member: PolyculePerson;
    nodes: GraphNode[];
    onDrag: (pos: Position) => void;
    onDragEnd: () => void;
}) => {
    const memberId = `${system.id}-${member.id}`;
    const node = nodes.find(x => x.id == memberId);

    const ref = useRef<HTMLDivElement | null>(null);
    const { isDragging } = useRelativeDrag(ref, {
        onDrag,
        onDragEnd,
        position: vec2(node?.x, node?.y),
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
            >
                <Avatar
                    name={node.label}
                    color={node.color}
                    variant={"filled"}
                    style={{
                        touchAction: "manipulation",
                        cursor: isDragging ? "grabbing" : "grab",
                        outline: isDragging ? "solid var(--mantine-color-blue-outline)" : "",
                        outlineOffset: "4px",
                    }}
                    ref={ref}
                />
                <Text
                    fz="sm"
                    style={{
                        textWrap: "nowrap",
                        position: "absolute",
                        top: "40px",
                        userSelect: "none",
                    }}
                >
                    {node.label}
                </Text>
            </Stack>
        </TransformProvider>
    );
};





