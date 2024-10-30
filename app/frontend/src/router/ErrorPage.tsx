import { Button, Stack } from "@mantine/core";
import { Link, useRouteError } from "react-router-dom";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";

export const ErrorPage = () => {
    const [t] = useTranslation();
    const error: any = useRouteError() ?? "An unknown error occurred.";

    return (
        <Stack justify="center" align="center" style={{ height: "100vh" }}>
            <ErrorMessage error={ error.error !== undefined ? error.error : error } />
            <Button
                component={Link}
                to="/"
                leftSection={<IconArrowLeft />}
                variant="light"
            >
                {t("gohome")}
            </Button>
        </Stack>
    );
};
