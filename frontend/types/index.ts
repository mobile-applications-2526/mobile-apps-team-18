export type User = {
  message: string;
  token: string;
  username: string;
  email: string;
  geboortedatum: string;
  plaats: string;
};

// Signup input expected by backend /users/signup
export type SignupInput = {
  username: string;
  email: string;
  geboortedatum: string; // ISO date YYYY-MM-DD
  locatie: string;
  password: string;
};

// Backend returns the created user entity (without token)
export type SignupUser = {
  token: any;
  id: number;
  username: string;
  email: string;
  geboortedatum: string; // ISO date
  locatie: string;
};