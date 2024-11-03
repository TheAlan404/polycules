import express from 'express';
import cors from 'cors';
import { existsSync } from "node:fs";
import { ADDR, DIST_FOLDER, PORT } from "./config";
import { db, PolyculeEntry } from "./db";
import { v4, validate } from "uuid";
import { SpecialPolycules } from "./special";
import path from "node:path";

const app = express();

app.use(cors());
app.use(express.json());

if (existsSync(DIST_FOLDER)) {
	console.log("Serving: ", DIST_FOLDER);
	app.use(express.static(DIST_FOLDER));
};

app.get("/api/polycules/:id", async (req, res) => {
	let { id } = req.params;
	let { viewPassword } = req.query;

	if(SpecialPolycules.has(id)) {
		return res.json(await SpecialPolycules.get(id)!());
	}

	if(!validate(id)) return res.status(400).json({ error: "Invalid UUID" });

	let cule = await db.getPolycule(id);
	if(!cule) return res.status(404).json({ error: "Not found" });

	if(cule.viewPassword && viewPassword !== cule.viewPassword)
		return res.status(401).json({ error: "Wrong password" });

	res.json(cule.polycule);
});

app.get("/api/polycules/:id/passwordCheck", async (req, res) => {
	let { id } = req.params;
	if(SpecialPolycules.has(id)) return res.json({ error: "Not editable" });
	let { editPassword } = req.query;
	if(!validate(id)) return res.status(400).json({ error: "Invalid UUID" });
	let cule = await db.getPolycule(id);
	if(!cule) return res.status(404).json({ error: "Not found" });
	res.json(!cule.editPassword || (editPassword === cule.editPassword));
});

app.post("/api/polycules/:id", async (req, res) => {
	let { id } = req.params;
	let {
		editPassword,
		setEditPassword,
		setViewPassword,
	} = req.query;
	let editedCule = req.body;

	if(SpecialPolycules.has(id)) return res.json({ error: "Not updateable" });

	let isNew = id == "new";
	if(id == "new") id = v4();
	if(!validate(id)) return res.status(400).json({ error: "Invalid UUID" });

	let cule: PolyculeEntry | null = null;
	if(!isNew) {
		cule = await db.getPolycule(id);
		if(!cule) return res.status(404).json({ error: "Not found" });
	
		if(cule.editPassword && editPassword !== cule.editPassword)
			return res.status(401).json({ error: "Wrong password" });
	}

	await db.setPolycule(id, {
		polycule: editedCule,
		editPassword: typeof setEditPassword == "string" ? setEditPassword : cule?.editPassword,
		viewPassword: typeof setViewPassword == "string" ? setViewPassword : cule?.viewPassword,
	});

	if(isNew) {
		res.json({ id });
	} else {
		res.json({});
	}
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(DIST_FOLDER, "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});
