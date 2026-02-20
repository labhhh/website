const keys = {
    theme: "theme",
    locale: "locale"
}

function get(key) {
    return localStorage.getItem(key);
}

function set(key, value) {
    localStorage.setItem(key, value);
}

//TODO add high-order function
const storage = {
    setTheme: (theme) => {
        set(keys.theme, theme);
    },
    getTheme: () => {
        const theme = get(keys.theme);
        if (!theme)
            return "dark";

        return theme;
    },
    setLocale: (locale) => {
        set(keys.locale, locale);
    },
    getLocale: () => {
        const locale = get(keys.locale);
        if (!locale)
            return "pt-BR";

        return locale;
    }
}

export default storage;
