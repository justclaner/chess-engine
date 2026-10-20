import type * as Chess from "./types.ts";

export const inBounds = (b: Chess.Board, p: Chess.Pos): boolean => {
  return p.x >= 0 && p.x < b.width && p.y >= 0 && p.y < b.height;
};

export const toIndex = (b: Chess.Board, p: Chess.Pos): number => {
  return p.y * b.width + p.x;
};

export const toPos = (b: Chess.Board, index: number): Chess.Pos => {
  return {
    x: index % b.width,
    y: Math.floor(index / b.width),
  };
};

export const tileAt = (
  b: Chess.Board,
  p: Chess.Pos,
): Chess.Tile | undefined => {
  return inBounds(b, p) ? b.tiles[toIndex(b, p)] : undefined;
};
