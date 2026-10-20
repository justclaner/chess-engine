import type * as Chess from "./types.ts";
import type * as Board from "./board.ts";
import * as CONSTANT from "./constants.ts";

const getAllMoves = ({
  board,
  sideToMove,
  castlingRights,
}: Chess.GameState): Chess.Vec[] => {
  const moves = [];

  const { width, height, tiles } = board;
  for (const { piece, coordinate } of tiles) {
    if (piece === null) {
      continue;
    }

    const moveRules = CONSTANT.STANDARD_PIECES.get(piece.kind)?.moves;
    if (moveRules === undefined) {
      continue;
    }

    for (const rule of moveRules) {
    }
  }
  return [];
};
