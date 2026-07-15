import { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import pokedex from '../assets/pokedex.svg';
import Card from '../components/Card';
import { usePokeApi } from '../PokeApi';

export default function Pokedex() {
    const {
        pokemons, loading, error, noResults, offset, searchTerm, setSearchTerm,
        isSearching, handleSearch, clearSearch, handleNextPage, handlePrevPage,
        LIMIT, sortPokemons, filterByType
    } = usePokeApi();

    const [flippedCardId, setFlippedCardId] = useState(null);
    const [sortValue, setSortValue] = useState("");
    const [typeValue, setTypeValue] = useState("");

    return (
        <div className="pokedex-container">
            <div className="pokedex-content">

                <div className="pokedex-header">
                    <h2 className="pokedex-title">
                        <img src={pokedex} className="pokedex-title-icon" alt="Pokédex Logo" />
                        Pokédex
                    </h2>

                    <div className="pokedex-controls">
                        {/* buscador*/}
                        <form onSubmit={handleSearch} className="pokedex-search">
                            <input
                                type="text"
                                placeholder="Busca a un Pokémon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pokedex-search-input"
                            />

                            {searchTerm.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="pokedex-search-clear"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            )}

                            <button
                                type="submit"
                                className="pokedex-search-submit"
                            >
                                <Search size={16} />
                            </button>
                        </form>

                        {/* filtros*/}
                        <div className="pokedex-filters">
                            <div className="pokedex-filter-wrapper">
                                <select
                                    value={sortValue}
                                    onChange={(e) => { setSortValue(e.target.value); sortPokemons(e.target.value); }}
                                    className="pokedex-select"
                                >
                                    <option value="">Ordenar A-Z</option>
                                    <option value="AZ">A - Z</option>
                                    <option value="ZA">Z - A</option>
                                </select>
                                <div className="pokedex-filter-icon">
                                    {!sortValue && <ChevronDown size={16} color="var(--primary)" style={{ pointerEvents: 'none' }} />}
                                    {sortValue && (
                                        <button
                                            type="button"
                                            onClick={() => { setSortValue(""); sortPokemons(""); }}
                                            className="pokedex-filter-clear"
                                        >
                                            <X size={16} color="var(--primary)" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pokedex-filter-wrapper">
                                <select
                                    value={typeValue}
                                    onChange={(e) => { setTypeValue(e.target.value); filterByType(e.target.value); }}
                                    className="pokedex-select"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="normal">Normal</option>
                                    <option value="fire">Fire</option>
                                    <option value="water">Water</option>
                                    <option value="electric">Electric</option>
                                    <option value="grass">Grass</option>
                                    <option value="ice">Ice</option>
                                    <option value="fighting">Fighting</option>
                                    <option value="poison">Poison</option>
                                    <option value="ground">Ground</option>
                                    <option value="flying">Flying</option>
                                    <option value="psychic">Psychic</option>
                                    <option value="bug">Bug</option>
                                    <option value="rock">Rock</option>
                                    <option value="ghost">Ghost</option>
                                    <option value="dragon">Dragon</option>
                                    <option value="dark">Dark</option>
                                    <option value="steel">Steel</option>
                                    <option value="fairy">Fairy</option>
                                </select>
                                <div className="pokedex-filter-icon">
                                    {!typeValue && <ChevronDown size={16} color="var(--primary)" style={{ pointerEvents: 'none' }} />}
                                    {typeValue && (
                                        <button
                                            type="button"
                                            onClick={() => { setTypeValue(""); filterByType(""); }}
                                            className="pokedex-filter-clear"
                                        >
                                            <X size={16} color="var(--primary)" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* paginación */}
                        {!isSearching && (
                            <div className="pokedex-pagination">
                                <button 
                                    onClick={handlePrevPage} 
                                    disabled={offset === 0} 
                                    className="pokedex-pagination-btn"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="pokedex-pagination-text">
                                    Página {(offset / LIMIT) + 1}
                                </span>
                                <button 
                                    onClick={handleNextPage} 
                                    className="pokedex-pagination-btn"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="pokedex-alert">
                        {error}
                    </div>
                )}

                {/* carga y resultados */}
                {loading ? (
                    <div className="pokedex-loading">
                        Cargando...
                    </div>
                ) : noResults ? (
                    <div className="pokedex-alert">
                        No se encontró ningún Pokémon con ese tipo.
                    </div>
                ) : (
                    <div className="pokedex-grid">
                        {/* grid pokemones */}
                        {pokemons.map((pokemon) => (
                            <Card
                                key={pokemon.id}
                                pokemon={pokemon}
                                isFlipped={flippedCardId === pokemon.id}
                                onFlip={() => setFlippedCardId(flippedCardId === pokemon.id ? null : pokemon.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!isSearching && !noResults && (
                <div className="pokedex-bottom-pagination">
                    <div className="pokedex-pagination bottom">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={offset === 0} 
                            className="pokedex-pagination-btn"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="pokedex-pagination-text">
                            Página {(offset / LIMIT) + 1}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            className="pokedex-pagination-btn"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}