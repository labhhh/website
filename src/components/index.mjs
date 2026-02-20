import { InnerControlButtons } from "./inner-control-buttons/index.mjs";
import { NotFoundSnippet } from "./not-found-snippet/index.mjs";
import { LoadingSpinner } from "./loading-spinner/index.mjs";
import { LanguageSelect } from "./language-select/index.mjs";
import { ThemeSwitcher } from "./theme-switcher/index.mjs";

const registry = {
    [InnerControlButtons.ID]: InnerControlButtons,
    [NotFoundSnippet.ID]: NotFoundSnippet,
    [LanguageSelect.ID]: LanguageSelect,
    [LoadingSpinner.ID]: LoadingSpinner,
    [ThemeSwitcher.ID]: ThemeSwitcher
};

export default function registerComponents() {
    const bind = ([id, component]) => {
        window.customElements.define(id, component);
    }

    Object.entries(registry).forEach(bind);
}
