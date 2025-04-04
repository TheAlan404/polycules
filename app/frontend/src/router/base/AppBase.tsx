import { AppShell, Burger, Group } from "@mantine/core"
import { Outlet } from "react-router-dom"
import { useDisclosure } from "@mantine/hooks"

export const AppBase = () => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 0 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        >
            {/* <AppShell.Header>
                <Group h="100%" px="xs">
                    <Group w="100%" justify="space-between" wrap="nowrap">
                        <Group wrap="nowrap">
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

                        </Group>

                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
            </AppShell.Navbar> */}


            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
