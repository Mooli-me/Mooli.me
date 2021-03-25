import { writable, derived } from 'svelte/store';

const url = writable('/');

function getPath (urlString) {
    var path = []
    var url = new URL(urlString, 'http://localhost/');
    var path = url.pathname.split('/');
    path.shift();
    return path;
}

function getQuery (urlString) {
    var query = {};
    var url = new URL(urlString, 'http://localhost/');
    url.searchParams.forEach(
        (value, key) => query[key] = value
    );
    return query;
}

const path = derived(url, $url => getPath($url));

const query = derived(url, $url => getQuery($url));

export {
    url,
    path,
    query,
}