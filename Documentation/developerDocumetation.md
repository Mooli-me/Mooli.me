# IndySMS

## TOC
- [IndySMS](#indysms)
  - [TOC](#toc)
  - [Service](#service)
    - [DB documents](#db-documents)
    - [API dialogs:](#api-dialogs)
      - [Signon](#signon)
      - [Challenge](#challenge)
      - [Login](#login)
      - [Get](#get)
      - [Put](#put)
      - [Logout](#logout)
      - [Updates notification](#updates-notification)

## Service

### DB documents
|Document|user|
|-|-|
|nameHash|```random string: crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${crypto.getRandomValues(new Uint32Array(10))}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash))))```|
|p2pChats|```[chat.id,...]```|
|m2mChats|```[chat.id,...]```|

|Document|chat|
|-|-|
|id|```random string: crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}).digest('base64').slice(idx,5);```|
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
  msgType: 'signon',
  message: null | 'Error description',
  ok: boolean,
}
```
#### Challenge
```JavaScript
request: {
  msgType: 'challenge',
}
response: {
  msgType: 'challenge',
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
  msgType: 'login',
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
  msgType: 'get',
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
  msgType: 'put',
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
  msgType: 'logout',
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
  msgType: 'updates',
  ok: boolean,
}
```