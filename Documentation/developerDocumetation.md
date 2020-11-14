# IndySMS

## TOC
- [IndySMS](#indysms)
  - [TOC](#toc)
  - [Service](#service)
    - [DB documents](#db-documents)
    - [API dialogs:](#api-dialogs)
      - [Signon](#signon)
      - [Challege](#challege)
      - [Login](#login)
      - [Get](#get)
      - [Put](#put)
      - [Logout](#logout)
      - [Updates notification](#updates-notification)
      - [General error response](#general-error-response)

## Service

### DB documents
|Document|user|
|-|-|
|nameHash|```string```|
|p2pChats|```[chat.id,...]```|
|m2mChats|```[chat.id,...]```|

|Document|chat|
|-|-|
|id|```crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}).digest('base64').slice(idx,5);```|
|owner|```user.nameHash```|
|type|```p2pChat|m2mChat```|
|peers|```[user.nameHash,...]```|
|peer|```user.nameHash```|

|Document|message|
|-|-|
|chat|```chat.id```|
|user|```user.nameHash```|
|time|```Date.now()```|
|content|```URL(https://safenote.co/file-sharing-api) | string```|
|type|``` file | string ```|

### API dialogs:
#### Signon
```JavaScript
request: {
  msgType: 'signon',
  nameHash: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${crypto.getRandomValues(new Uint32Array(10))}`:`${password}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
}
response: {
  message: null | 'Error description',
  ok: boolean,
}
```
#### Challege
```JavaScript
request: {
  msgType: 'challenge',
}
response: {
  message: crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}`).digest('base64'),
  ok: boolean,
}
```
#### Login
```JavaScript
request: {
  msgType: 'login',
  nameHash: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${nameSeed}`:`${password}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
  challengeAnswer: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${nameHash}:${challenge}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
}
response: {
  message: null | 'Error description',
  ok: boolean,
}
```
#### Get
```JavaScript
request: {
  msgType: 'get',
  chat: chat.id,
  fromTimestamp: timestamp,
}
response: {
  message: [...messages] | 'Error description',
  ok: boolean,
}
```
#### Put
```JavaScript
request: {
  msgType: 'put',
  chat: chat.id,
  content: URL('https://safenote.co/file-sharing-api') | 'string';
  type: 'file' | 'string';
}
response: {
  message: [...messages] | 'Error description',
  ok: boolean,
}
```
#### Logout
```JavaScript
request: {
  msgType: 'logout',
}
response: {
  message: null,
  ok: true,
}
```
#### Updates notification
```JavaScript
request: {
  msgType: 'updates',
}
response: {
  ok: boolean,
}
```
#### General error response
```JavaScript
response: {
  message: 'Error description',
  ok: false,
}
```