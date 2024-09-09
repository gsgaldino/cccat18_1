import axios, { AxiosError } from "axios";
import pgp from "pg-promise";
const API_URL = "http://localhost:3000/signup";
const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

afterEach(async () => {
  await connection.query(
    "delete from ccca.account where email = 'desenvolvedorgabs@gmail.com'"
  );
});

afterAll(async () => {
  await connection.$pool.end();
})

test("Deve registrar um usuário com dados válidos", async () => {
  const user = {
    name: "Gabriel Soares",
    email: "desenvolvedorgabs@gmail.com",
    cpf: "97456321558",
    password: "@dmin"
  };
  await axios.post(API_URL, user).then((response) => {
    expect(response.data.accountId).not.toBeNull();
  });
});

test("Não deve registar um usuário com cpf inválido", async () => {
  const user = {
    name: "Gabriel Soares",
    email: "desenvolvedorgabs@gmail.com",
    cpf: "11111111111"
  };
  await axios.post(API_URL, user).catch((err: AxiosError) => {
    expect(err.response?.status).toBe(422);
    expect(err.response?.data).toStrictEqual({ message: -1 })
  });
});

test("Não deve registar um usuário com e-mail inválido", async () => {
  const user = {
    name: "Gabriel Soares",
    email: "foo",
    cpf: "97456321558"
  };
  await axios.post(API_URL, user).catch((err: AxiosError) => {
    expect(err.response?.status).toBe(422);
    expect(err.response?.data).toStrictEqual({ message: -2 })
  });
});

test("Não deve registar um usuário com nome inválido", async () => {
  const user = {
    name: "foo",
    email: "desenvolvedorgabs@gmail.com",
    cpf: "97456321558"
  };
  await axios.post(API_URL, user).catch((err: AxiosError) => {
    expect(err.response?.status).toBe(422);
    expect(err.response?.data).toStrictEqual({ message: -3 })
  });
});

test("Não deve registar um motorista com placa inválida", async () => {
  const user = {
    name: "Gabriel Soares",
    email: "desenvolvedorgabs@gmail.com",
    cpf: "97456321558",
    isDriver: true,
    carPlate: "foo"
  };
  await axios.post(API_URL, user).catch((err: AxiosError) => {
    expect(err.response?.status).toBe(422);
    expect(err.response?.data).toStrictEqual({ message: -5 });
  });
});

test("Deve registrar um motorista com dados válidos", async () => {
  const user = {
    name: "Gabriel Soares",
    email: "desenvolvedorgabs@gmail.com",
    cpf: "97456321558",
    password: "@dmin",
    isDriver: true,
    carPlate: "AMF9055"
  };
  await axios.post(API_URL, user).then((response) => {
    expect(response.data.accountId).not.toBeNull();
  });
});
