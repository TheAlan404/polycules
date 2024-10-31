import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { PolyculeContext } from "../../../components/context/PolyculeContext";
import { Box, Button, Drawer, JsonInput, ScrollArea, Space, Stack } from "@mantine/core";
import { SystemsList } from "../../../components/editor/SystemsList";
import { Polycule } from "@app/common";
import { RelationshipsList } from "../../../components/editor/RelationshipsList";
import { PolyculeManager } from "../../../components/editor/PolyculeManager";
import { PolyculeRenderer } from "../../../components/renderer/PolyculeRenderer";
import { GlobalTransformProvider } from "@alan404/react-workspace";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";

export const PolyculePage = () => {
    const { id } = useParams();
    //const { polycule } = useContext(PolyculeContext);


    const [opened, { open, close }] = useDisclosure(false);


    const [polycule, setPolycule] = useState<Polycule>({
        systems: [],
        relationships: []
    });


    return (
        <Stack h="calc(100vh - 60px)" style={{ overflow: "clip" }}>
            <PolyculeContext.Provider
                value={{
                    polycule,
                    setPolycule,
                }}
            >
                <GlobalTransformProvider>
                    <PolyculeRenderer />
                </GlobalTransformProvider>

                <Button
                    variant="light"
                    leftSection={<IconPencil />}
                    style={{
                        position: "absolute",
                        bottom: "0px",
                        zIndex: 100,
                    }}
                    mb="md"
                    ml="md"
                    onClick={open}
                >
                    Edit
                </Button>

                <Drawer
                    opened={opened}
                    onClose={close}
                    size="lg"
                    scrollAreaComponent={ScrollArea.Autosize}
                    title="Edit Polycule"
                >

                    <PolyculeManager />
                </Drawer>
            </PolyculeContext.Provider>
        </Stack>
    )
};
