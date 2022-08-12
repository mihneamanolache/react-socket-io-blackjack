import { Server } from "http"
import { COLORS } from "../constants/colors"
import { EVENTS } from "../constants/events"
import { check_21 } from "./helpers"

export const deliverCards = async (io:any, event:any, user_1:any, user_1_score:any, user_1_cards:any, user_1_sum:any, user_2:any, user_2_score:any, user_2_cards:any, user_2_sum:any) => {
    let data = {
        user_1: {
            socket: user_1,
            user: 'Player 1',
            score: user_1_score,
            firstCards: {
                cards: user_1_cards,
                total: user_1_sum,
                competitorCard: user_2_cards[1]
            }
        },
        user_2: {
            socket: user_2,
            user: 'Player 2',
            score: user_2_score,
            firstCards: {
                cards: user_2_cards,
                total: user_2_sum,
                competitorCard: user_1_cards[1]
            }
        }
    }
    console.log(COLORS.green,`[INFO] User 1 data is:`)
    console.log(COLORS.green,` - Username:  ${data.user_1.user}`)
    console.log(COLORS.green,` - Cards:     ${data.user_1.firstCards.cards}`)
    console.log(COLORS.green,` - Value:     ${data.user_1.firstCards.total}`)
    
    console.log(COLORS.green,`[INFO] User 2 data is: ${data.user_1}`)
    console.log(COLORS.green,` - Username:  ${data.user_1.user}`)
    console.log(COLORS.green,` - Cards:     ${data.user_1.firstCards.cards}`)
    console.log(COLORS.green,` - Value:     ${data.user_1.firstCards.total}`)

    io.emit(event, data)
}