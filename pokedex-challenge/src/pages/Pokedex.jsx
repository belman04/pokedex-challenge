import { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import pokedex from '../assets/pokedex.svg';

import Card from '../components/Card';
import { usePokeApi } from '../PokeApi';
import { COLORS } from '../constants/colors';

export default function Pokedex() {
    const {
        pokemons, loading, error, noResults, offset, searchTerm, setSearchTerm,
        isSearching, handleSearch, clearSearch, handleNextPage, handlePrevPage,
        LIMIT, sortPokemons, filterByType
    } = usePokeApi();

    const [flippedCardId, setFlippedCardId] = useState(null);

    const [sortValue, setSortValue] = useState("");
    const [typeValue, setTypeValue] = useState("");

    const {
        background, surface, border, primary, textPrimary, textSecondary, textMuted, warning, overlay, shadow
    } = COLORS;

    return (
        <div style={{
            background: `linear-gradient(135deg, ${background} 0%, ${background} 100%)`,
            minHeight: '100vh', width: '100%', padding: '20px',
            boxSizing: 'border-box', margin: 0, position: 'absolute', top: 0, left: 0
        }}>
            <style>{`
                .pokedex-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 40px;
                    background-color: ${overlay};
                    padding: 20px;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px ${shadow};
                    backdrop-filter: blur(10px);
                }

                .pokedex-title {
                    margin: 0;
                    color: ${textPrimary};
                    font-size: 28px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 900;
                }

                .pokedex-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    flex-grow: 1;
                }

                .pokedex-search {
                    display: flex;
                    align-items: center;
                    background-color: ${surface};
                    border: 2px solid ${border};
                    border-radius: 30px;
                    padding: 0 6px;
                    height: 44px;
                    width: 100%;
                    max-width: 260px;
                    transition: border-color 0.3s;
                    box-shadow: 0 4px 10px ${shadow};
                }

                .pokedex-filters {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .pokedex-select {
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 500;
                    color: ${textPrimary};
                    background-color: ${surface};
                    border: 2px solid ${border};
                    border-radius: 30px;
                    padding: 10px 40px 10px 20px;
                    height: 44px;
                    cursor: pointer;
                    appearance: none;
                    WebkitAppearance: none;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ef5350' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
                    background-repeat: no-repeat;
                    background-position: right 15px center;
                    background-size: 16px;
                }

                .pokedex-pagination {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background-color: ${surface};
                    padding: 2px 15px;
                    border-radius: 30px;
                }

                .pokedex-alert {
                    text-align: center;
                    padding: 20px;
                    border-radius: 15px;
                    font-size: 18px;
                    font-weight: 700;
                    border: 2px solid ${warning};
                    background-color: ${surface};
                    color: ${warning};
                    box-shadow: 0 8px 24px ${shadow};
                    margin-bottom: 30px;
                }

                @media (max-width: 900px) {
                    .pokedex-controls {
                        width: 100%;
                        justify-content: center;
                    }

                    .pokedex-search {
                        max-width: none;
                    }
                }

                @media (max-width: 640px) {
                    .pokedex-header {
                        padding: 16px;
                    }

                    .pokedex-title {
                        width: 100%;
                        justify-content: center;
                        font-size: 24px;
                    }

                    .pokedex-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .pokedex-search {
                        width: 100%;
                        max-width: none;
                    }

                    .pokedex-filters {
                        flex-direction: column;
                    }

                    .pokedex-select {
                        width: 100%;
                    }

                    .pokedex-pagination {
                        justify-content: center;
                        width: fit-content;
                        margin: 0 auto;
                    }
                }
            `}</style>
            <div style={{ maxWidth: '1600px', width: '100%', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

                <div className="pokedex-header">

                    <h2 className="pokedex-title">
                        <img src={pokedex} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="Pokédex Logo" />
                        Pokédex
                    </h2>

                    <div className="pokedex-controls">

                        {/* buscador*/}
                        <form
                            onSubmit={handleSearch}
                            className="pokedex-search"
                        >
                            <input
                                type="text"
                                placeholder="Busca a un Pokémon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={(e) => e.target.parentElement.style.borderColor = primary}
                                onBlur={(e) => e.target.parentElement.style.borderColor = border}
                                style={{
                                    flexGrow: 1,
                                    border: 'none',
                                    outline: 'none',
                                    backgroundColor: 'transparent',
                                    color: textPrimary,
                                    fontSize: '15px',
                                    padding: '0 12px',
                                    width: '100%',
                                    minWidth: '0'
                                }}
                            />

                            {searchTerm.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    style={{
                                        padding: '4px',
                                        backgroundColor: 'transparent',
                                        color: textMuted,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginRight: '2px'
                                    }}
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            )}

                            <button
                                type="submit"
                                style={{
                                    padding: '8px',
                                    backgroundColor: primary,
                                    color: COLORS.textOnPrimary,
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <Search size={16} />
                            </button>
                        </form>

                        {/* filtros*/}
                        <div className="pokedex-filters">
                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: surface, border: `2px solid ${border}`, borderRadius: '30px', padding: '0 12px', height: '44px', position: 'relative', minWidth: '180px', flexShrink: 0, overflow: 'hidden', boxShadow: `0 4px 10px ${shadow}` }}>
                                <select
                                    value={sortValue}
                                    onChange={(e) => { setSortValue(e.target.value); sortPokemons(e.target.value); }}
                                    style={{
                                        border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', fontSize: '15px', color: textPrimary,
                                        appearance: 'none', WebkitAppearance: 'none', paddingRight: '8px', flex: 1, minWidth: 0
                                    }}
                                >
                                    <option value="">Ordenar A-Z</option>
                                    <option value="AZ">A - Z</option>
                                    <option value="ZA">Z - A</option>
                                </select>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    {!sortValue && <ChevronDown size={16} color={primary} style={{ pointerEvents: 'none' }} />}
                                    {sortValue && (
                                        <button
                                            type="button"
                                            onClick={() => { setSortValue(""); sortPokemons(""); }}
                                            style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={16} color={primary} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: surface, border: `2px solid ${border}`, borderRadius: '30px', padding: '0 12px', height: '44px', position: 'relative', minWidth: '180px', flexShrink: 0, overflow: 'hidden', boxShadow: `0 4px 10px ${shadow}` }}>
                                <select
                                    value={typeValue}
                                    onChange={(e) => { setTypeValue(e.target.value); filterByType(e.target.value); }}
                                    style={{
                                        border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', fontSize: '15px', color: textPrimary,
                                        appearance: 'none', WebkitAppearance: 'none', paddingRight: '8px', flex: 1, minWidth: 0
                                    }}
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    {!typeValue && <ChevronDown size={16} color={primary} style={{ pointerEvents: 'none' }} />}
                                    {typeValue && (
                                        <button
                                            type="button"
                                            onClick={() => { setTypeValue(""); filterByType(""); }}
                                            style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={16} color={primary} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* paginación */}
                        {!isSearching && (
                            <div className="pokedex-pagination">
                                <button onClick={handlePrevPage} disabled={offset === 0} style={{ padding: '8px', cursor: offset === 0 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', border: 'none', color: offset === 0 ? textMuted : textPrimary, display: 'flex' }}>
                                    <ChevronLeft size={24} />
                                </button>
                                <span style={{ color: textSecondary, fontSize: '14px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                                    Página {(offset / LIMIT) + 1}
                                </span>
                                <button onClick={handleNextPage} style={{ padding: '8px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: textPrimary, display: 'flex' }}>
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
                    <div style={{ textAlign: 'center', padding: '100px', color: textMuted, fontSize: '24px', fontWeight: 'bold' }}>
                        Cargando...
                    </div>
                ) : noResults ? (
                    <div className="pokedex-alert">
                        No se encontró ningún Pokémon con ese tipo.
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 280px))',
                        justifyContent: 'center',
                        justifyItems: 'center',
                        gap: '24px',
                        width: '100%',
                        maxWidth: 'calc(5 * 280px + 4 * 24px)',
                        margin: '0 auto',
                        marginBottom: '40px'
                    }}>
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
                <div style={{
                    display: 'flex', justifyContent: 'center', paddingBottom: '40px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: surface, padding: '10px 20px', borderRadius: '30px', boxShadow: `0 4px 10px ${shadow}` }}>
                        <button onClick={handlePrevPage} disabled={offset === 0} style={{ padding: '8px', cursor: offset === 0 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', border: 'none', color: offset === 0 ? textMuted : textPrimary, display: 'flex' }}>
                            <ChevronLeft size={24} />
                        </button>
                        <span style={{ color: textSecondary, fontSize: '14px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                            Página {(offset / LIMIT) + 1}
                        </span>
                        <button onClick={handleNextPage} style={{ padding: '8px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: textPrimary, display: 'flex' }}>
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}