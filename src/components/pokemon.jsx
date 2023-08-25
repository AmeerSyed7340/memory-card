import { useState, useEffect } from 'react'
import '../styles/pokemon.css'

export default function RenderPokemon() {

    const [pokemonData, setPokemonData] = useState([]);
    const [count, setCount] = useState(0);
    const [bestScore, SetBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    //globally defined for access
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }//shufflearray

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
    }, []); //useEffect_1 end

    //to synchronize the best score with current score we cannot simply set them equal to 
    //one or the other. So, we must set as a side effect
    useEffect(() => {
        if (count >= bestScore) {
            SetBestScore(count);
        }
    }, [count]) // useEffect_2 end

    const handleDiv = (pokemon) => {
        // check if it's clicked or not: if it's clicked 


        if (pokemon.clicked === "true") {
            setGameOver(true);
            return;
        }

        // add a function to turn flag to clicked
        // Updated each array to map and return a new array with the changes flag
        // I AM STILL NOT SURE WHY WE HAVE TO RETURN p
        //https://www.w3schools.com/howto/howto_js_remove_property_object.asp
        const updatedPokemons = pokemonData.map(p => {
            if (p.name === pokemon.name) {
                setCount(count + 1);
                return { ...p, clicked: "true" }
            }
            else {
                return p;
            }
        });

        setPokemonData(shuffleArray(updatedPokemons));
    }//handleDiv end

    const handleGameOver = () => {
        setGameOver(false);
        setCount(0); // to reset the counter
        const updatedPokemons = pokemonData.map(p => {
            return { ...p, clicked: "false" };
        })
        setPokemonData(shuffleArray(updatedPokemons));
    }//handleGameOver end

    if (gameOver) {
        return (
            <div className='gameOver-container'>
                <h1>Game Over. You lost!</h1>
                <button onClick={handleGameOver}>Restart</button>
                <p>Best Score: {bestScore}</p>
            </div>
        )
    }
    else if (count === pokemonData.length) {
        return (
            <div>
                <p>You Win! </p>
                <p>Score: {bestScore}</p>
                <button onClick={handleGameOver}>Restart</button>
            </div>

        )
    }
    return (
        <div className="main-content">
            {pokemonData.map((pokemon, index) => (
                <div key={index} className="pokemon-container" onClick={() => handleDiv(pokemon)}>
                    <img src={pokemon.sprites.front_default} alt="pokemon" />
                    <h3>{pokemon.name}</h3>
                </div>
            ))}

            <div className="count-tracker">
                <p>Current Score: {count}</p>
                <p>Best Score: {bestScore}</p>
            </div>
        </div>
    )
}