import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PolyculeContext } from "../../../components/context/PolyculeContext";
import { Box, Button, Drawer, Group, JsonInput, ScrollArea, Space, Stack, Text, TextInput } from "@mantine/core";
import { SystemsList } from "../../../components/editor/SystemsList";
import { Polycule } from "@app/common";
import { RelationshipsList } from "../../../components/editor/RelationshipsList";
import { PolyculeManager } from "../../../components/editor/PolyculeManager";
import { PolyculeRenderer } from "../../../components/renderer/PolyculeRenderer";
import { GlobalTransformProvider } from "@alan404/react-workspace";
import { useDisclosure, useFetch } from "@mantine/hooks";
import { IconListDetails, IconPencil } from "@tabler/icons-react";

export const PolyculePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [_editing, setEditing] = useState(false);
    const editing = id == "new" || _editing;

    const [opened, { open, close }] = useDisclosure(false);

    const [error, setError] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);
    const [_ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editPassword, setEditPassword] = useState("");
    const [changeEditPassword, setChangeEditPassword] = useState("");
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

    const [uploadError, setUploadError] = useState<string | null>(null);
    const upload = async () => {
        setUploading(true);
        try {
            let res = await (await fetch(`/api/polycules/${id}?${new URLSearchParams({
                editPassword,
                setEditPassword: changeEditPassword,
            })}`, {
                method: "POST",
                body: JSON.stringify(polycule),
                headers: [
                    ["Content-Type", "application/json"],
                ],
            })).json() as {
                error?: string;
                id?: string;
            };
    
            if(res.error) return setUploadError(res.error);
            if(res.id && res.id !== id) {
                navigate(`/${res.id}`);
            } else {
                setEditing(false);
            };
        } catch(e: any) {
            setError(e.toString() as string);
            console.log(e);
        } finally {
            setUploading(false);
        }
    };

    const [passwordChecking, setPasswordChecking] = useState(false);
    const tryEnterEdit = async () => {
        setPasswordChecking(true);
        setUploadError(null);
        try {
            let res = await (await fetch(`/api/polycules/${id}/passwordCheck?${new URLSearchParams({
                editPassword
            })}`)).json() as { error: string } | boolean;
    
            if(typeof res == "object") return setUploadError(res.error);
            else if(res) {
                setEditing(true);
            } else {
                setUploadError("Incorrect password");
            }
        } catch(e: any) {
            setUploadError(e.toString() as string);
            console.log(e);
        } finally {
            setPasswordChecking(false);
        }
    };

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

                <Button
                    variant="light"
                    leftSection={editing ? <IconPencil /> : <IconListDetails />}
                    style={{
                        position: "absolute",
                        bottom: "0px",
                        zIndex: 100,
                    }}
                    mb="md"
                    ml="md"
                    onClick={open}
                    loading={!ready}
                >
                    {editing ? "Edit" : "View"}
                </Button>

                <Drawer
                    opened={opened}
                    onClose={close}
                    size="lg"
                    scrollAreaComponent={ScrollArea.Autosize}
                    title={editing ? "Edit Polycule" : "View Polycule"}
                >
                    <PolyculeManager>
                        <Stack>
                            <Text c="red">
                                {uploadError}
                            </Text>
                            {editing ? (
                                <Stack>
                                    <TextInput
                                        value={changeEditPassword}
                                        defaultValue={editPassword}
                                        onChange={e => setChangeEditPassword(e.currentTarget.value)}
                                        label="Change Editing Password"
                                        description="Set a password to edit at a future date"
                                    />

                                    <Button
                                        loading={uploading}
                                        onClick={upload}
                                        variant="light"
                                        color="green"
                                    >
                                        Save
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack>
                                    <TextInput
                                        value={editPassword}
                                        onChange={e => setEditPassword(e.currentTarget.value)}
                                        label="Edit Password"
                                        description="Type in the password you entered while editing the polycule"
                                    />

                                    <Button
                                        loading={passwordChecking}
                                        variant="light"
                                        onClick={tryEnterEdit}
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </PolyculeManager>
                </Drawer>
            </PolyculeContext.Provider>
        </Stack>
    )
};
