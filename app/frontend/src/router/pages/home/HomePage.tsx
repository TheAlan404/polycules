import { Anchor, Button, Paper, Space, Stack, Text, Title } from "@mantine/core"
import { Link } from "react-router-dom"

export const HomePage = () => {
    return (
        <Stack w="100%" align="center">
            <Stack w={{ base: "100%", md: "70%" }} ta="center" pt="xl">
                <Paper withBorder h="50vh" radius="lg" style={{ overflow: "clip" }}>
                    <iframe
                        src="/default"
                        style={{
                            height: "100%",
                            width: "100%",
                            border: "none",
                        }}
                    />
                </Paper>

                <Button
                    component={Link}
                    to="/new"
                    variant="light"
                    color="green"
                >
                    Create a new polycule
                </Button>

                <Title>
                    deniz's Polycules
                </Title>

                <Text>
                    Inspired by <Anchor href="https://polycul.es/">
                        polycul.es
                    </Anchor>!
                </Text>
                
                <Text>
                    This version supports plurality :3
                </Text>
                
                <Text>
                    Please report bugs at the <Anchor href="https://github.com/TheAlan404/polycules">
                        GitHub Repository
                    </Anchor>
                </Text>
            </Stack>

            <Space h="50vh" />
        </Stack>
    )
}
