import { useEffect } from "react";

export default function RenderPokemon({pokemonData, setPokemonData}){

    useEffect(() => {
        const fetchData = async () => {
            try{
                let response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=5&limit=5');

                if(!response.ok){
                    throw new Error("Network reponse not ok");
                }

                //extract the raw data as a json format
                let data = await response.json();

                //returns another array after map with just the urls
                const urls = data.results.map(item => item.url);

                //all api calls needs to happen async, so promise all is used
                const allResponses = await Promise.all(urls.map(url=>fetch(url)));

                //once again extract each of the raw data into json
                const allData = await Promise.all(allResponses.map(res => res.json()));
                
                //update the state
                setPokemonData(allData);
            }
            catch(error){
                console.error(error.message);
            }
        }

        //Call the async function
        fetchData();
    }, []); //useEffect end

    return(
        <div>
            {pokemonData.map((pokemon, index) =>(
                <img key={index} src={pokemon.sprites.front_default} alt="pokemon" />
            ))}
            
        </div>
    )
}