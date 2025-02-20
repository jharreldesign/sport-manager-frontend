// Enum for User Roles (could be expanded as needed)
export enum Role {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
  Coach = 'coach',
}

// Manager interface to represent a team manager
export interface Manager {
  _id: string;
  first_name: string;
  last_name: string;
  // Any other properties related to the manager (e.g., contract start date, contact info)
}

// Team interface to represent a sports team
export interface Team {
  _id: string;
  name: string;
  city: string;
  stadium: string;
  sport: string;
  players: Player[];  // Ensure this matches the API data (array of players)
  schedule: Game[];  // Ensure this matches the API data (array of schedules)
  manager: Manager | null;  // Correctly typed to allow null if no manager exists
  stadium_photo: string;
}

// Player interface to represent an individual player
export interface Player {
  _id: string;
  first_name: string;
  last_name: string;
  position: string;
  player_number: number;
  headshot?: string; // Add this field for the player’s image
  team?: Team;  // Optional reference to the player's team
}

// Game interface for game scheduling and results
export interface Game {
  _id: string;
  home_team: Team;  // Full Team object for the home team
  away_team: Team;  // Full Team object for the away team
  date: string;  // ISO date string for the scheduled game (or use Date if needed)
  arena: string;  // Arena where the game will take place
  city: string;   // City where the game will be played
  location: string;
  home_score: number;
  away_score: number;
  attendance: string;
  status: string;  // Status of the game (e.g., 'scheduled', 'completed', 'in-progress')
}

// Team form interface for creating a new team (data input)
export interface TeamFormState {
  name: string;
  city: string;
  stadium: string;
  sport: string;
  stadium_photo: string;
}

// Player form interface for creating a new player (data input)
export interface PlayerFormState {
  player_number: number;
  first_name: string;
  last_name: string;
  hometown: string;
  position: string;
  team?: string; // Reference to the team that the player belongs to
  headshot: string;
}

// Schedule form interface for creating a new game schedule
export interface ScheduleFormState {
  home_team: string;  // ID of the home team
  away_team: string;  // ID of the away team
  date: string;  // Date and time of the game
  arena: string;  // Location/arena where the game is played
  city: string;  // City where the game is played
}

// New User interface for representing a logged-in user (with roles)
export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;  // Use the Role enum to represent user roles
}

// New Auth Token interface to handle login response data (if you need to store token data)
export interface AuthToken {
  token: string;  // The JWT token received after login/signup
}

// User authentication state (could be part of global state or context)
export interface AuthState {
  user: User | null;  // The current authenticated user (or null if not logged in)
  token: string | null;  // The auth token for making authenticated requests
  isAuthenticated: boolean;  // A flag to determine if the user is authenticated
}
