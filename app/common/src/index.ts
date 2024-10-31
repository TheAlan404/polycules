export type Polycule = {
    systems: PolyculeSystem[];
    relationships: PolyculeRelationship[];
};

export type PolyculeSystem = {
    id: string;
    name?: string;
    color?: string;
    members: PolyculePerson[];
};

export type PolyculePerson = {
    id: string;
    name: string;
    color?: string;
};

export type PolyculeRelationship = {
    a: string;
    b: string;
    label?: string;
};
