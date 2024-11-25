const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById('loadMoreButton');
const menuItems = document.querySelectorAll('.escolha a'); // Seleciona os links
const sections = document.querySelectorAll('.info-section'); // Seleciona as seções
const maxRecords = 706;
const limit = 12;
let offset = 0;

// Função para carregar os itens da lista
function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemonLista = []) => {
        const newHtml = pokemonLista.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
                <span class="number">#${pokemon.numberId}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `).join('');

        pokemonList.innerHTML += newHtml;

        // Adicionar eventos de clique aos itens da lista
        document.querySelectorAll('.pokemon').forEach((item) => {
            item.addEventListener('click', () => {
                const pokemon = JSON.parse(item.getAttribute('data-pokemon'));
                abrirModal(pokemon);
            });
        });
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
})
    
function abrirModal(pokemon) {
    console.log(pokemon); // Verifique todos os dados retornados da API

    const modalPokemon = document.getElementById('capa');
    const modal = document.getElementById('janela-modal');

    if (!pokemon) {
        console.error("Pokemon não encontrado!");
        return; // Se pokemon for undefined ou null, não continua a execução
    }

    const primaryType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0] : 'unknown'; // Garante que o tipo seja acessado corretamente

    // Remove classes anteriores e adiciona a nova com base no tipo principal
    modalPokemon.className = 'pokemon';
    modalPokemon.classList.add(primaryType);

    // Verifica se os elementos necessários existem
    const nameInfo = document.querySelector('.name-info');
    const numberInfo = document.querySelector('.number-info');
    const detailInfoImage = document.querySelector('.detail-info img');
    const typesInfo = document.querySelector('.types-info');
    const aboutSection = document.getElementById('about');
    const statsSection = document.getElementById('stats');
    const abilitiesSection = document.getElementById('abilities');

    // Verifique se os elementos realmente existem antes de tentar acessar o 'innerHTML'
    if (nameInfo) {
        nameInfo.innerText = pokemon.name || 'N/A';
    }

    if (numberInfo) {
        numberInfo.innerText = `#${pokemon.numberId || 'N/A'}`;
    }

    if (detailInfoImage) {
        detailInfoImage.src = pokemon.photo || 'default_image.png';
    }

    // Verifica se 'types' existe e tem elementos
    if (typesInfo) {
        typesInfo.innerHTML = pokemon.types && pokemon.types.length
            ? pokemon.types.map((type) => `<li class="type-info pokemon">${type}</li>`).join('')
            : '<li class="type-info pokemon">No types available</li>';
    }

    // Verifica se 'about' e outros elementos existem antes de tentar preencher
    if (aboutSection) {
        aboutSection.innerHTML = `
            <p>Height: ${pokemon.height ? pokemon.height + ' cm' : 'N/A'}</p>
            <p>Weight: ${pokemon.weight ? pokemon.weight + ' kg' : 'N/A'}</p>
        `;
    }

    // Verifica se 'stats' existe e tem elementos
    if (statsSection) {
        const statsHtml = pokemon.stats && pokemon.stats.length
            ? pokemon.stats.map((stat) => `<p>${stat.name.toUpperCase()}: ${stat.base_stat}</p>`).join('')
            : '<p>Stats not available</p>';
        statsSection.innerHTML = statsHtml;
    }

    // Verifica se 'abilities' existe e tem elementos
    if (abilitiesSection) {
        const abilitiesHtml = pokemon.abilities && pokemon.abilities.length
            ? pokemon.abilities.map((ability) => `<p>${ability.name}${ability.is_hidden ? ' (Hidden)' : ''}</p>`).join('')
            : '<p>No abilities available</p>';
        abilitiesSection.innerHTML = abilitiesHtml;
    }

    // Exibir o modal
    modal.classList.add('abrir');

    // Fechar o modal ao clicar fora dele ou no botão de fechar
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'fechar' || e.target.id === 'janela-modal') {
            modal.classList.remove('abrir');
        }
    });
}


// Adiciona evento de clique a cada item do menu
menuItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Previne comportamento padrão do link

        // Pega o valor da seção correspondente do atributo data-section
        const sectionId = item.getAttribute('data-section');

        // Oculta todas as seções
        sections.forEach((section) => {
            section.style.display = 'none';
        });

        // Exibe a seção correspondente
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    });
});

function searchPokemon(event) {
    const searchValue = event.target.value.toLowerCase(); // Obtém o valor digitado
    const pokemonItems = document.querySelectorAll('.pokemon'); // Seleciona todos os itens de Pokémon

    // Itera sobre os Pokémons e filtra
    pokemonItems.forEach((item) => {
        const pokemonName = item.querySelector('.name').textContent.toLowerCase(); // Nome do Pokémon
        if (pokemonName.includes(searchValue)) {
            item.style.display = 'block'; // Exibe o item se corresponder
        } else {
            item.style.display = 'none'; // Esconde o item se não corresponder
        }
    });
}

document.getElementById('searchInput').addEventListener('input', searchPokemon);
