import React, { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { EVENTS } from '../config/events'
import { SocketContext, socket } from '../context/socket'
import Alert from 'react-bootstrap/Alert'

export default function GameRoom() {
    const [userData, setUserData] = useState([])
    const [competitorCard, setCompetitorCard] = useState(null)
    const [competitorHiddenCard, setCompetitorHiddenCard] = useState('BACK')
    const [competitorCards, setCompetitorCards] = useState([])
    const [displayCompetitorCards, setDisplayCompetitorCards] = useState()
    const [cards, setCards] = useState([])
    const [displayCards, setDisplayCards] = useState(null)
    const [total, setTotal] = useState(0)
    const [disableButtons, setDisableButtons] = useState(false)
    const [enableRematch, setEnableRematch] = useState(true)
    const [alertHidden, setAlertHidden] = useState(true)
    const [alertMessage, setAlertMessage] = useState(null)
    const [re, setRe] = useState(false)
    const [disableRefresh, setDisableRefresh] = useState(true)

    const resetCanvas = async () => {
        await socket.emit(EVENTS.USERS.READY, userData.user)
        setCompetitorHiddenCard('BACK')
        setDisplayCards(null)
        setAlertHidden(true)
        setAlertMessage(null)
        setDisableRefresh(true)
    }

    const standHand = async () => {
        setDisableButtons(true)
        socket.emit(EVENTS.GAME.STAND_HAND, userData.user)
    }

    const drawCard = async () => {
        await socket.emit(EVENTS.GAME.DRAW_CARD, userData.user)
    }
    
    useEffect(() => {
        socket.emit(EVENTS.USERS.GET_INIT)

        socket.on(EVENTS.GAME.INIT, (data) => {
            setUserData(data)
            setCards(data.firstCards.cards)
            setCompetitorCard(data.firstCards.competitorCard)
            setTotal(data.firstCards.total)
        })

        socket.on(EVENTS.GAME.REPLAY, (data) => {
            setDisableRefresh(false)
            setEnableRematch(true)
            setDisableButtons(false)
            setUserData(data)
            setCards(data.firstCards.cards)
            setCompetitorCard(data.firstCards.competitorCard)
            setTotal(data.firstCards.total)
        })

        socket.on(EVENTS.GAME.WINNER, (data) => {
            setDisableRefresh(false)
            setRe(true)
            console.log(socket.id)
            console.log(data)
            if ( data.winner === socket.id ) {
                setAlertMessage('You won!')
                setDisableButtons(true)
                setCompetitorCards(data.competitorCards)
                setCompetitorHiddenCard(data.competitorCards[0])
            } else {
                setAlertMessage('You lost')
                setDisableButtons(true)
                setCompetitorCards(data.winningCards)
                setCompetitorHiddenCard(data.winningCards[0])
            }
            setAlertHidden(false)
        })

        socket.on(EVENTS.GAME.DRAW_CARD, async (data) => {
            setTotal(data.total)
            setCards(data.cards)
        })

        socket.on(EVENTS.GAME.INIT, (data) => {
            setUserData(data)
            setCards(data.firstCards.cards)
            setCompetitorCard(data.firstCards.competitorCard)
            setTotal(data.firstCards.total)
        })

        window.addEventListener("unload", function (e) {
            console.log('disconnecting...')
            socket.disconnect()
          })

    }, [])

    useEffect(() => {
        setDisplayCards(cards.map((card) => <picture key={card}><img className='me-1' src={`/cards/${card}.png`} width={'100px'} /></picture>))
    }, [cards])
    
    useEffect(() => {
        setDisplayCompetitorCards(competitorCards.map((card) => <picture key={card}><img className='me-1' src={`/cards/${card}.png`} width={'100px'} /></picture>))
    }, [competitorCards])

  return (
    <SocketContext.Provider value={socket}>
        {/* Navigaton */}
        <nav className="navbar navbar-dark bg-dark text-white">
            <div className="container-fluid d-flex justify-content-between fw-bolder">
                <span className="navbar-brand mb-0 h1">Welcome, { userData.user }!</span>
                <div className="fw-bolder bg-warning text-dark rounded p-2">
                    💰 { userData.score }
                </div>
            </div>
        </nav>
        {/* Action menu */}
        <div className="position-absolute top-50 end-0 translate-middle">
            <div className="p-2">
                <button onClick={drawCard} className="btn btn-danger fs-1 rounded rounded-more m-1" title="Draw" hidden={disableButtons ? true : false} disabled={enableRematch ? false : true}>
                    🃏
                </button> <br/>
                <button onClick={standHand} className="btn btn-info fs-1 rounded rounded-more m-1" title="Stand" hidden={disableButtons ? true : false} disabled={enableRematch ? false : true}>
                    ✋🏻
                </button>
                <button onClick={resetCanvas} className="btn btn-light fs-1 rounded rounded-more m-1" title="Rematch" hidden={disableButtons ? false : true} disabled={disableRefresh}>
                    🔄
                </button>
            
                
            </div>
        </div>
        {/* Main Body */}
        <div className="vh-100 bg-success">
            <Alert variant='info' className='position-absolute top-50 start-50 translate-middle' hidden={alertHidden}>{ alertMessage }</Alert>
            <div className="h-50 border-bottom border-dark border-3">
                <div className="text-center p-2 text-warning fw-lighter">
                    {  userData.user === "Player 1" ? "Player 2" : "Player 1" }
                </div>
                <div className='d-flex justify-content-evenly'>

                    <picture ><img className='me-1' src={`/cards/${competitorHiddenCard}.png`} width={'100px'} /></picture>
                    <picture ><img className='me-1' src={`/cards/${competitorCard}.png`} width={'100px'} /></picture>
                    
                    {/* { displayCompetitorCards && displayCompetitorCards } */}
                </div>  
            </div>
            <div className="h-50 bg-success">
                <div className="d-flex justify-content-between">
                    <div className="text-center p-2 text-warning fw-lighter">
                        {  userData.user === "Player 1" ? "Player 1" : "Player 2" }
                    </div>    
                    <div className="text-center p-2">
                        Total: { total }
                    </div>   
                </div>
                <div className='d-flex justify-content-evenly'>
                    { displayCards }
                </div>     
            </div>
            
        </div>
    </SocketContext.Provider>
  )
}
