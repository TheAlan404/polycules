import { Polycule, PolyculePerson, PolyculeRelationship, PolyculeSystem } from "@app/common";

export const randId = () => Math.random().toString(36).slice(2);

const singlet = (p: PolyculePerson): PolyculeSystem => ({
	id: p.id,
	members: [p],
	name: p.name,
	color: p.color,
});

const member = (name: string, color?: string): PolyculePerson => ({
    id: randId(),
    name,
    color,
});

const singletId = (sys: PolyculeSystem) => `${sys.id}-${sys.id}`;

const rel = (a: { id: string } | string, b: { id: string } | string, label?: string): PolyculeRelationship => ({
    a: typeof a == "string" ? a : a.id,
    b: typeof b == "string" ? b : b.id,
    label,
});

export const SpecialPolycules: Map<string, () => Polycule> = new Map([
	["default", () => {
        let john = member("John", "#008dea");
        let michael = member("Michael", "#3f2d8d");
		let sys1 = {
			id: randId(),
            name: "exampsys",
			members: [
                john,
                michael,
			],
		};

        let sys2 = singlet(member("Luna", "#fbea6c"));
        let sys3 = singlet(member("Lilith", "#2c3850"));
        let sys4 = singlet(member("Willow", "#2c3850"));
        let sys5 = singlet(member("Emma", "#d490b3"));

		return {
			systems: [
                sys1,
                sys2,
                sys3,
                sys4,
                sys5,
			],
			relationships: [
                rel(singletId(sys2), `${sys1.id}-${michael.id}`),
                rel(`${sys1.id}-${john.id}`, singletId(sys3)),
                rel(sys1, singletId(sys4)),
                rel(singletId(sys3), singletId(sys5)),
			],
		};
	}],
]);
