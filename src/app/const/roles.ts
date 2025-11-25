export const ROLES = [
    {
        archetype: 'Scienziato',
        list: [
            'Ricercatore',
            'Biochimico',
            'Fisico',
            'Astrobiologo',
            'Genetista'
        ]
    },
    {
        archetype: 'Soldato',
        list: [
            'Fante',
            'Cecchino',
            'Mitragliere Pesante',
            'Granatiere',
            'Caposquadra'
        ]
    },
    {
        archetype: 'Tecnico',
        list: [
            'Ingegnere',
            'Hacker',
            'Meccanico',
            'Specialista Robotica',
            'Analista Sistemi'
        ]
    },
    {
        archetype: 'Esploratore',
        list: [
            'Scout',
            'Pioniere',
            'Cartografo',
            'Survivalista',
            'Xenolinguista'
        ]
    },
    {
        archetype: 'Capitano',
        list: [
            'Comandante',
            'Stratega',
            'Diplomatico',
            'Tattico',
            'Capoflotta'
        ]
    },
    {
        archetype: 'Pilota',
        list: [
            'Pilota da Caccia',
            'Pilota Trasporti',
            'Pilota Collaudo',
            'Pilota Shuttle',
            'Navigatore'
        ]
    },
    {
        archetype: 'Medico',
        list: [
            'Medico da Campo',
            'Chirurgo',
            'Paramedico',
            'Ufficiale Medico',
            'Psichiatra'
        ]
    }
]

export const ARCHETYPES_DICT_ICONS: { [key: string]: string } = {
    'scienziato': 'science',
    'soldato': 'military_tech',
    'tecnico': 'build',
    'esploratore': 'explore',
    'capitano': 'social_leaderboard',
    'pilota': 'send',
    'medico': 'health_cross'
};