const pokeApi = {};

function convertPokeApiDetailToPokemon(PokeDetail) {
    const pokemon = new Pokemon();
    
    pokemon.numberId = PokeDetail.id;
    pokemon.name = PokeDetail.name;

    const types = PokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    /* pokemon.photo = PokeDetail.sprites.other.dream_world.front_default
     */
    pokemon.height = PokeDetail.height; // altura
    pokemon.weight = PokeDetail.weight; // peso
    pokemon.photo = `https://raw.githubusercontent.com/wellrccity/pokedex-html-js/refs/heads/master/assets/img/pokemons/poke_${pokemon.numberId}.gif`

    // Adicionando os stats ao pokemon (direto do PokeDetail)
    pokemon.stats = PokeDetail.stats.map(stat => ({
        name: stat.stat.name,
        base_stat: stat.base_stat
    }));

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((PokeDetail) => {
            const pokemonDetail = convertPokeApiDetailToPokemon(PokeDetail);

            // Retornar diretamente o pokemonDetail já com species e stats
            return pokemonDetail;
        });     
}


pokeApi.getPokemons = (offset = 0, limit = 9) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

