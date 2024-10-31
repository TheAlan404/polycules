import { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { PolyculeContext } from "../context/PolyculeContext";
import { BackgroundGrid, GlobalTransformProvider, Position, useGlobalTransform, usePanning, WorkspaceView } from "@alan404/react-workspace";
import { Paper, Text } from "@mantine/core";
import { useThrottledState } from "@mantine/hooks";
import { View } from "./View";
import { SystemBackground } from "./SystemBackground";
import { SystemMember } from "./SystemMember";
import { Links } from "./Links";
import { avgPos, GraphLink, GraphNode } from "./types";

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

    const { ref, isPanning } = usePanning<HTMLDivElement>();

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
        const nodes: GraphNode[] = [];
        const headmateLinks: GraphLink[] = [];
        const relationshipLinks: GraphLink[] = [];

        for (let system of polycule.systems) {
            nodes.push({
                id: system.id,
                type: "system",
                color: system.color || "#ffffff",
                label: system.name || "",
            })

            for (let member of system.members) {
                const memberId = `${system.id}-${member.id}`;

                nodes.push({
                    id: memberId,
                    type: "member",
                    color: member.color || system.color || "#ffffff",
                    label: member.name,
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

        for (let relationship of polycule.relationships) {
            relationshipLinks.push({
                source: relationship.a,
                target: relationship.b,
            });
        }

        sim.current.nodes(nodes);
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

    const systemLinks = links.filter(x => (
        (x.source as GraphNode).type == "system" || (x.target as GraphNode).type == "system"
    ))
    
    const nonSystemLinks = links.filter(x => (
        (x.source as GraphNode).type == "member" && (x.target as GraphNode).type == "member"
    ))

    return (
        <Paper
            withBorder
            h="100%"
            pos="relative"
            style={{
                cursor: isPanning ? "grabbing" : "auto",
                touchAction: "manipulation",
            }}
            ref={ref}
        >
            <Links
                links={systemLinks}
                nodes={nodes}
                stroke="var(--mantine-color-gray-filled)"
                strokeWidth={8}
            />

            <View>
                {polycule.systems.map(system => (
                    <SystemBackground
                        nodes={nodes}
                        system={system}
                        key={system.id}
                    />
                ))}
            </View>

            <Links
                links={nonSystemLinks}
                nodes={nodes}
                stroke="var(--mantine-color-gray-filled)"
                strokeWidth={8}
            />

            <View>
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
            </View>
        </Paper>
    )
};


