<script>
    import {
        List,
        ListItem,
    } from 'framework7-svelte';

    import {_} from 'svelte-i18n';

    export var chats

    console.log(chats)
</script>

<List>
{#each chats as item, id }
{#if item.messages.length}
<ListItem link="#" title={item.id} badge={item.messages.length}>
    <img alt={item.type} src="/static/{item.type}.png" slot="media">
</ListItem>
{:else}
<ListItem link="/Chat/{item.id}" title={item.id}>
    <img id="typeIcon" alt={item.type} src="/static/{item.type}.png" slot="media">
</ListItem>
{/if}
{:else}
{$_('Components.ChatList.mainThereIsNotChatsToShow')}
{/each}
</List>

<style>
    img#typeIcon {
        height: 4em;
    }
</style>