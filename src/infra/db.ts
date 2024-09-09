import pgp from "pg-promise";
export default pgp()("postgres://postgres:123456@localhost:5432/app");
