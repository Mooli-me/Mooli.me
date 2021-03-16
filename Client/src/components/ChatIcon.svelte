<script>
    import { createEventDispatcher } from 'svelte';

    import Avatar from './Avatar.svelte';

    export var item;

    const dispatch = createEventDispatcher();
</script>

<Avatar id="{item.id}" name="{item.id}" badge="{item.peers.length}" {...$$restProps} on:click="{() => dispatch('click')}"/>