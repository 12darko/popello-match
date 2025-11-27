import { useState } from 'react';
import { TRANSLATIONS } from '../constants';

export const useLanguage = () => {
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('popello_lang');
        if (saved && TRANSLATIONS[saved]) return saved;
        const detected = navigator.language.split('-')[0];
        return TRANSLATIONS[detected] ? detected : 'en';
    });

    const setLanguage = (code: string) => {
        if (TRANSLATIONS[code]) {
            setLang(code);
            localStorage.setItem('popello_lang', code);
        }
    };

    const t = (key: string) => {
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
    };

    return { lang, setLanguage, t };
};
