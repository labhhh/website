import storage from "../../services/storage/index.mjs";
import BaseComponent from "../base-component.mjs";

export class ThemeSwitcher extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "theme-switcher";

    styles =  (`
        button {
            font-size: calc(var(--font-size) + 10px);
            color: var(--text-color);
            border-radius: 90px;
            padding: 3px 5px;
        }
    `);

    html = (`
        <button>
            <i></i>
        </button>
    `);

    #isDark() {
        return (storage.getTheme() === "dark");
    }

    #renderIcon() {
        this.select("i").className = (this.#isDark()) ? "bi bi-sun" : "bi bi-moon";
    }

    connectedCallback() {
        super.connectedCallback();
        this.#renderIcon();

        const switchTheme = () => {
            const theme = this.#isDark() ? "light" : "dark";
            document.body.dataset.theme = theme;
            storage.setTheme(theme);
            this.#renderIcon();
        }

        this.element.addEventListener("click", switchTheme);
    }
}
