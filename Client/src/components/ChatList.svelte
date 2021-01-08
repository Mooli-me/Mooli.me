<script>
    import {
        List,
        ListItem,
    } from 'framework7-svelte';

    import {_} from 'svelte-i18n';

    export var chats

</script>

<List>
{#each chats as item, idx }
{#if item.messages.length}
<ListItem link="/Chat/{idx}" title={item.id} badge={item.messages.length}>
    <img alt={item.type} src="/static/{item.type}.png" slot="media">
</ListItem>
{:else}
<ListItem link="/Chat/{idx}" title={item.id}>
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