import { getData } from "../../core/api/api";

export async function getUserByIdRepository(userId: string) {
  const user = await getData(`/${userId}`, "auth");

  console.log("RESULT: ", user);
}
