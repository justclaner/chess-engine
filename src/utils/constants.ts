import type * as Chess from "./types.ts";

export type PieceRegistry = Map<Chess.PieceKind, Chess.PieceBehavior>;

const ORTHOGONAL: Chess.Vector[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const DIAGONAL: Chess.Vector[] = [
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];

const KNIGHT_OFFSETS: Chess.Vector[] = [
  { dx: 1, dy: 2 },
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: -2 },
  { dx: -2, dy: -1 },
  { dx: -2, dy: 1 },
  { dx: -1, dy: 2 },
];

export const STANDARD_KINDS: Set<string> = new Set<string>([
  "king",
  "queen",
  "rook",
  "bishop",
  "knight",
  "pawn",
]);

export const CUSTOM_KINDS: Set<string> = new Set<string>([]);

export const ALL_KINDS: Set<string> = STANDARD_KINDS.union(CUSTOM_KINDS);

export const PIECE_REGISTRY: PieceRegistry = new Map<
  Chess.PieceKind,
  Chess.PieceBehavior
>([
  [
    "king",
    {
      kind: "king",
      royal: true,
      moves: [
        { kind: "leap", offsets: [...ORTHOGONAL, ...DIAGONAL] },
        { kind: "custom", id: "castling" },
      ],
    },
  ],
  [
    "queen",
    {
      kind: "queen",
      moves: [{ kind: "slide", directions: [...ORTHOGONAL, ...DIAGONAL] }],
    },
  ],
  [
    "rook",
    { kind: "rook", moves: [{ kind: "slide", directions: ORTHOGONAL }] },
  ],
  [
    "bishop",
    { kind: "bishop", moves: [{ kind: "slide", directions: DIAGONAL }] },
  ],
  [
    "knight",
    { kind: "knight", moves: [{ kind: "leap", offsets: KNIGHT_OFFSETS }] },
  ],
  [
    "pawn",
    {
      kind: "pawn",
      moves: [
        // single step forward (non-capturing)
        {
          kind: "leap",
          offsets: [{ dx: 0, dy: 1 }],
          mode: "move",
          relativeToColor: true,
        },
        // double step on first move; slide so it can't jump a blocker.
        // Move generator should dedupe against the single step above.
        {
          kind: "slide",
          directions: [{ dx: 0, dy: 1 }],
          maxRange: 2,
          mode: "move",
          firstMoveOnly: true,
          relativeToColor: true,
        },
        // diagonal captures
        {
          kind: "leap",
          offsets: [
            { dx: 1, dy: 1 },
            { dx: -1, dy: 1 },
          ],
          mode: "capture",
          relativeToColor: true,
        },
        // en passant and promotion depend on game state / previous move
        { kind: "custom", id: "en-passant" },
        { kind: "custom", id: "promotion" },
      ],
    },
  ],
]);
