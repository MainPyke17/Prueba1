const BASE_URL = 'https://rickandmortyapi.com/api/character';

const btnGetAll = document.getElementById('btn-get-all');
const filterForm = document.getElementById('filter-form');
const outputSection = document.getElementById('output-section');

function showError(message) {
    outputSection.innerHTML = `<p id="error-message">${message}</p>`;
}

function renderCharacters(characters) {
    if (!characters || characters.length === 0) {
        outputSection.innerHTML = '<p>No se encontraron personajes con esos parámetros.</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Especie</th>
                    <th>Tipo</th>
                    <th>Género</th>
                </tr>
            </thead>
            <tbody>
    `;

    characters.forEach(char => {
        tableHTML += `
            <tr>
                <td><img src="${char.image}" alt="${char.name}" width="50" height="50"/></td>
                <td>${char.name}</td>
                <td>${char.status}</td>
                <td>${char.species}</td>
                <td>${char.type || '-'}</td>
                <td>${char.gender}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';

    outputSection.innerHTML = tableHTML;
}

async function fetchCharacters(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessage = errorData.error || 'Error al obtener datos';
            showError(errorMessage);
            return null;
        }
        const data = await res.json();
        return data.results;
    } catch (error) {
        showError('Error de conexión o inesperado');
        return null;
    }
}

async function getAllCharacters() {
    outputSection.innerHTML = '<p>Cargando personajes...</p>';
    const allCharacters = [];

    let url = BASE_URL;
    while (url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                const errorData = await res.json();
                showError(errorData.error || 'Error al obtener datos');
                return;
            }
            const data = await res.json();
            allCharacters.push(...data.results);
            url = data.info.next;
        } catch (error) {
            showError('Error de conexión o inesperado');
            return;
        }
    }

    renderCharacters(allCharacters);
}

async function getFilteredCharacters(filters) {
    let queryParams = new URLSearchParams();

    for (const key in filters) {
        if (filters[key] && filters[key].trim() !== '') {
            queryParams.append(key, filters[key].trim());
        }
    }
    if (!queryParams.toString()) {
        showError('Por favor ingresa al menos un filtro para buscar.');
        return;
    }

    const url = `${BASE_URL}?${queryParams.toString()}`;
    outputSection.innerHTML = '<p>Cargando personajes filtrados...</p>';
    const filteredCharacters = await fetchCharacters(url);

    if (filteredCharacters !== null) {
        renderCharacters(filteredCharacters);
    }
}

btnGetAll.addEventListener('click', () => {
    getAllCharacters();
});

filterForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const formData = new FormData(filterForm);
    const filters = {
        name: formData.get('name'),
        status: formData.get('status'),
        species: formData.get('species'),
        type: formData.get('type'),
        gender: formData.get('gender')
    };
    getFilteredCharacters(filters);
});