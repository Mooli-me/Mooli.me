<script>

    import { f7 } from 'framework7-svelte';

    var router = f7.view.main.router;

    var galleryCode;

    function enterTheGallery (ev) {
        if (galleryCode) router.navigate(`/${encodeURIComponent(galleryCode)}`)
    }
    
</script>

<div id="InputCode" class="card">
    <div id="form">
        <input id="galleryCode" type="text" maxlength="6" bind:value={galleryCode} placeholder="Código para entrar en galería"/>
        <img id="go" src="/static/icons/go.svg" on:click={enterTheGallery} alt="Go"/>
    </div>
</div>

<style>
    div.card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
    }
    div#form {
        display: flex;
        flex-direction: row;
    }
    input#galleryCode {
        background-color: white;
        color: black;
        padding: 1em;
        font-size: large;
        text-align: center;
        width: 100%;
        flex-grow: 1;
    }
    img#go {
        width: 3em;
        flex-grow: 0;
        background-color: white;
    }
</style>