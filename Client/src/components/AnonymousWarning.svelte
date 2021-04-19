<script>
    import { session } from '../js/store';
    var show = true;
</script>

{#if $session.guest && show}
<div id="warning">
    <img id="close" on:click={()=>{show=false}} src="/static/icons/cerrar.svg" alt="cerrar"/>
    <p>Si quieres conservar tus conversaciones y poder continuarlas en el futuro, inicia sesión</p>
    <button id="login" on:click>
        Login
    </button>
</div>
{/if}

<style>
    div#warning {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: red;
    }
    img#close {
        width: 2em;
        height: 2em;
        margin: 1em;
    }
    button#login {
        height: 80%;
    }
</style>