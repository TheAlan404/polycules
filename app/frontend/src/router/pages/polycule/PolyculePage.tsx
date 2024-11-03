import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PolyculeContext } from "../../../components/context/PolyculeContext";
import { Box, Button, CopyButton, Drawer, Group, JsonInput, ScrollArea, Space, Stack, Text, TextInput } from "@mantine/core";
import { Polycule } from "@app/common";
import { PolyculeManager } from "../../../components/editor/PolyculeManager";
import { PolyculeRenderer } from "../../../components/renderer/PolyculeRenderer";
import { GlobalTransformProvider } from "@alan404/react-workspace";
import { useDisclosure, useFetch } from "@mantine/hooks";
import { IconListDetails, IconPencil, IconShare } from "@tabler/icons-react";
import { UploadSection } from "./UploadSection";
import { BeforeEditSection } from "./BeforeEditSection";

export const PolyculePage = () => {
    const { id } = useParams();
    

    const [_editing, setEditing] = useState(false);
    const editing = id == "new" || _editing;

    const [opened, { open, close }] = useDisclosure(false);

    const [error, setError] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);
    const [_ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [editPassword, setEditPassword] = useState("");
    
    const [polycule, setPolycule] = useState<Polycule>({
        relationships: [],
        systems: [],
    });

    useEffect(() => {
        (async () => {
            if(id !== "new") {
                setLoading(true);
                setReady(false);
                try {
                    let res: { error: string } | Polycule = await (await fetch(`/api/polycules/${id}`)).json();

                    if("error" in res) {
                        setError(res.error);
                    } else {
                        setPolycule(res);
                        setReady(true);
                    }
                } catch(e: any) {
                    setError(e.toString() as string);
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            };
        })()
    }, [id]);

    const ready = (id == "new" ? true : (_ready && !loading));

    return (
        <Stack h="calc(100vh)" style={{ overflow: "clip" }}>
            <PolyculeContext.Provider
                value={{
                    polycule,
                    setPolycule: editing ? ((p) => {
                        setPolycule(p);
                        setDirty(true);
                    }) : undefined,
                }}
            >
                <GlobalTransformProvider>
                    <PolyculeRenderer />
                </GlobalTransformProvider>

                <Text
                    c="red"
                    p="md"
                    style={{
                        position: "absolute",
                        top: "0px",
                        zIndex: 100,
                    }}
                >
                    {error}
                </Text>

                

                <Group
                    style={{
                        position: "absolute",
                        bottom: "0px",
                        zIndex: 100,
                    }}
                    mb="md"
                    ml="md"
                >
                    <Button
                        variant="light"
                        leftSection={editing ? <IconPencil /> : <IconListDetails />}
                        onClick={open}
                        loading={!ready}
                    >
                        {editing ? "Edit" : "View"}
                    </Button>

                    {id !== "new" && (
                        <CopyButton
                            value={`https://poly.deniz.blue/${id}`}
                        >
                            {({ copied, copy }) => (
                                <Button
                                    color={copied ? "green" : "gray"}
                                    leftSection={<IconShare />}
                                    onClick={copy}
                                    variant="light"
                                >
                                    {copied ? "Link Copied!" : "Share"}
                                </Button>
                            )}
                        </CopyButton>
                    )}
                </Group>

                <Drawer
                    opened={opened}
                    onClose={close}
                    size="lg"
                    scrollAreaComponent={ScrollArea.Autosize}
                    title={editing ? "Edit Polycule" : "View Polycule"}
                >
                    <PolyculeManager>
                        <Stack>
                            {editing ? (
                                <UploadSection
                                    editPassword={editPassword}
                                    onUploadComplete={() => setEditing(false)}
                                />
                            ) : (
                                <BeforeEditSection
                                    editPassword={editPassword}
                                    setEditPassword={setEditPassword}
                                    onEnterEdit={() => setEditing(true)}
                                />
                            )}
                        </Stack>
                    </PolyculeManager>
                </Drawer>
            </PolyculeContext.Provider>
        </Stack>
    )
};
