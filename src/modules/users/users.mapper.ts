const userMapper = {
  toUserProfilesDTO: (data: UserProfilesRawDB): UserProfilesDTO => {
    return {
      id: data.user_id,
      fullName: data.full_name,
      email: data.user_email,
      avatarUrl: data.avatar_url,
      phoneNumber: data.phone_number,
      birthDate: data.birth_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
  toUserUpdatedProfilesDTO: (data?: UserUpdatedProfilesRawDB) => {
    return {
      updatedFullName: data?.full_name,
      updatedAvatarUrl: data?.avatar_url,
      updatedPhoneNumber: data?.phone_number,
      updatedAt: data?.updated_at,
    };
  },
};

export default userMapper;
