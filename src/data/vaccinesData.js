// 🐕 Vacunas para perros
export const DOG_VACCINES = [
    { id: 1, name: 'Parvovirus', mandatory: true },
    { id: 2, name: 'Moquillo (Distemper)', mandatory: true },
    { id: 3, name: 'Hepatitis Infecciosa Canina', mandatory: true },
    { id: 4, name: 'Rabia', mandatory: true },
    { id: 5, name: 'Leptospirosis', mandatory: true },
    { id: 6, name: 'Parainfluenza', mandatory: false },
    { id: 7, name: 'Coronavirus Canino', mandatory: false },
    { id: 8, name: 'Bordetella (Tos de las Perreras)', mandatory: false },
    { id: 9, name: 'Vacuna Séxtuple (DHPPL)', mandatory: true },
    { id: 10, name: 'Vacuna Óctuple (DHPPL + Coronavirus + Leptospira)', mandatory: true },
    { id: 11, name: 'Giardia', mandatory: false },
    { id: 12, name: 'Enfermedad de Lyme', mandatory: false },
];

// 🐱 Vacunas para gatos
export const CAT_VACCINES = [
    { id: 13, name: 'Panleucopenia Felina (Moquillo Felino)', mandatory: true },
    { id: 14, name: 'Rinotraqueitis Viral Felina', mandatory: true },
    { id: 15, name: 'Calicivirus Felino', mandatory: true },
    { id: 16, name: 'Rabia', mandatory: true },
    { id: 17, name: 'Leucemia Felina (FeLV)', mandatory: false },
    { id: 18, name: 'Vacuna Triple Felina (FVRCP)', mandatory: true },
    { id: 19, name: 'Vacuna Cuádruple Felina', mandatory: true },
    { id: 20, name: 'Clamidia Felina', mandatory: false },
    { id: 21, name: 'Peritonitis Infecciosa Felina (PIF)', mandatory: false },
    { id: 22, name: 'Bordetella (para gatos)', mandatory: false },
];

// Función para obtener vacunas según la especie
export const getVaccinesBySpecies = (species) => {
    const normalizedSpecies = species?.toLowerCase().trim();
    
    if (normalizedSpecies === 'perro' || normalizedSpecies === 'dog') {
        return DOG_VACCINES;
    } else if (normalizedSpecies === 'gato' || normalizedSpecies === 'cat') {
        return CAT_VACCINES;
    }
    
    // Si no se especifica o es otra especie, retornar todas
    return [...DOG_VACCINES, ...CAT_VACCINES];
};

// Función para obtener vacunas obligatorias
export const getMandatoryVaccines = (species) => {
    const vaccines = getVaccinesBySpecies(species);
    return vaccines.filter(vaccine => vaccine.mandatory);
};

// Función para obtener vacunas opcionales
export const getOptionalVaccines = (species) => {
    const vaccines = getVaccinesBySpecies(species);
    return vaccines.filter(vaccine => !vaccine.mandatory);
};
