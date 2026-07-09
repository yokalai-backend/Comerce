// RAW DATA
interface UserProfilesRawDB {
  user_id: string;
  user_email: string;
  full_name: string;
  avatar_url: string;
  phone_number: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
}

interface UserAddressesRawDB {
  id: string;
  user_id: string;
  label: string;
  street_address: string;
  city: string;
  country: string;
  is_default: boolean;
}

interface UserUpdatedProfilesRawDB {
  full_name: string;
  avatar_url: string;
  phone_number: number;
  updated_at: string;
}

// DTO
interface UserProfilesDTO {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

// QUERY
interface UpdateUserProfilesDetailsInput {
  fullName: string;
  avatarUrl: string;
  phoneNumber: string;
}

interface addUserAddressesInput {
  label: string;
  streetAddress: string;
  city: string;
  country: string;
  asDefault: boolean;
}
