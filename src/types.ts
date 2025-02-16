export interface Manager {
  _id: string;
  first_name: string;
  last_name: string;
  // Any other properties related to the manager (e.g., contract start date, contact info)
}

export interface Team {
  _id: string;
  name: string;
  city: string;
  stadium: string;
  sport: string;
  players: Player[];  // Ensure this matches the API data (array of players)
  schedule: Schedule[];  // Ensure this matches the API data (array of schedules)
  manager: Manager | null;  // Correctly typed to allow null if no manager exists
}

export interface Player {
  _id: string;
  first_name: string;
  last_name: string;
  position: string;
  player_number: number;
  team?: Team;  // Optional reference to the player's team (may or may not be assigned)
}

export interface Schedule {
  _id: string;
  home_team: Team;  // Full Team object for the home team
  away_team: Team;  // Full Team object for the away team
  date: string;  // ISO date string for the scheduled game (or use Date if needed)
  arena: string;  // Arena where the game will take place
  city: string;   // City where the game will be played
}

// New interface for the form data
export interface TeamFormState {
  name: string;
  city: string;
  stadium: string;
  sport: string;
}

export interface PlayerFormState {
  player_number: number;
  first_name: string;
  last_name: string;
  hometown: string;
  position: string;
  team?: string;
}

export interface ScheduleFormState {
  home_team: string;
  away_team: string;
  date: string;
  arena: string;
  city: string;
}