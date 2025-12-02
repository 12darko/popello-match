import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';

export const useTranslation = () => {
    const [language, setLanguage] = useState<'tr' | 'en'>('tr');

    useEffect(() => {
        const saved = localStorage.getItem('popello_language');
        if (saved === 'en' || saved === 'tr') {
            setLanguage(saved);
        }
    }, []);

    const t = (key: string): string => {
        return TRANSLATIONS[language][key] || key;
    };

    const changeLanguage = (lang: 'tr' | 'en') => {
        setLanguage(lang);
        localStorage.setItem('popello_language', lang);
    };

    return { t, language, changeLanguage };
};
