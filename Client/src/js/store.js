import { writable } from 'svelte/store';

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
	}
);

/**
 * Update localStorage on stores changes.
 */

identity.subscribe(
	(identity)=>{
		const identityJSON = JSON.stringify(identity);
		localStorage.setItem('identity', identityJSON);
	}
);
chats.subscribe(
	(chats)=>{
		const chatsJSON = JSON.stringify(chats);
		localStorage.setItem('chats', chatsJSON);
	}
);