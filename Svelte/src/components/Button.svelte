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
        background-color: #ab37c8ff;
        border-radius: 0.5em;
        border-color: #ab37c8ff;
        height: 2.5em;
        min-width: 5em;
        color: #ffd5d5ff;
        font-weight: bold;
    }
    button:hover {
        background-color: black;
    }
</style>
