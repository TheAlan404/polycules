import { Polycule, PolyculePerson, PolyculeRelationship, PolyculeSystem } from "@app/common";
import { db } from "./db";

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

export const SpecialPolycules: Map<string, () => Promise<Polycule>> = new Map([
	["default", async () => {
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

    ["all", async () => {
        let usedSystemIds = new Set<string>();

        let systems: PolyculeSystem[] = [];
        let relationships: PolyculeRelationship[] = [];

        for(let [id, { polycule }] of await db.getAllPublic()) {
            let realSystemIdMap = new Map<string, string>();
            const realSystemId = (id: string) => {
                if(realSystemIdMap.has(id)) return realSystemIdMap.get(id)!;
                if(usedSystemIds.has(id)) {
                    let newId = randId();
                    realSystemIdMap.set(id, newId);
                    return newId;
                } else {
                    realSystemIdMap.set(id, id);
                    return id;
                }
            };

            for(let system of polycule.systems) {
                systems.push({
                    id: realSystemId(system.id),
                    members: system.members,
                    color: system.color,
                    name: system.name,
                });
            }

            const realId = (id: string) => id.includes("-") ? (
                `${realSystemId(id.split("-")[0])}-${id.split("-")[1]}`
            ) : (
                realSystemId(id)
            );
            for(let rel of polycule.relationships) {
                relationships.push({
                    a: realId(rel.a),
                    b: realId(rel.b),
                    label: rel.label,
                });
            }
        }

        return {
            relationships,
            systems,
        };
    }],
]);
