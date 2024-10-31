import { Position } from "@alan404/react-workspace";

export interface GraphNode extends d3.SimulationNodeDatum {
    id: string;
    type: "system" | "member";
    color: string;
    label: string;
};

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    source: string;
    target: string;
};

const avg = (a: number[]) => a.reduce((acc, cur) => acc + cur, 0) / a.length;
export const avgPos = (nodes: GraphNode[]): Position => ({
    x: avg(nodes.map(x => x.x || 0)),
    y: avg(nodes.map(x => x.y || 0)),
});
