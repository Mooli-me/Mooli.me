import { writable, get } from 'svelte/store';

import { newIdentity, pubIdentity, signOn, login } from './aux.js';

async function createGuestId () {
	const sessionVal = get(session);
	sessionVal.updating = true;
	session.set(sessionVal);
	const id = await newIdentity();
	identity.set(id);
	const nameHash = await pubIdentity(id);
	const signOnResponse = await signOn(nameHash);
	const loginResponse = await login(nameHash);
	if ( ! signOnResponse.ok ) console.error('Signon error');
	if ( loginResponse.ok ) {
		sessionVal.loggedOn = true;
		sessionVal.pubIdentity = nameHash;
		session.set(sessionVal);
	} else {
		console.error('Login error');
	}
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

export const identity = writable(savedIdentity);
export const chats = writable(savedChats);

export const session = writable(
	{
		loggedOn: false,
		pubIdentity: '',
		updating: false,
		guest: savedIdentity ? false : true,
	}
);

/**
 * Select window storage
 */

var windowStorage = ! savedIdentity ? sessionStorage : localStorage;

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