import { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'
import { DATABASE_PATH } from "./config.ts";
import { Polycule } from "@app/common";

export type PolyculeEntry = {
    polycule: Polycule;
    viewPassword?: string;
    editPassword?: string;
    lastUpdated?: number;
};

export type Database = {
    polycules: Record<string, PolyculeEntry>;
};

export const low: Low<Database> = await JSONFilePreset<Database>(DATABASE_PATH, {
    polycules: {},
});

export const db = {
    getPolycule: async (id: string) => low.data.polycules[id],
    setPolycule: async (id: string, poly: PolyculeEntry) => await low.update((d) => {
        poly.lastUpdated = Date.now();
        d.polycules[id] = poly;
    }),
};
