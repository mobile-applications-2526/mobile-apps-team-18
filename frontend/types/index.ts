export type AuthenticationResponse = {
  message?: string;
  token?: string;
  username?: string;
  email?: string;
  geboortedatum?: string;
  locatie?: string;
};

export type User = {
  id?: number;
  username?: string;
  email?: string;
  geboortedatum?: string;
  locatie?: string;
};

export type SignupInput = {
  username: string;
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
  organizer?: User;
  done?: boolean;
};

export type Task = {
  id?: number;
  title?: string;
  date?: string;
  type?: TaskType;
  assignedUser?: User;
  description?: string;
  kotAddress?: string;
  done?: boolean;
};

export type Dorm = {
  id: number;
  name: string;
  code: string;
  users: User[];
  tasks: Task[];
  events: Event[];
};

export enum TaskType {
  CLEANING,
  TRASH,
  DISHES,
  BATHROOM,
  KITCHEN,
  COOKING,
  GROCERIES,
}
