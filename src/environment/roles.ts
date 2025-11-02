export const ROLES = [
    {
        archetype: 'Scientist',
        list: [
            'Researcher',
            'Biochemist',
            'Physicist',
            'Astrobiologist',
            'Geneticist'
        ]
    },
    {
        archetype: 'Soldier',
        list: [
            'Infantryman',
            'Sniper',
            'Heavy Gunner',
            'Grenadier',
            'Squad Leader'
        ]
    },
    {
        archetype: 'Technician',
        list: [
            'Engineer',
            'Hacker',
            'Mechanic',
            'Robotics Specialist',
            'Systems Analyst'
        ]
    },
    {
        archetype: 'Explorer',
        list: [
            'Scout',
            'Pathfinder',
            'Cartographer',
            'Survivalist',
            'Xenolinguist'
        ]
    },
    {
        archetype: 'Captain',
        list: [
            'Commander',
            'Strategist',
            'Diplomat',
            'Tactician',
            'Fleet Leader'
        ]
    },
    {
        archetype: 'Pilot',
        list: [
            'Fighter Pilot',
            'Transport Pilot',
            'Test Pilot',
            'Shuttle Pilot',
            'Navigator'
        ]
    },
    {
        archetype: 'Medic',
        list: [
            'Field Medic',
            'Surgeon',
            'Paramedic',
            'Medical Officer',
            'Psychiatrist'
        ]
    }
]

export const ARCHETYPES_DICT_ICONS: { [key: string]: string } = {
    'Scientist': 'science',
    'Soldier': 'military_tech',
    'Technician': 'build',
    'Explorer': 'explore',
    'Captain': 'social_leaderboard',
    'Pilot': 'piloting',
    'Medic': 'health_cross'
};