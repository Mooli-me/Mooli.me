import { translations } from './translations.js';

const defaultLang = 'es';

export function getBrowserLang () {
    let lang = window.navigator.languages ? window.navigator.languages[0] : null;
        lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

    let shortLang = lang;
    if (shortLang.indexOf('-') !== -1)
        shortLang = shortLang.split('-')[0];

    if (shortLang.indexOf('_') !== -1)
        shortLang = shortLang.split('_')[0];

    const translationsKeys =  Object.keys(translations);

    if ( translationsKeys.includes(shortLang) ) {
        return shortLang
    } else {
        return defaultLang;
    }
}