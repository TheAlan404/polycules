import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const BeforeEditSection = ({
    onEnterEdit,
    editPassword,
    setEditPassword,
}: {
    onEnterEdit?: () => void;
    editPassword: string;
    setEditPassword: (e: string) => void;
}) => {
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [passwordChecking, setPasswordChecking] = useState(false);
    const tryEnterEdit = async () => {
        setPasswordChecking(true);
        setError(null);
        try {
            let res = await (await fetch(`/api/polycules/${id}/passwordCheck?${new URLSearchParams({
                editPassword
            })}`)).json() as { error: string } | boolean;

            if (typeof res == "object") return setError(res.error);
            else if (res) {
                onEnterEdit?.();
            } else {
                setError("Incorrect password");
            }
        } catch (e: any) {
            setError(e.toString() as string);
            console.log(e);
        } finally {
            setPasswordChecking(false);
        }
    };

    return (
        <Stack>
            <Text c="red">
                {error}
            </Text>

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
    )
};
