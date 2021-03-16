<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    function clickHandler () {
        dispatch("click");
    }
</script>

<button on:click="{clickHandler}">
    <slot>Give me content...</slot>
</button>

<style>
    button {
        background-color: white;
        border-radius: 1.5em;
        height: 3em;
        min-width: 5em;
    }
    button:hover {
        background-color: black;
    }
</style>