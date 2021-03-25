import { writable, get } from 'svelte/store';

import { newIdentity } from './aux.js';

async function createGuestId () {
	const sessionVal = get(session);
	const id = await newIdentity();
	identity.set(id);
	sessionVal.guest = true;
	session.set(sessionVal);
}

function getSaved (storage) {
	const savedJSON = window.localStorage.getItem(storage) || "null";
	const savedData = JSON.parse(savedJSON);
	return savedData;
}

export var windowStorage = localStorage.getItem('identity') ? localStorage : sessionStorage;

/**
 * Declare and export stores.
 */

export const identity = writable(getSaved('identity') || '' );
export const chats = writable(getSaved('chats') || [] );
export const names = writable(getSaved('names') || {} );

export const session = writable(
	{
		loggedOn: false,
		pubIdentity: '',
		updating: false,
		guest: get(identity) ? false : true,
	}
);

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
		const namesJSON = JSON.stringify(names);
		windowStorage.setItem('names', namesJSON);
	}
);

/**
 * Create identity if no identity found.
 */

if ( ! get(identity) ) createGuestId();
