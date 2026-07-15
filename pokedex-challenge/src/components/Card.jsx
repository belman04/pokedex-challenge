import { TYPE_COLORS } from '../constants/colors';

export default function Card({ pokemon, isFlipped, onFlip }) {
    const cardColor = TYPE_COLORS[pokemon.type] || TYPE_COLORS.default;

    return (
        <div
            className="card-container"
            onClick={onFlip}
        >
            <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>

                {/* priemr lado */}
                <div
                    className="card-front"
                    style={{ border: `4px solid ${cardColor}` }}
                >
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        loading="lazy"
                        className="card-image"
                    />
                    <h3 className="card-name">
                        {pokemon.name}
                    </h3>
                    <span
                        className="card-type-badge"
                        style={{ backgroundColor: cardColor }}
                    >
                        {pokemon.type}
                    </span>
                </div>

                {/* segundo lado */}
                <div
                    className="card-back"
                    style={{
                        background: `linear-gradient(145deg, var(--surface) 0%, ${cardColor}12 100%)`,
                        border: `2px solid ${cardColor}`
                    }}
                >
                    <div
                        className="card-back-header"
                        style={{ background: `linear-gradient(135deg, ${cardColor}, ${cardColor}dd)` }}
                    >
                        <h3 className="card-back-title">
                            Datos Básicos
                        </h3>
                    </div>

                    <div className="card-stats">
                        {[
                            { label: 'Exp. Base', value: pokemon.base_experience },
                            { label: 'Peso', value: `${pokemon.weight / 10} kg` },
                            { label: 'Altura', value: `${pokemon.height / 10} m` },
                            { label: 'Tipo', value: pokemon.type }
                        ].map((item) => (
                            <div key={item.label} className="card-stat-row">
                                <span className="card-stat-label">
                                    {item.label}
                                </span>
                                <span className="card-stat-value">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}