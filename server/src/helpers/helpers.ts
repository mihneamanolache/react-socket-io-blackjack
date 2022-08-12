export const createDeck = async () => {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    let deck = [];
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    return await shuffleDeck(deck)
}

// Shufle the deck of cards
const shuffleDeck = async (deck: any[]) => {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}

// Get value of card
export const getValue =  async (card:string) => {
    if ( card != undefined ) {
        let data = card.split("-");
        let value: any = data[0];
    
        if (isNaN(value)) { // If it is a Letter and not a number
            if (value == "A") { // If it is Ace, return value 11
                return 11;
            }
            return 10; // If it is not ace, return 10
        }
        return parseInt(value); // else return value
    }
    return card
}

// Check winner
export const check_21 = async (user_1:string, user_1_sum:number, user_2:string, user_2_sum:number,  ) => {
    if ( user_1_sum === 21 && user_1_sum != user_2_sum) {
        return user_1
    }
    if ( user_2_sum === 21 && user_2_sum != user_1_sum) {
        return user_2
    }
    return null
}