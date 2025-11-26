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
  joinedEvents?: Event[];
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
  participants?: User[];
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
  CLEANING = 'CLEANING',
  BATHROOM = 'BATHROOM',
  COOKING = 'COOKING',
  GROCERIES = 'GROCERIES',
  DISHES = 'DISHES',
  KITCHEN = 'KITCHEN',
  TRASH = 'TRASH',
}

export type ExpenseShare = {
  id?: number;
  user?: User;
  amount?: number;
  paid?: boolean;
};

export type Expense = {
  id?: number;
  title?: string;
  totalAmount?: number;
  creator?: User;
  dorm?: Dorm;
  shares?: ExpenseShare[];
};
