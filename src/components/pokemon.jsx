import { useEffect } from "react";
import '../styles/pokemon.css'

export default function RenderPokemon({ pokemonData, setPokemonData }) {

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

    const handleDiv = (event) => {
        console.log(event.target.textContent);
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        // add a function to turn flag to clicked
        setPokemonData(shuffleArray([...pokemonData]));
    }

    return (
        <div className="main-content">
            {pokemonData.map((pokemon, index) => (
                <div key={index} className="pokemon-container" onClick={handleDiv}>
                    <img src={pokemon.sprites.front_default} alt="pokemon" />
                    <p>{pokemon.clicked}</p>
                </div>
            ))}

        </div>
    )
}