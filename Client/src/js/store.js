import { writable, get } from 'svelte/store';

import { ws } from './webSocket.js';

/*async function createGuestId () {
	const sessionVal = get(session);
	const id = await newIdentity();
	identity.set(id);
	sessionVal.guest = true;
	session.set(sessionVal);
}*/

function getSaved (storage) {
	const savedJSON = window.localStorage.getItem(storage) || "null";
	const savedData = JSON.parse(savedJSON);
	return savedData;
}

//export var windowStorage = window.localStorage.getItem('identity') ? localStorage : sessionStorage;
export var windowStorage = sessionStorage;

/**
 * Declare and export stores.
 */

/*export const identity = writable(getSaved('identity') || '' );
export const chats = writable(getSaved('chats') || [] );
export const names = writable(getSaved('names') || {} );*/
export const identity = writable(null);
export const chats = writable([]);
export const names = writable({});
export const lastAccesses = writable({});

export const session = writable(
	{
		loggedOn: false,
		pubIdentity: '',
		updating: false,
		//guest: get(identity) ? false : true,
		guest: true,
	}
);

async function saveState () {
	if ( ws ) {
		const request = {
			msgType: 'saveState',
			state: {
				names: get(names),
				lastAccesses: get(lastAccesses),
			},
		};
		const response = await ws.sendObj(request);
		if ( ! response.ok ) console.error(request);
	}
}
/**
 * Update localStorage on stores changes.
 */

identity.subscribe(
	(identity)=>{
		const identityJSON = JSON.stringify(identity);
		windowStorage.setItem('identity', identityJSON);
	}
);
chats.subscribe(
	(chats)=>{
		const chatsJSON = JSON.stringify(chats);
		windowStorage.setItem('chats', chatsJSON);
	}
);
names.subscribe(
	(names)=>{
		saveState()
	}
);
lastAccesses.subscribe(
	(lastAccesses)=>{
		saveState()
	}
)

/**
 * Create identity if no identity found.
 */

//if ( ! get(identity) ) createGuestId();
