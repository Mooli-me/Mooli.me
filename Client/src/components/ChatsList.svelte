<script>
    import { f7 } from 'framework7-svelte';
    import { chats, names, session } from '../js/store';
    import Avatar from './Avatar.svelte';
    import {_} from 'svelte-i18n';

    const router = f7.view.main.router;

    var myChats;

    function chatClickHandler (url) {
        console.log(url)
        router.navigate('Chat'+url)
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
                            myChats = [...myChats, chatObj];
                            console.log(myChats)
                        }
                    )
                } else {
                    chatObj = {};
                    chatObj.URL = `/${encodeURIComponent(chat.id)}/null/`;
                    chatObj.id = chat.owner;
                    chatObj.name = $names[chat.owner] ? $names[chat.owner] : '...';
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
        bgColor="pink" 
        badgeColor="indigo"
        on:click={()=>{chatClickHandler(item.URL)}}
    />
{/each}
</div>
<style>

</style>