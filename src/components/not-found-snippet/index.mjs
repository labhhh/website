import BaseComponent from "../base-component.mjs";

export class NotFoundSnippet extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "not-found-snippet";

    html = (`
        <section>
            <div class="flex-between">
                <button>
                    <i class="bi bi-arrow-left link-icon"></i>
                </button>
                <theme-switcher></theme-switcher>
            </div>
            <pre>$ tuxsay '404: Not Found'
  ----------------
|  404: Not Found  |
  ----------------
    \\
     \\
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/'\\
    \\___)=(___/
        </pre>
        </section>
    `);

    connectedCallback() {
        super.connectedCallback();
        this.select("button").addEventListener("click", () => history.back());
    }
}
