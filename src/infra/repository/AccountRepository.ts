import crypto from "crypto";
import db from '../db';

type Account = {
	name: string;
	email: string;
	cpf: string;
	password: string;
	isDriver?: boolean;
	isPassenger?: boolean;
	carPlate?: string;
};

export class AccountRepository {
	private connection: any;
	constructor() {
		this.connection = db;
	}
	async getByEmail(email: string) {
		const [account] = await this.connection.query(
			"select * from ccca.account where email = $1",
			[email]
		);
		return account;
	}
	async save(account: Account): Promise<string> {
	  const id = crypto.randomUUID();
		await this.connection.query(
			"insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
			[id, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver, account.password]
		);
    return id;
	}
}
