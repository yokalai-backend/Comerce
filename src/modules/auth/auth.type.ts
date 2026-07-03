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
