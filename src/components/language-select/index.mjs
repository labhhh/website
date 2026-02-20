import loadLocale from "../../services/i18n/index.mjs";
import storage from "../../services/storage/index.mjs";
import BaseComponent from "../base-component.mjs";

export class LanguageSelect extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "language-select";

    styles =  (`
        details {
            position: relative;
            margin-top: -5px;
        }

        summary {
            align-items: center;
            cursor: pointer;
            display: flex;
            gap: 0.5rem;
        }

        summary #chevron {
            font-size: calc(var(--font-size) + 3px);
            transition: transform 0.2s ease;
            line-height: 0px;
        }

        details[open] summary #chevron {
            transform: rotate(90deg);
        }

        fieldset {
            box-shadow: 0px 10px 35px -10px var(--text-color);
            background-color: var(--body-bg-color);
            flex-direction: column;
            border-radius: 3px;
            position: absolute;
            display: flex;
            width: 100%;
            top: 35px;
            gap: 3px;
        }

        label {
            justify-content: center;
            display: inline-flex;
            cursor: pointer;
            padding: 10px;
            gap: 10px;
        }

        input {
            display: none;
        }
    `);

    html = (`
        <details>
            <summary></summary>
            <fieldset></fieldset>
        </details>
    `);

    #options = [
        { value: "pt-BR", icon: "fi fi-br" },
        { value: "en-US", icon: "fi fi-us" }
    ];

    #getOptionsElements() {
        const options = Array.from(this.selectAll("input"));

        const setProperties = (element) => {
            const byValue = (option) => (option.value == element.value);
            const { value, icon } = this.#options.find(byValue);

            element.icon = icon;
            element.checked = (value === storage.getLocale());
        };

        options.forEach(setProperties);
        return options;
    }

    #getSelectedOptionElement() {
        const selected = (option) => (option.checked);
        return this.#getOptionsElements().find(selected);
    }

    #renderSelectedOption() {
        const icon = this.#getSelectedOptionElement().icon;
        this.select("summary").innerHTML = `
            <i id="chevron" class="bi bi-chevron-right"></i>
            <i class="${icon}"></i>
        `;
    }

    #renderOptions() {
        const container = this.select("fieldset");
        const render = (option) => {
            container.innerHTML += `
                <label>
                    <input type="radio" value="${option.value}" name="language">
                    <i class="${option.icon}"></i>
                </label>
            `
        };
        this.#options.forEach(render);
    }

    connectedCallback() {
        super.connectedCallback();

        this.#renderOptions();
        this.#renderSelectedOption();

        const selectLanguage = (event) => {
            const language = event.target.value;

            document.documentElement.lang = language;
            storage.setLocale(language);

            loadLocale();
            this.#renderSelectedOption();
            this.element.open = false;
        };

        this.#getOptionsElements().forEach(option => {
            option.addEventListener("click", selectLanguage);
        });

        const close = (event) => {
            const isOutside = (event.target.localName !== LanguageSelect.ID);
            if (isOutside)
                this.element.open = false;
        };
        document.addEventListener("pointerdown", close);
    }
}
