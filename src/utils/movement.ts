import type * as Chess from "./types.ts";
import * as Board from "./board.ts";
import * as CONSTANTS from "./constants.ts";

export const getMoveRules = (
  pieceKind: string,
): Chess.MoveRule[] | undefined => {
  return CONSTANTS.PIECE_REGISTRY.get(pieceKind)?.moves;
};

// None of the getValid... functions take into account whether the king is in check

/*
 * Gets all vaild coordinates of a slide move of some piece color from the specified coordinates on a board.
 * Stops when going off the board, onto a blocked tile, or into another piece. In the case that the slide move
 * goes into another piece of an opposite color, it counts as a capture and is included in the return array.
 */
export const getValidSlideCoordinates = (
  board: Chess.Board,
  pieceColor: Chess.Color,
  { x, y }: Chess.Coordinate,
  directions: Chess.Vector[],
  maxRange: number | undefined,
  mode: string | undefined,
): Chess.Coordinate[] => {
  const coordinates: Chess.Coordinate[] = [];
  for (const { dx, dy } of directions) {
    let range = 1;
    while (maxRange === undefined || range <= maxRange) {
      const [nx, ny] = [x + range * dx, y + range * dy];
      const newCoordinate = { x: nx, y: ny };
      const tile = Board.tileAt(board, newCoordinate);
      if (tile === undefined || tile.terrain === "blocked") {
        break;
      }

      const destinationPiece = Board.pieceAt(board, newCoordinate);
      if (destinationPiece !== null) {
        if (mode !== "move" && destinationPiece.color !== pieceColor) {
          coordinates.push(newCoordinate);
        }
        break;
      }

      coordinates.push(newCoordinate);
    }
  }
  return coordinates;
};

// getValidSlideCoordinates except it returns an array of Chess.Move elements
export const getValidSlideMoves = (
  board: Chess.Board,
  piece: Chess.Piece,
  { x, y }: Chess.Coordinate,
  directions: Chess.Vector[],
  maxRange: number | undefined,
  mode: string | undefined,
): Chess.Move[] => {
  const moves: Chess.Move[] = [];
  const coordinates: Chess.Coordinate[] = getValidSlideCoordinates(
    board,
    piece.color,
    { x, y },
    directions,
    maxRange,
    mode,
  );

  for (const coordinate of coordinates) {
    const destinationPiece = Board.pieceAt(board, coordinate);
    const capture =
      destinationPiece !== null &&
      mode !== "move" &&
      destinationPiece.color !== piece.color;
    moves.push({
      piece,
      initial: { x, y },
      final: coordinate,
      capture,
    });
  }

  return moves;
};

/*
 * Gets all vaild coordinates of a leap move of some piece color from the specified coordinates on a board.
 * In the case that the leap move goes into another piece of an opposite color, it counts as a capture and
 * is included in the return array.
 */
export const getValidLeapCoordinates = (
  board: Chess.Board,
  pieceColor: Chess.Color,
  { x, y }: Chess.Coordinate,
  offsets: Chess.Vector[],
  mode: string | undefined,
): Chess.Coordinate[] => {
  const coordinates: Chess.Coordinate[] = [];

  for (const { dx, dy } of offsets) {
    const [nx, ny] = [x + dx, y + dy];
    const newCoordinate = { x: nx, y: ny };

    const tile = Board.tileAt(board, newCoordinate);
    if (tile === undefined || tile.terrain === "blocked") {
      continue;
    }

    const destinationPiece = Board.pieceAt(board, newCoordinate);
    if (
      destinationPiece !== null &&
      mode !== "move" &&
      destinationPiece.color !== pieceColor
    ) {
      coordinates.push(newCoordinate);
      continue;
    }
    coordinates.push(newCoordinate);
  }
  return coordinates;
};

// getValidLeapCoordinates except it returns an array of Chess.Move elements
export const getValidLeapMoves = (
  board: Chess.Board,
  piece: Chess.Piece,
  { x, y }: Chess.Coordinate,
  offsets: Chess.Vector[],
  mode: string | undefined,
): Chess.Move[] => {
  const moves: Chess.Move[] = [];
  const coordinates: Chess.Coordinate[] = getValidLeapCoordinates(
    board,
    piece.color,
    { x, y },
    offsets,
    mode,
  );

  for (const coordinate of coordinates) {
    const destinationPiece = Board.pieceAt(board, coordinate);
    const capture =
      destinationPiece !== null &&
      mode !== "move" &&
      destinationPiece.color !== piece.color;

    moves.push({
      piece,
      initial: { x, y },
      final: coordinate,
      capture,
    });
  }

  return moves;
};

// Gets all possible on-board moves of a single piece
export const getMoves = (
  gameState: Chess.GameState,
  piece: Chess.Piece,
  { x, y }: Chess.Coordinate,
): Chess.Move[] => {
  const { board, sideToMove, castlingRights } = gameState;
  //TODO: Finish Implementation

  return [];
};

// Gets all possible moves playable on the board currently
export const getAllMoves = (gameState: Chess.GameState): Chess.Move[] => {
  const { board, sideToMove, castlingRights } = gameState;
  const moves: Chess.Move[] = [];

  const { tiles } = board;
  for (const { piece, coordinate } of tiles) {
    if (piece === null || piece.color != sideToMove) {
      continue;
    }

    const moveRules = getMoveRules(piece.kind);
    if (moveRules === undefined) {
      continue;
    }

    for (const rule of moveRules) {
      if (rule.kind == "slide") {
        const { directions, maxRange, mode } = rule;
        moves.push(
          ...getValidSlideMoves(
            board,
            piece,
            coordinate,
            directions,
            maxRange,
            mode,
          ),
        );
      } else if (rule.kind == "leap") {
        const { offsets, mode } = rule;
        moves.push(
          ...getValidLeapMoves(board, piece, coordinate, offsets, mode),
        );
      } else {
        // TODO: Implement logic for custom movement rules like castling and en-passant
      }
    }
  }
  return moves;
};
