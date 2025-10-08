export type User = {
  message: string;
  token: string;
  username: string;
  email: string;
  geboortedatum: string;
  plaats: string;
};

export type SignupInput = {
  username: string;
  email: string;
  geboortedatum: string;
  locatie: string;
  password: string;
};

export type SignupUser = {
  token: any;
  id: number;
  username: string;
  email: string;
  geboortedatum: string;
  locatie: string;
};

export type Event = {
  id: number;
  name: string;
  date: string;
  location?: string;
  description?: string;
  kotAddress?: string;
};

export type Task = {
  id: number;
  name: string;
  date: string;
  assignedUser?: User;
  description?: string;
  kotAddress?: string;
};