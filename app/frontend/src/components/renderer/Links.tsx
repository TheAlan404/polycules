import { Position, useGlobalTransform } from "@alan404/react-workspace";
import { avgPos, GraphNode } from "./types";

export const Links = ({
    links,
    nodes,
    ...props
}: {
    links: d3.SimulationLinkDatum<GraphNode>[];
    nodes: GraphNode[];
} & JSX.IntrinsicElements["line"]) => {
    const { position, scale } = useGlobalTransform();

    const getSystemAveragePt = (id: string): Position => {
        let members = nodes.filter(x => x.type == "member" && x.id.split("-")[0] == id);
        return avgPos(members);
    };

    return (
        <svg
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}
        >
            {links.map((link, i) => {
                let a = (link.source as GraphNode);
                let b = (link.target as GraphNode);

                let pos1 = a.type == "member" ? {
                    x: a.x || 0,
                    y: a.y || 0,
                } : getSystemAveragePt(a.id);
                let pos2 = b.type == "member" ? {
                    x: b.x || 0,
                    y: b.y || 0,
                } : getSystemAveragePt(b.id);

                return (
                    <line
                        x1={(pos1.x * scale + position.x)}
                        x2={(pos2.x * scale + position.x)}
                        y1={(pos1.y * scale + position.y)}
                        y2={(pos2.y * scale + position.y)}
                        {...props}
                    />
                );
            })}
        </svg>
    )
};
