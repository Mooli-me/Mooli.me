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

    import { names, session } from '../js/store.js'

    import Avatar from '../components/Avatar.svelte';

    export var id;
    
    var name = $names[id] || '';

    var router = f7.view.main.router;

    function submitHandler (ev) {
        ev.preventDefault();
        router.back();
    }

    function accessControl (flag = false) {
        if ( flag ) {
            if ( ! $session.loggedOn ) {
                router.navigate(`/Login/${encodeURIComponent(`/CustomName/${id}/`)}/`);
            }
        } else {
            setTimeout(()=>accessControl(true),500);
        }
    }

    accessControl();

    $: {
        $names[id] = name;
    }

</script>

<Page name="home"  pageContent=false>

    <Navbar backLink>
        <NavTitle>Establecer nombre personalizado</NavTitle>
    </Navbar>

    <PageContent class="display-flex flex-direction-column justify-contents-center align-content-space-around align-contents-center" style="padding-top: 0px;">
        <Avatar id={id} name={$names[id] || '...'}/>
        <form on:submit={submitHandler}>
            <input type="text" placeholder="..." bind:value={name}/>
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