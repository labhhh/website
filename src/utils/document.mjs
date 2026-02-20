export function createLinkElement({ href = "" } = {}) {
    if (!href)
        return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;

    return link;
}

export function focusById(id) {
    const scrollTop = () => window.scrollTo({ top: 0 });

    id = decodeURI(id?.replace("#", ""));
    if (!id) {
        scrollTop();
        return;
    }

    const element = document.getElementById(id);
    if (!element) {
        scrollTop();
        return;
    }

    element.scrollIntoView({ block: "start" });
    element.focus({ preventScroll: true });
}

export function getLocation() {
    const href = location.href;
    const url = new URL(href);

    const notEmpty = Boolean;
    let pagename = url.pathname.split("/").filter(notEmpty).pop();

    const isRoot = (url.pathname === `/${pagename}/` ||  url.pathname === "/");
    if (isRoot)
        pagename = "index";

    //TODO add regex
    const [ origin, hashpath, hash ] = href.split("#");

    url.internal = {
        hash: (hash ? decodeURI(hash) : ""),
        pagename: pagename,
        hashpath: hashpath,
        isRoot: isRoot,
        origin: origin
    }

    return url;
}
