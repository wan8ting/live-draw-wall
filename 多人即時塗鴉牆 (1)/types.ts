export interface DrawOptions {
  color: string;
  lineWidth: number;
  isErasing: boolean;
  brushType: 'pencil' | 'crayon';
}

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  name: string;
}