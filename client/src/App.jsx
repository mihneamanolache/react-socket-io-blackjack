import React, { useEffect, useState } from 'react'
import { EVENTS } from './config/events';
import { socket, SocketContext } from './context/socket';
import WaitingRoom from './components/WaitingRoom';
import FullRoom from './components/FullRoom';
import GameRoom from './components/GameRoom';

function App() {
  const [gameStatus, setGameStatus] = useState(EVENTS.ROOM.WAITING)
  useEffect(() => {
    socket.on(EVENTS.ROOM.WAITING, () => {
      setGameStatus(EVENTS.ROOM.WAITING)
    })

    socket.on(EVENTS.ROOM.ACTIVE, () => {
      setGameStatus(EVENTS.ROOM.ACTIVE)
    })

    socket.on(EVENTS.ROOM.FULL, () => {
      setGameStatus(EVENTS.ROOM.FULL)
    })
  }, [gameStatus])
  return (
    <SocketContext.Provider  value={socket}> 
      <div className="vh-100">
        {
            gameStatus === EVENTS.ROOM.WAITING &&
              <WaitingRoom />
        }
        {
            gameStatus === EVENTS.ROOM.ACTIVE &&
              <GameRoom />
        }
        {
            gameStatus === EVENTS.ROOM.FULL &&
              <FullRoom />
        }
      </div>
    </SocketContext.Provider>
  );
}

export default App;
