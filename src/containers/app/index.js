import React, { useEffect, useState } from 'react'
import Playground from '../playground'

const App = () => {
  
  const gameinfo = {
    userId:"774b31",      // Random string
    width: Math.floor(Math.random() * 10 + 10),             // Random integer min=10 max=20
    height: Math.floor(Math.random() * 4 + 6),             // Random integer min=4 max=10
    maxMoves: Math.floor(Math.random() * 12 + 8),           // Random integer min=8 max=20
    target: {
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255),
    }
  }

  return (
    <div className='container py-4 text-center'>
      <div className='game-title'>
        <h2>RGB Alchemy</h2>
      </div>
      <Playground gameinfo={gameinfo} />
    </div>
  )
}

export default App
