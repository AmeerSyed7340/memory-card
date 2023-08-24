import { useState, useEffect } from 'react'
import '../styles/pokemon.css'

export default function RenderPokemon() {

    const [pokemonData, setPokemonData] = useState([]);
    const [count, setCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=5&limit=5');

                if (!response.ok) {
                    throw new Error("Network reponse not ok");
                }

                //extract the raw data as a json format
                let data = await response.json();

                //returns another array after map with just the urls
                const urls = data.results.map(item => item.url);

                //all api calls needs to happen async, so promise all is used
                const allResponses = await Promise.all(urls.map(url => fetch(url)));

                //once again extract each of the raw data into json
                const allData = await Promise.all(allResponses.map(res => res.json()));

                //update the state
                setPokemonData(allData.map((data, index) => ({
                    ...data,
                    clicked: "false"
                })));

            }
            catch (error) {
                console.error(error.message);
            }
        }

        //Call the async function
        fetchData();
    }, []); //useEffect end

    const handleDiv = (pokemon) => {        
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        // add a function to turn flag to clicked
        
        if (pokemon.clicked === "false") {
            setCount(count + 1);
            pokemon.clicked = "true";
            setPokemonData(shuffleArray([...pokemonData]));
        }
        else{
            setGameOver(true);
        }
    }

    if (gameOver) {
        return (
            <h1>Game Over</h1>
        )
    }
    return (
        <div className="main-content">
            {pokemonData.map((pokemon, index) => (
                <div key={index} className="pokemon-container" onClick={() => handleDiv(pokemon)}>
                    <img src={pokemon.sprites.front_default} alt="pokemon" />
                    <p>{pokemon.clicked}</p>
                </div>
            ))}

            <div className="count-tracker">
                <p>{count}</p>
            </div>
        </div>
    )
}