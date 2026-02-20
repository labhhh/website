import BaseComponent from "../base-component.mjs";

export class InnerControlButtons extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "inner-control-buttons";

    html = (`
        <div class="flex-between">
            <a href="../.." class="link-icon"><i class="bi bi-house-door"></i></a>
            <language-select></language-select>
            <theme-switcher></theme-switcher>
        </div>
    `);

    connectedCallback() {
        super.connectedCallback();
    }
}
