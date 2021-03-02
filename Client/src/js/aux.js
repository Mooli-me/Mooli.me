import { ws } from './webSocket.js';

export function randomString(len) {
  const randomData = new Uint8Array(20);
  crypto.getRandomValues(randomData);
  const randomBuffer = Buffer.from(randomData);
  const code = randomBuffer.toString('hex');
  return code;
}

export async function sha512(data) {
  const utf8 = new TextEncoder("utf-8");
  const string = utf8.encode(data);
  const hash = await crypto.subtle.digest("SHA-512",string);
  const hashArray = new Uint8Array(hash);
  const hashString = String.fromCharCode(...hashArray);
  const base64 = btoa(hashString);
  return base64;
}

export async function newIdentity () {
  return sha512(crypto.getRandomValues(new Uint32Array(10)));
}

export async function pubIdentity (identity,password=null) {
  return await sha512(`${identity}:${password}`);
}

export async function login (nameHash) {
  var request = {
    msgType: 'login',
    nameHash,
  }
  return ws.sendObj(request);
}

export async function signOn (nameHash) {
  const request = {
    msgType: 'signon',
    nameHash,
  };
  return await ws.sendObj(request);
}

export async function updateChats (chat=null, from=null) {
  const request = {
    msgType: 'get',
    chat: chat,
    fromTimestamp: from,
  };
  const response = await ws.sendObj(request);
  return response;
} 

