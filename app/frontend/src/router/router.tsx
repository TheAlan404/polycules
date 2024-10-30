import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ErrorPage } from "./ErrorPage";
import { AppBase } from "./base/AppBase";
import { HomePage } from "./pages/home/HomePage";
import { PolyculePage } from "./pages/polycule/PolyculePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppBase />,
        errorElement: <ErrorPage />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: ":id",
                        element: <PolyculePage />,
                    },
                ],
            }
        ],
    }
]);

export const BaseRouter = () => {
    return (
        <RouterProvider
            router={router}
            future={{
                v7_startTransition: true,
            }}
        />
    )
}
