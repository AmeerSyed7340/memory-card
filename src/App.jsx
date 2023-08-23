import { useState, useEffect } from 'react'
import RenderPokemon from './components/pokemon';
import './App.css'

function App() {
  const [pokemonData, setPokemonData] = useState([]);

  return (
    <RenderPokemon pokemonData={pokemonData} setPokemonData={setPokemonData} />
  )
}

export default App
