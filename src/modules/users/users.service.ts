import errors from "../../core/errors/errors";
import userMapper from "./users.mapper";
import {
  getUserProfilesByIdRepository,
  patchUserBirthDateRepository,
  updateUserProfilesDetailsRepository,
} from "./users.repository";

export async function getUserProfilesById(userId: string) {
  const res = await getUserProfilesByIdRepository(userId);

  if (!res) throw errors.notFound("User not found");

  return userMapper.toUserProfilesDTO(res);
}

export async function updateUserProfilesDetails(
  userId: string,
  input: UpdateUserProfilesDetailsInput,
) {
  let unUpdatedFields = 0;
  if (!input.fullName) unUpdatedFields++;
  if (!input.avatarUrl) unUpdatedFields++;
  if (!input.phoneNumber) unUpdatedFields++;

  if (unUpdatedFields >= 3) throw errors.badRequest("No field can be updated");

  const res = await updateUserProfilesDetailsRepository(userId, input);

  return userMapper.toUserUpdatedProfilesDTO(res);
}

export async function patchUserBirthDate(userId: string, birthDate: Date) {
  const res = await patchUserBirthDateRepository(userId, birthDate);

  if (!res.rowCount)
    throw errors.badRequest("Birth date can only be updated once every 7 days");
}
