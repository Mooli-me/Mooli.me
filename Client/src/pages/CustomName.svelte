<script>

    import {
    f7,
    Page,
    Navbar,
    NavTitle,
    NavLeft,
    Link,
    Icon,
    PageContent,
    } from 'framework7-svelte';

    import { names } from '../js/store.js'

    import Avatar from '../components/Avatar.svelte';

    export var id;
    
    var name = $names[id] || '';

    var router = f7.view.main.router;

    function submitHandler (ev) {
        ev.preventDefault();
        router.back();
    }

    $: {
        $names[id] = name;
    }

</script>

<Page name="home"  pageContent=false>

    <Navbar backLink>
        <NavTitle>Nombre personalizado para {id}</NavTitle>
    </Navbar>

    <PageContent class="display-flex flex-direction-column justify-contents-center align-content-space-around align-contents-center" style="padding-top: 0px;">
        <Avatar id={id} name={$names[id] || id}/>
        <form on:submit={submitHandler}>
            <input type="text" placeholder="Escribe tu nombre para {id}..." bind:value={name}/>
            <p>El nombre que tú elijas se almacenará sólo en tu teléfono. No se compartirá con nandie.</p>
            <input type="submit" value="Listo!">
        </form>
    </PageContent>

</Page>

<style>
    input {
        border-style: solid;
        padding: 1em;
    }
</style>