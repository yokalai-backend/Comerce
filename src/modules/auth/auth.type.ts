// INPUT

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

interface CreateUserRepositoryInput {
  username: string;
  email: string;
  passwordHash: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginDeviceInput {
  ipAddr: string;
  deviceAgent: string;
}

// TOKEN

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface TokenInput {
  id: string;
  username: string;
  role: string;
  device_id: string;
}

interface RefreshTokenPayload {
  id: string;
  jti: string;
}

interface RefreshTokenInput {
  id: string;
  jti: string;
  deviceId: string;
}

type RefreshTokenErrorReason =
  | "rotated"
  | "security_issues"
  | "logout"
  | "refreshed";

// USER
type UserRawDB = {
  id: string;
  username: string;
  role: string;
  hash: string;
};

type UserDevicesRawDB = {
  id: string;
  user_id: string;
  device_id: string;
  agent: string;
  ip_addr: string;
  created_at: Date;
};
