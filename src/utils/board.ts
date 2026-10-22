import type * as Chess from "./types.ts";
import * as CONSTANTS from "./constants.ts";
import * as Movement from "./movement.ts";

export const inBounds = (b: Chess.Board, p: Chess.Coordinate): boolean => {
  return p.x >= 0 && p.x < b.width && p.y >= 0 && p.y < b.height;
};

export const toIndex = (b: Chess.Board, p: Chess.Coordinate): number => {
  return p.y * b.width + p.x;
};

export const toPos = (b: Chess.Board, index: number): Chess.Coordinate => {
  return {
    x: index % b.width,
    y: Math.floor(index / b.width),
  };
};

export const tileAt = (
  b: Chess.Board,
  p: Chess.Coordinate,
): Chess.Tile | undefined => {
  return inBounds(b, p) ? b.tiles[toIndex(b, p)] : undefined;
};

export const pieceAt = (
  b: Chess.Board,
  p: Chess.Coordinate,
): Chess.Piece | null => {
  if (!inBounds(b, p)) {
    return null;
  }
  const tile: Chess.Tile = b.tiles[toIndex(b, p)];
  return tile.piece;
};

/*
 * Returns a boolean of whether in the current game state, a piece
 * is in "check". The invariant is that only one side can be in check at a time.
 */
export const inCheck = (gameState: Chess.GameState): boolean => {
  const {
    board: { tiles },
  } = gameState;

  // Find king of right color
  for (const { terrain, piece, coordinate } of tiles) {
    if (terrain == "blocked") {
      continue;
    }
    if (piece === null) {
      continue;
    }
    const pieceBehavior: Chess.PieceBehavior | undefined =
      CONSTANTS.PIECE_REGISTRY.get(piece.kind);
    if (pieceBehavior === undefined || pieceBehavior.royal != true) {
      continue;
    }

    // Piece must be a royal piece; iterate over move rules of all
    for (const pieceKind of CONSTANTS.ALL_KINDS) {
      const moveRules: Chess.MoveRule[] | undefined =
        Movement.getMoveRules(pieceKind);
      // Iterate over all the move rules
      // TODO: Decompose helper function for slide/leap moves to get nx, ny
    }
  }

  return true;
};

// Returns a boolean of whether a coordinate on the board is attacked by some color.
export const attacked = (
  board: Chess.Board,
  { x, y }: Chess.Coordinate,
  colorOfAttackers: Chess.Color,
): boolean => {
  if (
    tileAt(board, { x, y }) === undefined ||
    tileAt(board, { x, y })!.terrain === "blocked"
  ) {
    return false;
  }

  for (const pieceKind of CONSTANTS.ALL_KINDS) {
    const moveRules = Movement.getMoveRules(pieceKind);
    if (moveRules === undefined) {
      continue;
    }

    for (const rule of moveRules) {
      let coordinates: Chess.Coordinate[] = [];
      if (rule.kind === "slide") {
        const { directions, maxRange, mode } = rule;
        coordinates = Movement.getValidSlideCoordinates(
          board,
          colorOfAttackers,
          { x, y },
          directions,
          maxRange,
          mode,
        );
      } else if (rule.kind === "leap") {
        const { offsets, mode } = rule;
        coordinates = Movement.getValidLeapCoordinates(
          board,
          colorOfAttackers,
          { x, y },
          offsets,
          mode,
        );
      }

      for (const coordinate of coordinates) {
        const destinationPiece = pieceAt(board, coordinate);
        if (destinationPiece !== null && destinationPiece.kind === pieceKind) {
          return true;
        }
      }
    }
  }

  return false;
};
