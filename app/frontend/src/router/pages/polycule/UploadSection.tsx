import { useContext, useState } from "react";
import { PolyculeContext } from "../../../components/context/PolyculeContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Stack, Text, TextInput } from "@mantine/core";

export const UploadSection = ({
    onUploadComplete,
    editPassword,
}: {
    editPassword: string;
    onUploadComplete?: () => void;
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { polycule, setPolycule } = useContext(PolyculeContext);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [changeEditPassword, setChangeEditPassword] = useState("");

    const upload = async () => {
        setUploading(true);
        try {
            let res = await (await fetch(`/api/polycules/${id}?${new URLSearchParams({
                editPassword,
                setEditPassword: changeEditPassword,
                public: polycule.public ? "true" : "",
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

            if (res.error) return setUploadError(res.error);
            if (res.id && res.id !== id) {
                navigate(`/${res.id}`);
            } else {
                onUploadComplete?.();
            };
        } catch (e: any) {
            setUploadError(e.toString() as string);
            console.log(e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Stack>
            <Text c="red">
                {uploadError}
            </Text>

            <TextInput
                value={changeEditPassword}
                defaultValue={editPassword}
                onChange={e => setChangeEditPassword(e.currentTarget.value)}
                label="Change Editing Password"
                description="Set a password to edit at a future date"
            />

            <Checkbox
                label="Public"
                description="Allow this polycule to be listed in big visualisations"
                checked={polycule.public}
                onChange={(e) => setPolycule?.({
                    ...polycule,
                    public: e.currentTarget.checked,
                })}
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
    )
};
