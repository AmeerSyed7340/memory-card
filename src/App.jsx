import { useState, useEffect } from 'react'
import RenderPokemon from './components/pokemon';
import './App.css'

function App() {

  return (
    <div className='container'>
      <RenderPokemon />
    </div>
  )
}

export default App
