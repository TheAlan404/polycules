import { createContext } from "react";
import { Polycule } from "@app/common";

export interface IPolyculeContext {
    polycule: Polycule;
    setPolycule?: (polycule: Polycule) => void;
};

export const PolyculeContext = createContext<IPolyculeContext>({
    polycule: {
        relationships: [],
        systems: [],
    },
});
