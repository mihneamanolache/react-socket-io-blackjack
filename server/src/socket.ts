import { Server, Socket } from 'socket.io'
import { COLORS } from './constants/colors'
import { EVENTS } from './constants/events'
import { check_21, createDeck, getValue } from './helpers/helpers'
import { deliverCards } from './helpers/sockets'

const socket = async ({io}: {io: Server}) => {
    var user_1: string
    var user_2: string

    var user_1_ready = false
    var user_2_ready = false

    var user_1_score = 100
    var user_2_score = 100

    var user_1_sum = 0
    var user_2_sum = 0 

    var user_1_cards: any[] = []
    var user_2_cards: any[] = []

    var deck: any[] = await createDeck()

    io.on(EVENTS.connection, async (socket: Socket) => {

        console.log(COLORS.green,`[INFO] Connection established: ${socket.id}`)

        // Check number of active sockets.
        const activeSockets = await io.fetchSockets()

        let connections: any [] = []
        activeSockets.forEach(socket => {
            connections.push(socket.id)
        });
        
        if ( connections.length < 2 ) {
            // Waiting for a connection
            console.log(COLORS.cyan,`[INFO] Waiting for players.`)
            socket.emit(EVENTS.ROOM.WAITING)
        } else if ( connections.length === 2 ) {
            // Start the game
            console.log(COLORS.cyan,`[INFO] Two players joined. Joining them in one room.`)
            socket.join(EVENTS.ROOMS.PLAY_ROOM)

            io.emit(EVENTS.ROOM.ACTIVE)

            user_1 = activeSockets[0].id
            user_2 = activeSockets[1].id
            
            socket.on(EVENTS.USERS.GET_INIT, async () => {
                console.log(COLORS.cyan,`[INFO] Initializing game.`)
                deck = await createDeck()

                var user_1_card_1 = await deck.pop()
                var user_2_card_1 = await deck.pop()

                var user_1_card_2 = await deck.pop()
                var user_2_card_2 = await deck.pop()

                user_1_cards.length = 0
                user_2_cards.length = 0

                user_1_cards.push(user_1_card_1)
                user_1_cards.push(user_1_card_2)

                user_2_cards.push(user_2_card_1)
                user_2_cards.push(user_2_card_2)

                user_1_sum = await getValue(user_1_card_1) + await getValue(user_1_card_2)
                user_2_sum = await getValue(user_2_card_1) + await getValue(user_2_card_2)

                io.to(user_1).emit(EVENTS.GAME.INIT, {
                    user: 'Player 1',
                    score: user_1_score,
                    firstCards: {
                        cards: user_1_cards,
                        total: user_1_sum,
                        competitorCard: user_2_cards[1]
                    }
                })
                io.to(user_2).emit(EVENTS.GAME.INIT, {
                    user: 'Player 2',
                    score: user_2_score,
                    firstCards: {
                        cards: user_2_cards,
                        total: user_2_sum,
                        competitorCard: user_1_cards[1]
                    }
                })
                let check = await check_21(user_1, user_1_sum, user_2, user_2_sum)
                if ( check != null ) {
                    console.log(COLORS.green,`[INFO] ${check === user_1 ? 'Player 1' : 'Player 2'} won.`)
                    let winnerData = {
                                    winner: check === user_1 ? user_1 : user_2,
                                    winningCards: check === user_1 ? user_1_cards : user_2_cards,
                                    competitorCards: check === user_1 ? user_2_cards : user_1_cards
                                }
                    console.log(COLORS.green,`[INFO] Winning Data is: ${winnerData}`)
                    io.emit(EVENTS.GAME.WINNER, winnerData) 
                }
                console.log(COLORS.cyan,`[INFO] Game started.`)
            })

            socket.on(EVENTS.USERS.READY, async (data, callback) => {
                if ( data == "Player 1" ) {
                    console.log(COLORS.yellow,`[INFO] Player 1 Ready.`)
                    user_1_ready = true
                }
                if ( data == "Player 2") {
                    console.log(COLORS.yellow,`[INFO] Player 2 Ready.`)
                    user_2_ready = true
                }

                if ( user_1_ready && user_2_ready ) {
                    deck = await createDeck()

                    var user_1_card_1 = await deck.pop()
                    var user_2_card_1 = await deck.pop()

                    var user_1_card_2 = await deck.pop()
                    var user_2_card_2 = await deck.pop()

                    user_1_ready = false
                    user_2_ready = false

                    user_1_cards.length = 0
                    user_2_cards.length = 0

                    user_1_cards.push(user_1_card_1)
                    user_1_cards.push(user_1_card_2)

                    user_2_cards.push(user_2_card_1)
                    user_2_cards.push(user_2_card_2)

                    user_1_sum = await getValue(user_1_card_1) + await getValue(user_1_card_2)
                    user_2_sum = await getValue(user_2_card_1) + await getValue(user_2_card_2)

                    io.to(user_1).emit(EVENTS.GAME.REPLAY, {
                        user: 'Player 1',
                        score: user_1_score,
                        firstCards: {
                            cards: user_1_cards,
                            total: user_1_sum,
                            competitorCard: user_2_cards[1]
                        }
                    })
                    io.to(user_2).emit(EVENTS.GAME.REPLAY, {
                        user: 'Player 2',
                        score: user_2_score,
                        firstCards: {
                            cards: user_2_cards,
                            total: user_2_sum,
                            competitorCard: user_1_cards[1]
                        }
                    })
                    let check = await check_21(user_1, user_1_sum, user_2, user_2_sum)
                    if ( check != null ) {
                        console.log(COLORS.green,`[INFO] ${check === user_1 ? 'Player 1' : 'Player 2'} won.`)
                        let winnerData = {
                                        winner: check === user_1 ? user_1 : user_2,
                                        winningCards: check === user_1 ? user_1_cards : user_2_cards,
                                        competitorCards: check === user_1 ? user_2_cards : user_1_cards
                                    }
                        console.log(COLORS.green,`[INFO] Winning Data is: ${winnerData}`)
                        io.emit(EVENTS.GAME.WINNER, winnerData) 
                    }
                }
            })

            socket.on(EVENTS.GAME.REPLAY, async () => {
                console.log(COLORS.cyan,`[INFO] Users replay.`)
                
                console.log(COLORS.cyan,`[INFO] Game started.`)
            })

            socket.on(EVENTS.GAME.DRAW_CARD, async (user) => {
                let card = deck.pop()
                let cardValue = await getValue(card)
                console.log(COLORS.yellow,`[INFO] ${user} draws ${card}`)  
                if ( user === 'Player 1' ) {
                    user_1_sum += cardValue 
                    user_1_cards.push(card)
                    if ( user_1_sum < 21 ) {
                        io.to(socket.id).emit(EVENTS.GAME.DRAW_CARD, {
                            cards: user_1_cards,
                            total: user_1_sum
                        })
                    } else {
                        io.to(socket.id).emit(EVENTS.GAME.DRAW_CARD, {
                            cards: user_1_cards,
                            total: user_1_sum
                        })
                        io.emit(EVENTS.GAME.WINNER, {
                            winner: user_1_sum === 21 ? user_1 : user_2,
                            winningCards: user_1_sum === 21 ? user_1_cards : user_2_cards,
                            competitorCards: user_1_sum === 21 ? user_2_cards : user_1_cards
                        }) 
                    } 
                } else if ( user === 'Player 2' ) {
                    user_2_cards.push(card)
                    user_2_sum += cardValue 
                    if ( user_2_sum < 21 ) {
                        io.to(socket.id).emit(EVENTS.GAME.DRAW_CARD, {
                            cards: user_2_cards,
                            total: user_2_sum
                        })
                    } else {
                        io.to(socket.id).emit(EVENTS.GAME.DRAW_CARD, {
                            cards: user_2_cards,
                            total: user_2_sum
                        })
                        io.emit(EVENTS.GAME.WINNER, {
                            winner: user_2_sum === 21 ? user_2 : user_1,
                            winningCards: user_2_sum === 21 ? user_2_cards : user_1_cards,
                            competitorCards: user_2_sum === 21 ? user_1_cards : user_2_cards
                        }) 
                    } 
                }                 
            })

            socket.on(EVENTS.GAME.STAND_HAND, (user) => {
                console.log(COLORS.yellow,`[INFO] ${user} stands`)
                if ( user == "Player 1" ) {
                    user_1_ready = true
                }

                if ( user == "Player 2") {
                    user_2_ready = true
                }
                
                if ( user_1_ready && user_2_ready ) {
                    io.emit(EVENTS.GAME.WINNER, {
                        winner: user_1_sum > user_2_sum ? user_1 : user_2,
                        winningCards: user_1_sum > user_2_sum ? user_1_cards : user_2_cards,
                        competitorCards: user_1_sum > user_2_sum ? user_2_cards : user_1_cards
                    }) 
                    user_1_ready = false
                    user_2_ready = false
                }
            })

        } else if ( connections.length > 2 ) {
            // The game has already started and we are disconnecting new connections.
            let removePlayers = connections.slice(2,connections.length)
            console.log(COLORS.red,`[INFO] The room is full. Disconnecting socket: ${removePlayers}`)
            activeSockets.forEach(socket => {
                if ( removePlayers.includes(socket.id) ) {
                    socket.emit(EVENTS.ROOM.FULL)
                    socket.disconnect(true)
                }
            });
        }
        // If an active connection drops, the room becomes's statuss becomes pending
        socket.on(EVENTS.disconnect, () => {
            user_1_ready = false
            user_2_ready = false
            user_1_score = 100
            user_2_score = 100
            user_1_cards.length = 0
            user_2_cards.length = 0
            console.log(COLORS.red,`[INFO] Socket ${socket.id} disconnected`)
            activeSockets.forEach(s => {
                if ( s.id === socket.id ) {
                    io.to(EVENTS.ROOMS.PLAY_ROOM).emit(EVENTS.ROOM.WAITING, socket.id)
                }
            });
            activeSockets.length = 0
        })

        socket.on("connect_error", (err) => { console.log(err)});

    })
}

export default socket