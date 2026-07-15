import { COLORS, TYPE_COLORS } from '../constants/colors';

export default function Card({ pokemon, isFlipped, onFlip }) {
    const cardColor = TYPE_COLORS[pokemon.type] || TYPE_COLORS.default;
    const { surface, textPrimary, textMuted, border, shadow, textOnPrimary } = COLORS;

    return (
        <div
            onClick={onFlip}
            style={{
                perspective: '1000px', cursor: 'pointer', height: '280px',
                width: '100%', maxWidth: '280px', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                transform: 'translateZ(0)', willChange: 'transform'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)';
                e.currentTarget.style.boxShadow = `0 12px 24px ${shadow}`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                position: 'relative', width: '100%', height: '100%',
                transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>

                {/* priemr lado */}
                <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    borderRadius: '20px', padding: '15px', boxSizing: 'border-box',
                    textAlign: 'center', backgroundColor: surface,
                    boxShadow: `0 10px 20px ${shadow}`, border: `4px solid ${cardColor}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        loading="lazy"
                        style={{ width: '130px', height: '130px', objectFit: 'contain', filter: `drop-shadow(0px 5px 5px ${shadow})` }}
                    />
                    <h3 style={{ textTransform: 'capitalize', color: textPrimary, margin: '15px 0 5px 0', fontSize: '20px', fontWeight: '800' }}>
                        {pokemon.name}
                    </h3>
                    <span style={{ backgroundColor: cardColor, color: textOnPrimary, padding: '3px 10px', borderRadius: '15px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {pokemon.type}
                    </span>
                </div>

                {/* segundo lado */}
                <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    borderRadius: '20px', overflow: 'hidden',
                    boxShadow: `0 10px 20px ${shadow}`, transform: 'rotateY(180deg)',
                    display: 'flex', flexDirection: 'column',
                    background: `linear-gradient(145deg, ${surface} 0%, ${cardColor}12 100%)`,
                    border: `2px solid ${cardColor}`
                }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${cardColor}, ${cardColor}dd)`,
                        color: textOnPrimary,
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '15px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Basic data
                        </h3>
                    </div>

                    <div style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        flex: 1,
                        justifyContent: 'center'
                    }}>
                        {[
                            { label: 'Exp. Base', value: pokemon.base_experience },
                            { label: 'Peso', value: `${pokemon.weight / 10} kg` },
                            { label: 'Altura', value: `${pokemon.height / 10} m` },
                            { label: 'Tipo', value: pokemon.type }
                        ].map((item) => (
                            <div key={item.label} style={{
                                background: `${surface}ee`,
                                borderRadius: '10px',
                                padding: '8px 10px',
                                border: `1px solid ${border}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: textMuted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                    {item.label}
                                </span>
                                <span style={{ color: textPrimary, fontSize: '13px', fontWeight: '800', textTransform: 'capitalize' }}>
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