<script>
    import { createEventDispatcher } from 'svelte';
    import { identity, names } from '../js/store.js';

    import Avatar from './Avatar.svelte';

    export var item;

    const dispatch = createEventDispatcher();
</script>

{#if item.owner === $identity}
<Avatar id="{item.id}" name="{$names[item.id] || item.id}" badge="{item.peers.length}" {...$$restProps} on:click="{() => dispatch('click')}"/>
{:else}
<Avatar id="{item.id}" name="{$names[item.id] || item.id}" {...$$restProps} on:click="{() => dispatch('click')}"/>
{/if}