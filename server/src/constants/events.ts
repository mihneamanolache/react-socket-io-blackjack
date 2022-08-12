export const EVENTS = {
    connection: 'connection',
    disconnect: 'disconnect',
    ROOM: {
        WAITING: 'pendingGame',
        ACTIVE: 'activeGame',
        FULL: 'disconnectParticipant'
    },
    GAME: {
        START: 'startGame',
        ASSIGN_CARDS: 'assignCards',
        STAND_HAND: 'standHand',
        DRAW_CARD: 'drawCard',
        WINNER: 'announceWinner',
        REPLAY: 'replayMatch',
        WAITING_OPPONENT: 'waitingForOpponent',
        ENABLE_GAME: 'enableGame',
        INIT: 'initializeGame'
    },
    USERS: {
        GET_INIT: 'getInitialData',
        READY: 'userReady'
    },
    ROOMS: {
        PLAY_ROOM: 'playRoom'
    }
}