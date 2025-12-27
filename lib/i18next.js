const i18next = require('i18next'); 

function initTranslation(req) {
    const languageChain = req.headers['accept-language']?? req.headers['Accept-Language']?? 'en';

    const sortedLanguage = languageChain
    .split(/,\s*/)
    .map((languageItem) => languageItem.split(';q="'))
    .sort((a,b) => {
        console.log(a, b);
        a[1] = a[1] !== undefined ? parseFloat(a[1]) : 1,
        b[1] = b[1] !== undefined ? parseFloat(b[1]) : 1;
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
    });

    const sortedLanguageKeys = sortedLanguage.map
    ((item) => item[0]);
    
    const [lng, ...fallbackLng] = sortedLanguageKeys;
    
    i18next.init({
        lng: lng,
        fallbackLng: fallbackLng,
        resources : {
            en: require('../locales/en.json'),
            fr: require('../locales/fr.json'),
            es: require('../locales/es.json'),
            pl: require('../locales/pl.json'),
        }
    });

    req.language = i18next.language;
    return i18next.t.bind(i18next);
}

module.exports = initTranslation;
// appeler cette fonction dans un middleware pour initialiser la traduction par requête