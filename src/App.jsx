import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  

  useEffect(() => {

    const fetchData = async () => {
      try{
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=5&limit=5');

        if(!response.ok){
          throw new Error("Network response not ok");
        }

        let data = await response.json();
        const urls = data.results.map(item => item.url);
      
        const allResponse = await Promise.all(urls.map(url => fetch(url)));
        const allData = await Promise.all(allResponse.map(res => res.json()))
        console.log(allData);

        //update state
        setPokemonData(allData);
      }
      catch(error){
        console.error(error.message);
      }
    }

    //Call the asyn function
    fetchData();
  }, []);
  return (
    <div>
      {pokemonData.map((pokemon, index) => (
        <img key={index} src={pokemon.sprites.front_default} alt="pokemon" />
      ))}
    </div>
  )
}

export default App
