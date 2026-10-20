// ---------- Basics ----------

export type Color = "white" | "black";

export type Pos = { x: number; y: number };
export type Vec = { dx: number; dy: number };

// ---------- Pieces ----------

export type StandardKind =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";

export type PieceKind = StandardKind | (string & {});

export type Move = {
  piece: Piece;
  initial: Pos;
  final: Pos;
  capture: boolean;
};

export type MoveRule = StandardRule | CustomRule;
export type StandardRule = (
  | { kind: "leap"; offsets: Vec[] } // jump to pos + offset, ignoring pieces between
  | { kind: "slide"; dirs: Vec[]; maxRange?: number } // step until edge/blocker/piece
) & {
  mode?: "move" | "capture" | "both"; // default "both"
  firstMoveOnly?: boolean; // only valid while piece.hasMoved is falsy
  relativeToColor?: boolean; // flip dy for black
};

// Escape hatch for behavior that doesn't fit declaratively
// (castling, en passant, teleporting, etc.). `id` looks up a handler
// in a registry, so definitions stay serializable.
export type CustomRule = { kind: "custom"; id: string };

export type PieceBehavior = {
  kind: PieceKind;
  moves: MoveRule[];
  royal?: boolean; // check/checkmate logic
};

export type Piece = {
  kind: PieceKind;
  color: Color;
  hasMoved?: boolean; // castling, pawn double-step
};

// ---------- Board ----------

export type TerrainKind = "normal" | "blocked"; // extend: "portal", "hazard", ...

export type Tile = {
  terrain: TerrainKind;
  piece: Piece | null;
  coordinate: Pos;
};

export type Board = {
  width: number;
  height: number;
  tiles: Tile[]; // index = y * width + x
};

// ---------- Game state ----------

export type GameState = {
  board: Board;
  sideToMove: Color;
  castlingRights: Record<Color, { kingside: boolean; queenside: boolean }>;
  halfmoveClock: number;
  fullmoveNumber: number;
};
