import loadLocale from "../../src/services/i18n/index.mjs";
import { notesSections } from "../../src/shared/data.mjs";

function renderRepos() {
    const container = document.getElementById("repos-container");

    const toDTO = (repo) => ({
        name: repo["name"],
        isFork: repo["fork"],
        url: repo["html_url"],
        description: repo["description"]
    });

    const toElement = (repo) => {
        const description = (repo.description ? `- ${repo.description}` : "");
        return `
            <li>
                <a target="_blank" href="${repo.url}">${repo.name}</a>
                ${repo.isFork ? "<i class='bi bi-diagram-2 fork-icon'></i>" : ""}
                ${description}
            </li>
        `;
    };

    const render = (repos) => {
        const elements = repos.map(toDTO).map(toElement).join("");
        container.innerHTML = `
            <h2 data-locale="repos-title"></h2>
            <ul>
                ${elements}
            </ul>
            <a
                target="_blank"
                href="https://github.com/bhfsilva?tab=repositories"
                data-locale="see-more">
            </a>
        `;
        loadLocale();
    }

    const check = (response) => {
        if (!response.ok)
            throw new Error();

        return response.json();
    }

    fetch("https://api.github.com/users/bhfsilva/repos?per_page=5&sort=created")
        .then(check)
        .then(render)
        .catch(() => container.remove());
}

function renderNotes() {
    const toElement = (section) => {
        const toLink = (note) => {
            const slug = (note.slug ? `${note.slug} -` : "");
            return`
                <li>
                    <a href="pages/notes/${note.hashpath}">
                        ${slug} ${note.name}
                    </a>
                </li>
            `;
        };

        const links = section.links.map(toLink).join("");

        return `
            <ul>
                <li>
                    <span class="section-label" data-locale="${section.localeKey}"></span>
                    <ul>${links}</ul>
                </li>
            </ul>
        `;
    };

    const sections = notesSections.map(toElement).join("");

    document.getElementById("notes-container").innerHTML = `
        <section>
            <h2>
                <a data-locale="notes-title" href="pages/notes/"></a>
                <sup>
                    <span data-locale="notes-lang-hint"></span><i class="fi fi-br"></i>
                </sup>
            </h2>
            ${sections}
        </section>
    `;
}

renderRepos();
renderNotes();
