import { focusById, getLocation } from "../../src/utils/document.mjs";
import loadLocale from "../../src/services/i18n/index.mjs";
import { notesSections } from "../../src/shared/data.mjs";
import sources from "./data/sources.mjs";

let cache = {};
const internalPaths = Object.keys(sources);

const HTMLParser = new DOMParser();
const markdownParser = new marked.Marked()
    .use(markedFootnote())
    .use(markedGfmHeadingId.gfmHeadingId())
    .use(markedKatex({ nonStandard: true }))
    .use(markedDirective.createDirectives());

function getPathBySource(source) {
    return internalPaths.find((path) => (sources[path] === source));
}

function render(content) {
    const internal = getLocation().internal;
    const hashpath = internal.hashpath;

    document.title = "bhfsilva/notes";
    document.body.innerHTML = content;

    if (hashpath)
        document.title += hashpath;

    focusById(internal.hash);
    loadLocale();
}

function renderNotFound() {
    render(`<not-found-snippet></not-found-snippet>`);
}

function renderNotesList() {
    const toElement = (section) => {
        const toLink = (note) => (`
            <div class="note-display">
                <img src="../../${note.image}"/>
                <div>
                    <b>${note.slug}</b>
                    <p>${note.name}</p>
                    <a href="${note.hashpath}" class="link-icon">
                        <i class="bi bi-arrow-right"></i>
                    </a>
                </div>        
            </div>
        `);

        const links = section.links.map(toLink).join("");
        return `
            <h2 data-locale="${section.localeKey}"></h2>
            <div>
                ${links}
            </div>
        `;
    };

    const sections = notesSections.map(toElement).join("");
    render(`
        <section>
            <inner-control-buttons></inner-control-buttons>
            <h1 data-locale="notes-title"></h1>
            ${sections}
        </section>
    `);
}

function renderPage() {
    const url = getLocation();
    const currentPath = url.internal.hashpath;

    if (!currentPath || currentPath === "/") {
        renderNotesList()
        return;
    }

    const source = sources[currentPath];
    if (!source) {
        renderNotFound();
        return;
    }

    const cacheContent = cache[currentPath];
    if (cacheContent) {
        render(cacheContent);
        return;
    }

    const format = (markdown) => {
        const frontmatter = /^-{3}.*?-{3}/s;
        const markdownBlockId = /\s\^(.+-ref)$/gm;

        const directiveBlockId = (_, id) => (`:{#${id}}`);

        return markdown
            .replace(frontmatter, "")
            .replace(markdownBlockId, directiveBlockId);
    }

    const toHTML = (markdown) => {
        const resolveQuoteType = (blockquote) => {
            const firstChild = blockquote.firstElementChild;
            const text = firstChild.textContent;

            const quoteTypeRegex = /\[!(.+)\]/g;

            const type = quoteTypeRegex.exec(text)?.[1];
            if (!type)
                return;

            let content = text.replace(quoteTypeRegex, "").trim();
            if (!content)
                content = type.toUpperCase();

            blockquote.setAttribute("data-type", type);

            const css = window.getComputedStyle(blockquote);
            const color = css.getPropertyValue("--color");

            firstChild.style.color = `rgb(${color})`;
            firstChild.style.fontWeight = "bold";   

            const icon = css.getPropertyValue("--icon");
            if (!icon) {
                firstChild.textContent = content;
                return;
            }

            firstChild.innerHTML = `
                <i class="bi bi-${icon.replaceAll("'", "")}"></i> ${content}
            `;
        }

        const resolveLink = (link) => {
            const isExternalLink = (link.origin != url.origin);
            if (isExternalLink) {
                link.target = "_blank";
                return;
            }

            const isFootnoteLink = link.id.includes("footnote-ref");
            if (isFootnoteLink)
                link.textContent = `[${link.textContent}]`;

            const getHref = (link) => {
                const origin = url.internal.origin;
                const root = url.pathname;

                const source = link.pathname.replace(root, "");
                const path = getPathBySource(source);
                if (path)
                    return `${origin}#${path}`;

                return `${origin}#${url.internal.hashpath}`;
            }

            const getHeadingAnchor = (link) => {
                const invalidChars = /[.()^]/g;
                return decodeURI(link.hash)
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replace(invalidChars, "");
            }

            link.href = (getHref(link) + getHeadingAnchor(link));
            return link;
        }

        const html = HTMLParser.parseFromString(markdownParser.parse(markdown), "text/html");
        html.querySelectorAll("blockquote").forEach(resolveQuoteType);
        html.querySelectorAll("a").forEach(resolveLink);

        return html;
    }

    const renderNavBar = () => {
        const currentIndex = internalPaths.indexOf(currentPath);

        const previousPath = (currentIndex === 0)
            ? undefined : internalPaths.at(currentIndex - 1);

        const nextPath = (currentIndex + 1) === (internalPaths.length - 1)
            ? undefined : internalPaths.at(currentIndex + 1);

        const createLink = (path, icon) => {
            if (!path)
                return "<span></span>";

            return `
                <a href="#${path}" class="link-icon">
                    <i class="bi bi-${icon}"></i>
                </a>
            `;
        }

        return `
            <nav id="note-navbar">
                ${createLink(previousPath, "arrow-left")}
                <a href="#/books/sicp" class="link-icon">
                    <i class="bi bi-list"></i>
                </a>
                ${createLink(nextPath, "arrow-right")}
            </nav>
        `;
    }

    const check = (response) => {
        if (!response.ok)
            throw new Error();

        return response.text();
    }

    const build = (data) => {
        const markdown = format(data);
        const html = toHTML(markdown);

        const content = `
            <inner-control-buttons></inner-control-buttons>
            ${renderNavBar()}
            ${html.body.innerHTML}
            ${renderNavBar()}
        `;

        cache = {};
        cache[currentPath] = content;

        render(content);
    }

    fetch(`https://raw.githubusercontent.com/bhfsilva/anotacoes/refs/heads/main/${source}`)
        .then(check)
        .then(build)
        .catch(() => renderNotFound());
}

window.addEventListener("hashchange", renderPage);
renderPage();
