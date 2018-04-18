function getInfoByName(name) {
    const db = {
        'Пушкин': '6.6.1799',
        'Лермонтов': '15.10.1814',
        'Гоголь': '1.04.1809'
    };

    if (!db.hasOwnProperty(name))
        throw new RangeError(`Database has't info about ${name}`);

    return db[name]
}

exports.getInfoByName = getInfoByName;