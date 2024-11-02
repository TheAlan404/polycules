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

export interface RenderedLink {
    a: Position;
    b: Position;
    thickness?: number;
    color?: string;
};

const avg = (a: number[]) => a.reduce((acc, cur) => acc + cur, 0) / a.length;
export const avgPos = (nodes: GraphNode[]): Position => ({
    x: avg(nodes.map(x => x.x || 0)),
    y: avg(nodes.map(x => x.y || 0)),
});

export interface Vec2Constructor {
    (vec2?: Partial<Position>, _?: never): Position;
    (x?: number, y?: number): Position;
};

export const vec2: Vec2Constructor = (x, y) => {
    if(typeof x == "object") {
        return vec2(x.x, x.y);
    } else {
        return {
            x: x || 0,
            y: y || 0,
        };
    }
};

