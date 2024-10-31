import { TransformProvider } from "@alan404/react-workspace";
import { PolyculeSystem } from "@app/common";
import { GraphNode, avgPos } from "./types";
import { Text } from "@mantine/core";

export const SystemBackground = ({
    system, nodes,
}: {
    system: PolyculeSystem;
    nodes: GraphNode[];
}) => {
    let childNodes = nodes.filter(n => n.type == "member" && n.id.split("-")[0] == system.id);
    let avgPoint = avgPos(childNodes);
    let radius = Math.sqrt(Math.max(...childNodes.map(x => (
        ((x.x || 0) - avgPoint.x) ** 2 + ((x.y || 0) - avgPoint.y) ** 2
    )))) + 40;

    if (system.members.length == 1) return;

    return (
        <TransformProvider
            position={{
                x: avgPoint.x - radius,
                y: avgPoint.y - radius,
            }}
        >
            <div
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    backgroundColor: (system.color || "#aaaaaa") + "66",
                    borderRadius: radius,
                }}
            />
            <Text
                fz="sm"
                ta="center"
                style={{
                    textWrap: "nowrap",
                    position: "absolute",
                    top: `${radius*2}px`,
                    width: `${radius*2}px`,
                    userSelect: "none",
                }}
            >
                {system.name}&
            </Text>
        </TransformProvider>
    );
};
