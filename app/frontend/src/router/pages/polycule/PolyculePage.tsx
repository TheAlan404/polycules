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


    const [polycule, setPolycule] = useState<Polycule>(

        {"systems":[{"id":"poaqg48dq0g","members":[{"id":"rr9jrr420y","name":"cyan","color":"#c1d929"},{"id":"fubueschn3o","name":"carmine","color":"#e64980"}],"name":"bismuth","color":"#40c057"},{"id":"4wp7246jq2u","members":[{"id":"26voktfdld5","name":"güz","color":"#fab005"},{"id":"hvpwniu47qh","name":"lily","color":"#1f6aab"}],"name":"ath"},{"id":"wi3ntogle1","members":[{"id":"emz0rbtf5be","name":"siya","color":"#be4bdb"}]},{"id":"c7aru6h2ti","members":[{"id":"y8h9vbl9bn","name":"emma","color":"#9e41b5"}]},{"id":"fwdzk13uwa9","members":[{"id":"xynqw6e3wwd","name":"evie","color":"#f56ed1"}]}],"relationships":[{"a":"poaqg48dq0g-rr9jrr420y","b":"4wp7246jq2u"},{"a":"poaqg48dq0g-fubueschn3o","b":"wi3ntogle1-emz0rbtf5be"},{"a":"poaqg48dq0g-fubueschn3o","b":"c7aru6h2ti-y8h9vbl9bn"},{"a":"fwdzk13uwa9-xynqw6e3wwd","b":"c7aru6h2ti-y8h9vbl9bn"}]}


    );


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
