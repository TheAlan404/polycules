import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { PolyculeContext } from "../../../components/context/PolyculeContext";
import { Space, Stack } from "@mantine/core";
import { SystemsList } from "../../../components/editor/SystemsList";
import { Polycule } from "@app/common";
import { RelationshipsList } from "../../../components/editor/RelationshipsList";
import { PolyculeManager } from "../../../components/editor/PolyculeManager";

export const PolyculePage = () => {
    const { id } = useParams();
    //const { polycule } = useContext(PolyculeContext);


    const [polycule, setPolycule] = useState<Polycule>({
        systems: [
            {
                id: "sea",
                name: "sea",
                color: "blue",
                members: [
                    { id: "1", name: "1 / aelita", color: "pink" },
                    { id: "2", name: "2", color: "blue" },
                ]
            },
            {
                id: "asdf",
                name: "",
                color: "orange",
                members: [
                    { id: "0", name: "krepi", color: "orange" },
                ]
            },
            {
                id: "serra",
                name: "flake",
                members: [
                    { id: "syl", name: "sylvia" },
                    { id: "cos", name: "cosmo" },
                ]
            }
        ],
        relationships: [
            { a: "asdf-0", b: "sea-1" },
            { a: "serra-cos", b: "sea" },
        ]
    });


    return (
        <Stack align="center">
            <Stack w="50vw" pt="md">
                <PolyculeContext.Provider
                    value={{
                        polycule,
                        setPolycule,
                    }}
                >
                    <PolyculeManager />
                </PolyculeContext.Provider>
            </Stack>

            <Space h="50vh" />
        </Stack>
    )
};
