import registerComponents from "./components/index.mjs";
import loadLocale from "./services/i18n/index.mjs";
import storage from "./services/storage/index.mjs";

document.documentElement.lang = storage.getLocale();
document.body.dataset.theme = storage.getTheme();

registerComponents();
loadLocale();

if (location.pathname.includes("index.html"))
    location.pathname = location.pathname.replace("index.html", "");
