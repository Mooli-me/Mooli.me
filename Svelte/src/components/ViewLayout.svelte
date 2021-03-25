<script>

</script>

<div id="viewport">

    <div id="header" class="bar">

        <div class="left">
            <slot name="hleft" class>
                "hleft" slot content
            </slot>
        </div>

        <div class="center">
            <slot name="hcenter">
                "hcenter" slot content
            </slot>
        </div>

        <div class="right">
            <slot name="hright">
                "hright" slot content
            </slot>
        </div>

    </div>

    <div id="main">
        <slot name="main">
            "main" slot content
        </slot>
    </div>

    <div id="footer" class="bar">

        <div class="left">
            <slot name="fleft" class>
                "fleft" slot content
            </slot>
        </div>

        <div class="center">
            <slot name="fcenter">
                "fcenter" slot content
            </slot>
        </div>

        <div class="right">
            <slot name="fright">
                "fright" slot content
            </slot>
        </div>

    </div>
</div>

<style>

    div {
        box-sizing: border-box;
        position: relative;
        background-color: var(--background-color);
    }
    
    div#viewport {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-between;
    }

    div#viewport > div {
        flex-grow: 0;
        display: flex;
    }

    div#viewport > div#main {
        flex-grow: 1;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-evenly;
        align-items: center;
    }
    
    div.bar {
        width: 100%;
        height: 4em;
        background-color: var(--background-color);
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-between;
    }

    div.bar > div {
        display: flex;
        flex-grow: 0;
        align-items: center;
    }

    div.bar > div > :global(*) {
        /**
        Ejemplo de CSS para elementos que se van a incrustar
        Usando :global() inicando la etiqueta que se incrustará
        a la que pretendemos afectar. Hacemos que los elementos
        incrustados en los slots tengan el alto de la barra.
        */
        height: 100%;
    }

    div.bar > div.center {
        flex-grow: 1;
        justify-content: center;
    }

    div.bar > div.right {
        padding-right: 1em;
        flex-flow: row-reverse;
    }

    div.bar > div.left {
        padding-left: 1em;
    }

</style>
