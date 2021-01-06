# Mooli.me

## TOC
- [Mooli.me](#moolime)
  - [TOC](#toc)
  - [Service](#service)
    - [DB documents](#db-documents)
  - [Client](#client)
    - [General description](#general-description)
      - [Initialization proccess](#initialization-proccess)
  - [API dialogs:](#api-dialogs)
    - [Signon](#signon)
    - [Challenge](#challenge)
    - [Login](#login)
    - [New chat](#new-chat)
    - [Get](#get)
    - [Put](#put)
    - [Logout](#logout)
    - [Updates notification](#updates-notification)

## Service

### DB documents
|Document|user|
|-|-|
|nameHash|```random string: crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${crypto.getRandomValues(new Uint32Array(10))}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash))))```|
|chats|```[]```|

|Document|chat|
|-|-|
|id|```random string: crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}).digest('base64').slice(idx,5);```|
|owner|```user.nameHash```|
|type|```p2p|m2m```|
|peers|```[user.nameHash,...]```|
|peerRequests|```[user.nameHash,...]```|
|bannedIds|```[user.nameHash,...]```|

|Document|message|
|-|-|
|chat|```chat.id```|
|user|```user.nameHash```|
|time|```Date.now()```|
|content|```URL(https://safenote.co/file-sharing-api) | string```|
|type|``` file | string ```|

## Client

### General description

#### Initialization proccess

1. No local identity
   1. Ask for creating a Identity
   2. Ask for password
   3. Create random identity
   4. Signup message
   5. Save identity
   6. Login
2. Local identity, login unsuccessfull
   1. Ask for signup with current identity (show id information for validation), create new identity or clean current identity.
3. Login successfull
   1. Update burrows lists
   2. Update message lists
   3. Show disappeared burrows
   4. Show existent burrows
      1. Icon?
      2. Name/id
      3. Type
      4. new messages number
4. Enter in a burrow
   1. Show burrow info
   2. Show burrow messages
## API dialogs:
API is based in asyncronous WebSocket messages.

All API messages follow this template:
```JavaScript
{
  'code': string,
  'obj': JSON,
}
```
|Field|Purpouse|
|-|-|
|*code*|Unique id for each client message. Provides a way to asyncronous asociate responses and queries.|
|*obj*|Query/response content|
### Signon
```JavaScript
request: {
  msgType: 'signon',
  nameHash: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${crypto.getRandomValues(new Uint32Array(10))}`:`${password}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
};
response: {
  message: ```{chats: user.chats}``` | 'Error description',
  ok: boolean,
};
```
### Challenge
*For future use*
```JavaScript
request: {
  msgType: 'challenge',
};
response: {
  message: crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}`).digest('base64'),
  ok: boolean,
};
```
### Login
```JavaScript
request: {
  msgType: 'login',
  nameHash: nameHash,
  challengeAnswer: placeholder for future cryptographic signature,
};
response: {
  message: null | 'Error description',
  ok: boolean,
};
```
### New chat
```JavaScript
request: {
  msgType: 'chat',
  type: p2p | m2m,
};
response: {
  message: id | 'Error description',
  ok: boolean,
};
```
### Get
```JavaScript
request: {
  msgType: 'get',
  chat: chat.id || null,
  fromTimestamp: timestamp || null,
};
response: {
  message: [ {[chatId]:[...messages]}, ... ] | 'Error description',
  ok: boolean,
};
```
### Put
```JavaScript
request: {
  msgType: 'put',
  chat: chat.id,
  content: URL('https://safenote.co/file-sharing-api') | 'string';
  type: 'file' | 'string';
};
response: {
  message: [...messages] | 'Error description',
  ok: boolean,
};
```
### Logout
```JavaScript
request: {
  msgType: 'logout',
};
response: {
  ok: true,
};
```
### Updates notification
```JavaScript
request: {
  msgType: 'updates',
  update: {},
};
response: {
  ok: boolean,
};
```

