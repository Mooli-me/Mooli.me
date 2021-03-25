<script>

    import { names } from '../js/store.js'

    import Avatar from '../components/Avatar.svelte';

    export var id;
    
    var name = $names[id] || '';

    function submitHandler (ev) {
        ev.preventDefault();
    }

    $: {
        $names[id] = name;
    }

</script>

        <Avatar id={id} name={$names[id] || id}/>
        <form on:submit={submitHandler}>
            <input type="text" placeholder="Escribe tu nombre para {id}..." bind:value={name}/>
            <p>El nombre que tú elijas se almacenará sólo en tu teléfono. No se compartirá con nandie.</p>
            <input type="submit" value="Listo!">
        </form>


<style>
    input {
        border-style: solid;
        padding: 1em;
    }
</style>