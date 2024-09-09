import express from "express";
import { validateCpf } from "./validateCpf";
import { AccountRepository } from './infra/repository/AccountRepository';

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
	const accountRepository = new AccountRepository();
	const account = await accountRepository.getByEmail(input.email);
	if (account) return res.status(422).json({ message: -4 });
	if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) return res.status(422).json({ message: -3 });
	if (!input.email.match(/^(.+)@(.+)$/)) return res.status(422).json({ message: -2 });
	if (!validateCpf(input.cpf)) return res.status(422).json({ message: -1 })
	if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
		return res.status(422).json({ message: -5 });
	}
	const id = await accountRepository.save({
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		carPlate: input.carPlate,
		isPassenger: !!input.isPassenger,
		isDriver: !!input.isDriver,
		password: input.password
	})
	res.json({
		accountId: id
	});
});

app.listen(3000);
