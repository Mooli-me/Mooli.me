# IndySMS

## TOC
- [IndySMS](#indysms)
  - [TOC](#toc)
  - [Service](#service)
    - [Documents](#documents)
    - [Messages](#messages)

## Service

### Documents
|Document|user|
|-|-|
|nameHash|Node: ```CryptoJS.SHA512(`${secretKey}${pin}`);``` browser: ```crypto.subtle.digest("SHA-256",new TextEncoder("utf-8").encode(str)).then(hash=>hex(hash));```|
|p2pChats|```[chat.id,...]```|
|m2mChats|```[chat.id,...]```|

|Document|chat|
|-|-|
|id|```crypto.createHash('sha1').update(Date.now().toString()).digest('base64').slice(idx,5);```|
|owner|```user.nameHash```|
|type|```p2pChats|m2mChats```|
|peers|```[user.nameHash,...]```|
|peer|```user.nameHash```|

|Document|message|
|-|-|
|id|``` `${chat.id}:${user.nameHash}:${timestamp}` ```|
|time|```Date.now()```|
|user|```user.nameHash```|
|chat|```[chat.id,...]```|
|content|```buff.toString('base64'); | null```|
|file|``` filePath | null ```|

### Messages
* Request:
```json
{
    "user": "user.id",
    "chat": "chat.id",
    "signature": "ECDSA signature",
    "msgType": "get|push|delete",
    "startPoint": int
}
```
* Response: