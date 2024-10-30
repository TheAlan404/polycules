import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { I18nextProvider } from "react-i18next";
import { BaseRouter } from "./router/router.tsx";
import i18n from "./i18n.ts";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/carousel/styles.css';
import './index.css'

const theme = createTheme({
	components: {
        Tooltip: {
            defaultProps: {
                color: "dark",
            },
            styles: {
                color: "var(--mantine-color-text)"
            }
        }
    }
});

createRoot(document.getElementById('root')!).render(
	<MantineProvider theme={theme} forceColorScheme="dark">
		<Notifications />
		<ModalsProvider>
			<I18nextProvider i18n={i18n} defaultNS={[]}>
				<BaseRouter />
			</I18nextProvider>
		</ModalsProvider>
	</MantineProvider>
)
