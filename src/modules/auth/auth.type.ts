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
