import { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { PolyculeContext } from "../context/PolyculeContext";
import { BackgroundGrid, GlobalTransformProvider, Position, useGlobalTransform, useMousePosition, usePanning, useScaling, vec2round, WorkspaceView } from "@alan404/react-workspace";
import { ActionIcon, Box, Button, Group, Paper, Text } from "@mantine/core";
import { SystemBackground } from "./SystemBackground";
import { SystemMember } from "./SystemMember";
import { Links } from "./Links";
import { avgPos, GraphLink, GraphNode, RenderedLink, vec2 } from "./types";
import { IconCrosshair } from "@tabler/icons-react";

const createSystemsForce = () => {
    let nodes: GraphNode[] = [];
    const force: d3.Force<GraphNode, GraphLink> = () => {
        for (let systemNode of nodes.filter(x => x.type == "system")) {
            let childNodes = nodes.filter(x => x.type == "member" && x.id.split("-")[0] == systemNode.id);
            let { x, y } = avgPos(childNodes);

            systemNode.vx! = 0;
            systemNode.vy! = 0;
            systemNode.x! = x;
            systemNode.y! = y;
        }
    };

    force.initialize = (n: GraphNode[]) => {
        nodes = n;
    };

    return force;
};

export const PolyculeRenderer = () => {
    const { polycule } = useContext(PolyculeContext);
    const [{ nodes, links }, setRendered] = useState<{
        nodes: GraphNode[];
        links: d3.SimulationLinkDatum<GraphNode>[];
    }>({ nodes: [], links: [] });

    const ref = useRef<HTMLDivElement | null>(null);

    const isPanning = usePanning(ref);
    useScaling(ref);

    const relationshipsForce = useRef(useMemo(() => (
        d3.forceLink<GraphNode, GraphLink>()
            .id(({id}) => id)
            .distance(300)
    ), []));
    
    const headmatesForce = useRef(useMemo(() => (
        d3.forceLink<GraphNode, GraphLink>()
            .id(({id}) => id)
            .distance(80)
    ), []));

    const sim = useRef<d3.Simulation<GraphNode, GraphLink>>(
        useMemo(() => (
            d3.forceSimulation<GraphNode>()
                .force("relationships", relationshipsForce.current)
                .force("headmates", headmatesForce.current)
                .force("charge", d3.forceManyBody<GraphNode>()
                    .strength((node) => node.type == "system" ? 0 : -50))
                //.force("colission", d3.forceCollide<GraphNode>((node) => node.type == "member" ? 20 : 0))
                .force("center", d3.forceCenter())
                .force("system", createSystemsForce())
        ), [])
    );

    useEffect(() => {
        const onTick = () => {
            setRendered({
                nodes: sim.current!.nodes(),
                links: relationshipsForce.current!.links(),
            });
        };

        sim.current.on("tick", onTick);

        return () => void sim.current.stop();
    }, []);

    useEffect(() => {
        const graphNodes: GraphNode[] = [];
        const headmateLinks: GraphLink[] = [];
        const relationshipLinks: GraphLink[] = [];

        for (let system of polycule.systems) {
            let existingNode = nodes.find(x => x.type == "system" && x.id == system.id);

            graphNodes.push({
                id: system.id,
                type: "system",
                color: system.color || "#ffffff",
                label: system.name || "",
                x: existingNode?.x,
                vx: existingNode?.vx,
                y: existingNode?.y,
                vy: existingNode?.vy,
            })

            for (let member of system.members) {
                const memberId = `${system.id}-${member.id}`;

                let existingNode = nodes.find(x => x.type == "member" && x.id == memberId);

                graphNodes.push({
                    id: memberId,
                    type: "member",
                    color: member.color || system.color || "#ffffff",
                    label: member.name,
                    x: existingNode?.x,
                    vx: existingNode?.vx,
                    y: existingNode?.y,
                    vy: existingNode?.vy,
                });

                for (let headmate of system.members) {
                    let source = memberId;
                    let target = `${system.id}-${headmate.id}`;
                    if (headmateLinks.some(link => link.source == target && link.target == source))
                        continue;
                    headmateLinks.push({
                        source,
                        target,
                    });
                }
            }
        }

        const existingIds = new Set(graphNodes.map(x => x.id));
        for (let relationship of polycule.relationships) {
            if(!existingIds.has(relationship.a) || !existingIds.has(relationship.b)) continue;
            relationshipLinks.push({
                source: relationship.a,
                target: relationship.b,
            });
        }

        sim.current.nodes(graphNodes);
        relationshipsForce.current.links(relationshipLinks);
        headmatesForce.current.links(headmateLinks);
        console.log("Simulation updated");
        rerender();
    }, [polycule]);

    const rerender = () => {
        sim.current.alphaTarget(1);
        sim.current.restart();
        setRendered({
            nodes: sim.current!.nodes(),
            links: relationshipsForce.current!.links(),
        });
    };

    const bothSystemLinks: RenderedLink[] = [];
    const eitherSystemLinks: RenderedLink[] = [];
    const bothMemberLinks: RenderedLink[] = [];

    const systemRadiuses: Record<string, number> = {};
    for(let node of nodes) {
        if(node.type == "member") continue;
        let members = nodes.filter(x => x.type == "member" && x.id.split("-")[0] == node.id);
        systemRadiuses[node.id] = Math.sqrt(Math.max(...members.map(x => (
            ((x.x || 0) - (node.x || 0)) ** 2 + ((x.y || 0) - (node.y || 0)) ** 2
        )))) + 40
    }

    for(let link of links) {
        let source = (link.source as GraphNode);
        let target = (link.target as GraphNode);

        if(source.type == "system" && target.type == "system") {
            //bothSystemLinks.push(link);
            bothSystemLinks.push({
                a: vec2(source),
                b: vec2(target),
            });
        } else if(source.type == "member" && target.type == "member") {
            //bothMemberLinks.push(link);
            bothMemberLinks.push({
                a: vec2(source),
                b: vec2(target),
            });
        } else {
            //eitherSystemLinks.push(link);

            let member = source.type == "member" ? source : target;
            let system = source.type == "system" ? source : target;

            let r = systemRadiuses[system.id];
            let ang = Math.atan2(
                (system.y || 0) - (member.y || 0),
                (system.x || 0) - (member.x || 0),
            );
            
            eitherSystemLinks.push({
                a: vec2(member),
                b: vec2(
                    (system.x || 0) - Math.cos(ang) * r,
                    (system.y || 0) - Math.sin(ang) * r,
                ),
                color: system.color,
            });
        }
    }

    return (
        <Paper
            h="100%"
            pos="relative"
            style={{
                cursor: isPanning ? "grabbing" : "auto",
                touchAction: "manipulation",
            }}
            ref={ref}
        >
            <div className="bugfix">
                <BackgroundGrid
                />
            </div>

            <Links
                links={bothSystemLinks}
                stroke="var(--mantine-color-gray-filled)"
                strokeWidth={8}
            />

            <WorkspaceView>
                {polycule.systems.map(system => (
                    <SystemBackground
                        system={system}
                        radius={systemRadiuses[system.id]}
                        position={vec2(nodes.find(x => x.id == system.id))}
                        key={system.id}
                    />
                ))}
            </WorkspaceView>

            <Links
                links={bothMemberLinks}
                stroke="var(--mantine-color-gray-filled)"
                strokeWidth={8}
            />

            <Links
                links={eitherSystemLinks}
                stroke="var(--mantine-color-gray-filled)"
                strokeWidth={8}
            />

            <WorkspaceView>
                {polycule.systems.map(system => (
                    system.members.map((member) => (
                        <SystemMember
                            key={`${system.id}-${member.id}`}
                            member={member}
                            system={system}
                            nodes={nodes}
                            onDrag={({ x, y }) => {
                                let node = nodes.find(x => x.id == `${system.id}-${member.id}`);
                                if(!node) return;
                                node.fx = x;
                                node.fy = y;
                                rerender();
                            }}
                            onDragEnd={() => {
                                let node = nodes.find(x => x.id == `${system.id}-${member.id}`);
                                if(!node) return;
                                let i = nodes.indexOf(node);
                                nodes[i].fx = null;
                                nodes[i].fy = null;
                                rerender();
                            }}
                        />
                    ))
                ))}
            </WorkspaceView>

            <PositionOverlay />
        </Paper>
    )
};

export const PositionOverlay = () => {
    const { position, scale, reset } = useGlobalTransform();
    const mouse = vec2round(useMousePosition());

    return (
        <Box w="100%" style={{ position: "fixed", bottom: 0 }}>
            <Group justify="center" pb="xs">
                <Text c="dimmed" ta="center" fz="sm">
                    ({position.x}, {position.y}) {scale.toString().slice(0, 3)}x
                    <br />
                    Mouse: ({mouse.x}, {mouse.y})
                </Text>

                <ActionIcon
                    variant="light"
                    color="dark"
                    onClick={reset}
                >
                    <IconCrosshair />
                </ActionIcon>
            </Group>
        </Box>
    )
}
