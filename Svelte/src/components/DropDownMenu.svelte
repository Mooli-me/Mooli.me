<script>
    export var showMenuContents = false;
    function toggleMenu () {
        showMenuContents = ! showMenuContents;
    }
</script>

<div id="menu">
    <div id="button" on:click="{toggleMenu}">
        <slot name="button">
            <img src="/static/menu.svg" alt="Menu button"/>
        </slot>
    </div>
    {#if showMenuContents}
    <div id="menuContents">
        <slot name="menuContents">
            <p>"menuContents" slot.</p>
        </slot>
    </div>
    {/if}
</div>

<style>
    div {
        position: relative;
    }
    div#button {
		padding: 1em;
	}
    div#button * {
        height: 2em;
        width: 2em;
    }
    div#menuContents {
        position: absolute;
        min-width: 200px;
        top: 100%;
        right: 0px;
        z-index: 1;
        background-color: var(--bars-background-color);
        padding: 0 1em;
        border-radius: 0.5em;
    }
    div#menuContents div {
		background-color: var(--bars-background-color);
    }
</style>
