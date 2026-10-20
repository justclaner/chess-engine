import type * as Chess from "./types.ts";

export type PieceRegistry = Map<Chess.PieceKind, Chess.PieceBehavior>;

const ORTHOGONAL: Chess.Vec[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const DIAGONAL: Chess.Vec[] = [
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];

const KNIGHT_OFFSETS: Chess.Vec[] = [
  { dx: 1, dy: 2 },
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: -2 },
  { dx: -2, dy: -1 },
  { dx: -2, dy: 1 },
  { dx: -1, dy: 2 },
];

export const STANDARD_KINDS = new Set<string>([
  "king",
  "queen",
  "rook",
  "bishop",
  "knight",
  "pawn",
]);

export const STANDARD_PIECES: PieceRegistry = new Map<
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
      moves: [{ kind: "slide", dirs: [...ORTHOGONAL, ...DIAGONAL] }],
    },
  ],
  ["rook", { kind: "rook", moves: [{ kind: "slide", dirs: ORTHOGONAL }] }],
  ["bishop", { kind: "bishop", moves: [{ kind: "slide", dirs: DIAGONAL }] }],
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
          dirs: [{ dx: 0, dy: 1 }],
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
