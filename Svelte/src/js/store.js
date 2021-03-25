import { writable, get } from 'svelte/store';

import { newIdentity } from './aux.js';

async function createGuestId () {
	const sessionVal = get(session);
	const id = await newIdentity();
	identity.set(id);
	session.set(sessionVal);
}

/**
 * Reading from localStorage or initializing.
 */

const savedIdentityJSON = window.localStorage.getItem('identity') || "null";
const savedIdentity = JSON.parse(savedIdentityJSON);

const savedChatsJSON = window.localStorage.getItem('chats') || "null";
const savedChats = JSON.parse(savedChatsJSON);

/**
 * Declare and export stores.
 */

export const chats = writable(savedChats);
export const names = writable({DefR: "Mi chat"});
export const identity = writable('mio');

export const session = writable(
	{
		loggedOn: false,
		pubIdentity: '',
		updating: false,
		guest: savedIdentity ? false : true,
	}
);

export var windowStorage = ! savedIdentity ? sessionStorage : localStorage;

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

/**
 * Create identity if no identity found.
 */

if ( ! savedIdentity ) createGuestId();