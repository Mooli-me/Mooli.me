<script>
    import {
        List,
        ListItem,
    } from 'framework7-svelte';

    import {_} from 'svelte-i18n';

    export var chats
</script>

<List>
{#each chats as item, id }
    <ListItem link="#" title= {item} after="Cleaner" badge="5">
      <i slot="media" class="icon demo-list-icon" />
    </ListItem>
{:else}
    <ListItem link="#" title= {item} after="Cleaner" badge="5">
        <i slot="media" class="icon demo-list-icon" />
    </ListItem>
{$_('ChatList.mainThereIsNotChatsToShow')}
{/each}
</List>

<style>

</style>