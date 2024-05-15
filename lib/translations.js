import ruTranslations from '@/public/locales/ru/translation.json'
import enTranslations from '@/public/locales/en/translation.json'

export const fetchTranslations = async ({lng}) => {
    if (lng === 'ru') {
        return ruTranslations
    } else {
        return enTranslations
    }
}