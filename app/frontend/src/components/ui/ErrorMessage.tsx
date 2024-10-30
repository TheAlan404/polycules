import { Box, Button, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconReload } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const ErrorMessage = ({
    error,
    retry,
    short,
}: {
    error?: any;
    retry?: () => void;
    short?: boolean;
}) => {
    const [t] = useTranslation();

    return (
        <Box>
            {error && (
                <Stack align="center">
                    {!short && <IconAlertTriangle />}
                    <Stack gap={0} align="center">
                        {!short && <Text fw="bolder" c="yellow">{t("error")}</Text>}
                        <Text onClick={() => short && retry?.()}>{error.toString()}</Text>
                    </Stack>
                    {!short && retry && (
                        <Button
                            variant="light"
                            
                            size="compact-sm"
                            leftSection={<IconReload />}
                            onClick={() => retry()}
                        >
                            {t("retry")}
                        </Button>
                    )}
                </Stack>
            )}
        </Box>
    );
};
