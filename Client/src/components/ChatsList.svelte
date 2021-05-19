<script>
    import { f7 } from 'framework7-svelte';
    import { chats, lastAccesses, names, session } from '../js/store';
    import Avatar from './Avatar.svelte';
    import {_} from 'svelte-i18n';

    const router = f7.view.main.router;

    let myChats;

    function messagesData (chat, destId) {
        const messages = chat.type === 'm2m' ? chat.messages : chat.messages.filter(
            (msg) => {
                if ( $session.pubIdentity === chat.owner ) {
                    return msg.destination === null && msg.user === destId || msg.destination === destId && msg.user === $session.pubIdentity;
                } else {
                    return msg.destination === $session.pubIdentity || msg.user === $session.pubIdentity;
                }
            }
        );
        return messages;
    }

    function pendingMessages (chat,destId,lastAccessId) {
        const messages = messagesData(chat,destId);
        const lastAccess = $lastAccesses[lastAccessId] || 0;
        const unreadedMessages = messages.filter(
            msg => msg.time > lastAccess
        )
        return unreadedMessages.length;
    }

    function chatClickHandler (url) {
        router.navigate('/Chat'+url)
    }

    $: if ( $chats ) {
        myChats = [];
        $chats.forEach(
            chat=>{
                let chatObj;
                if (chat.owner === $session.pubIdentity) {
                    chat.peers.forEach(
                        peer=>{
                            chatObj = {};
                            chatObj.URL = `/${encodeURIComponent(chat.id)}/${encodeURIComponent(peer)}/`;
                            chatObj.id = peer;
                            chatObj.name = `${$names[peer] ? $names[peer] : '...'} - ${$names[chat.id] ? $names[chat.id] : chat.id}`;
                            chatObj.pending = pendingMessages(chat,peer,chat.id+peer);
                            myChats = [...myChats, chatObj];
                        }
                    )
                } else {
                    chatObj = {};
                    chatObj.URL = `/${encodeURIComponent(chat.id)}/null/`;
                    chatObj.id = chat.owner;
                    chatObj.name = $names[chat.owner] ? $names[chat.owner] : '...';
                    chatObj.pending = pendingMessages(chat,$session.pubIdentity,chat.id+null);
                    myChats = [...myChats, chatObj]
                }
            }
        )
    }
</script>
<div>
{#each myChats as item (item.URL) }
    <Avatar 
        id={item.id} 
        name={item.name}
        badge={item.pending}
        bgColor="pink" 
        badgeColor="indigo"
        on:click={()=>{chatClickHandler(item.URL)}}
    />
{/each}
</div>
<style>

</style>