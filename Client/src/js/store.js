import { writable, get } from 'svelte/store';

import { ws } from './webSocket.js';

// export var windowStorage = sessionStorage;

/**
 * Declare and export stores.
 */

export const identity = writable(null);
export const chats = writable([]);
export const names = writable({});
export const lastAccesses = writable({});

export const session = writable(
	{
		loggedOn: false,
		pubIdentity: '',
		updating: false,
		guest: true,
	}
);

async function saveState () {
	if ( ws ) {
		console.log('=> Saving state...');
		const request = {
			msgType: 'saveState',
			state: {
				names: get(names),
				lastAccesses: get(lastAccesses),
			},
		};
		const response = await ws.sendObj(request);
		if ( response.ok ) {
			console.log('=> State has been saved.');
		} else {
			console.error('Error. Saving state: ', request);
		}
	}
}

names.subscribe(
	(nms)=>{
		if (Object.keys(get(names)).length > 0) saveState();
	}
);

lastAccesses.subscribe(
	(lstAcc)=>{
		if (Object.keys(get(lastAccesses)).length > 0) saveState();
	}
);