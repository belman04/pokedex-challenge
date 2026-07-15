import { useState, useEffect } from "react";
import axios from 'axios';

export const usePokeApi = () => {
    const LIMIT = 20; // limite de pokemon por página

    const [basePokemons, setBasePokemons] = useState([]);
    const [pagePokemons, setPagePokemons] = useState([]);
    const [pokemons, setPokemons] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noResults, setNoResults] = useState(false);
    const [offset, setOffset] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortOrder, setSortOrder] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    // filtracion y ordenamiento de pokemones
    const applyDisplayRules = (sourceList, currentSort = sortOrder, currentType = typeFilter) => {
        let result = [...sourceList];

        if (currentType) {
            result = result.filter((pokemon) => pokemon.type === currentType);
        }

        if (currentSort === 'AZ') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (currentSort === 'ZA') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        setNoResults(result.length === 0 && Boolean(currentType));
        return result;
    };

    const syncPokemons = (sourceList) => {
        setBasePokemons(sourceList);
        setPokemons(applyDisplayRules(sourceList));
    };

    useEffect(() => {
        if (isSearching) return;

        const fetchPokemons = async () => {
            setLoading(true);
            setError(null);
            const cacheKey = `pokedex_modern_${offset}`;

            try {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        setPagePokemons(parsedData);
                        syncPokemons(parsedData);
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }

            try {
                const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;
                const response = await axios.get(apiUrl);

                const pokemonPromises = response.data.results.map(async (pokemon) => {
                    const detailResponse = await axios.get(pokemon.url);
                    return detailResponse.data;
                });

                const pokemonDetails = await Promise.all(pokemonPromises);

                const optimizedPokemonData = pokemonDetails.map(poke => ({
                    id: poke.id,
                    name: poke.name,
                    base_experience: poke.base_experience,
                    weight: poke.weight,
                    height: poke.height,
                    type: poke.types[0].type.name,
                    image: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default
                }));

                setPagePokemons(optimizedPokemonData);
                syncPokemons(optimizedPokemonData);
                localStorage.setItem(cacheKey, JSON.stringify(optimizedPokemonData));

            } catch (error) {
                setError('Error loading the Pokédex.');
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, [offset, isSearching]);

    const sortPokemons = (order) => {
        setSortOrder(order);
        setPokemons(applyDisplayRules(basePokemons, order, typeFilter));
    };

    const filterByType = (type) => {
        setTypeFilter(type);
        setPokemons(applyDisplayRules(basePokemons, sortOrder, type));
    };


    // buscador
    const handleSearch = async (e) => {
        e.preventDefault();
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            setIsSearching(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsSearching(true);

        try {
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);

            const matches = res.data.results.filter(p => p.name.includes(term)).slice(0, LIMIT);

            if (matches.length === 0) throw new Error("No encontrado");

            const pokemonPromises = matches.map(async (poke) => {
                const pokemonDetail = await axios.get(poke.url);
                return pokemonDetail.data;
            });

            const pokemonDetails = await Promise.all(pokemonPromises);

            const optimizedPokemonData = pokemonDetails.map(poke => ({
                id: poke.id,
                name: poke.name,
                base_experience: poke.base_experience,
                weight: poke.weight,
                height: poke.height,
                type: poke.types[0].type.name,
                image: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default
            }));

            setBasePokemons(optimizedPokemonData);
            setPokemons(applyDisplayRules(optimizedPokemonData));
        } catch (err) {
            setError(`No se encontró ningún Pokémon llamado "${term}".`);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    };

    // limpia busqueda
    const clearSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
        setError(null);
        setNoResults(false);
        setBasePokemons(pagePokemons);
        setPokemons(applyDisplayRules(pagePokemons));
    };

    const handleNextPage = () => setOffset(prev => prev + LIMIT);
    const handlePrevPage = () => setOffset(prev => (prev - LIMIT < 0 ? 0 : prev - LIMIT));

    return {
        pokemons, loading, error, noResults, offset, searchTerm, setSearchTerm,
        isSearching, handleSearch, clearSearch, handleNextPage, handlePrevPage,
        LIMIT, sortPokemons, filterByType
    };
};