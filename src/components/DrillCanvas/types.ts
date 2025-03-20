export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Position;
  number?: number;
  team: 'home' | 'away';
}

export interface Ball {
  id: string;
  position: Position;
}

export interface Cone {
  id: string;
  position: Position;
}

export interface Stick {
  id: string;
  position: Position;
}

export interface Movement {
  id: string;
  start: Position;
  end: Position;
  type: 'player' | 'ball';
}

export interface DrillState {
  players: Player[];
  balls: Ball[];
  movements: Movement[];
  cones: Cone[];
  sticks: Stick[];
  fieldType: FieldType;
}

export type Tool = 'player' | 'ball' | 'movement' | 'select' | 'delete' | 'cone' | 'stick';

export type FieldType = 'full' | 'half' | 'custom';

export interface CanvasProps {
  width: number;
  height: number;
}