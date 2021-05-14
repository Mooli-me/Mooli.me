<script>
    import { f7 } from 'framework7-svelte';
    import { chats, lastAccesses, names, session } from '../js/store';
    import Avatar from './Avatar.svelte';
    import {_} from 'svelte-i18n';

    const router = f7.view.main.router;

    var myChats;

    function pendingMessages (chat,lastAccessId) {
        const lastAccess = $lastAccesses[lastAccessId] || 0;
        const unreadMessages = chat.messages.filter(
            (msg)=>msg.time >= lastAccess
        )
        return unreadMessages.length;
    }

    function chatClickHandler (url) {
        router.navigate('/Chat'+url)
    }

    $: {
        myChats = [];
        $chats.forEach(
            chat=>{
                var chatObj;
                if (chat.owner === $session.pubIdentity) {
                    chat.peers.forEach(
                        peer=>{
                            chatObj = {};
                            chatObj.URL = `/${encodeURIComponent(chat.id)}/${encodeURIComponent(peer)}/`;
                            chatObj.id = peer;
                            chatObj.name = `${$names[peer] ? $names[peer] : '...'} - ${$names[chat.id] ? $names[chat.id] : chat.id}`;
                            chatObj.pending = pendingMessages(chat,chat.id+peer);
                            myChats = [...myChats, chatObj];
                        }
                    )
                } else {
                    chatObj = {};
                    chatObj.URL = `/${encodeURIComponent(chat.id)}/null/`;
                    chatObj.id = chat.owner;
                    chatObj.name = $names[chat.owner] ? $names[chat.owner] : '...';
                    chatObj.pending = pendingMessages(chat,chat.id+null);
                    myChats = [...myChats, chatObj]
                }
            }
        )
    }
</script>
<div>
{#each myChats as item (item.id) }
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