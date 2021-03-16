<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * *** Props:
     * sections: Array of objects like {title:string,contents:array}
     * childComponent: svelte:component for handle sections.contents items. Will recive "item" prop and $$restProps.
     * *** Event dispatcher
     * on:click: CustomEvent.detail: section item.
     */

    export var sections = [];
    export var childComponent;
    
    const dispatch = createEventDispatcher();

    var activeSection = 0;

</script>

<div id="TabbedSections">
    <nav>
        <ol id="tabs">
            <li class="cover"></li>
            {#each sections as section, idx}
            <li class="navItem" on:click="{()=>{activeSection=idx}}" class:active={activeSection === idx}>{section.title}</li>
            {/each}
            <li class="cover"></li>
        </ol>
    </nav>
    <div id="tabContents">
    {#each sections as section, idx}
        {#if activeSection === idx}
            {#each section.contents as item}
            <svelte:component this="{childComponent}" on:click="{() => dispatch('click',item)}" item="{item}" {...$$restProps}/>
            {:else}
            <p>No hay galerías en esta categoría, por el momento.</p>
            {/each}
        {/if}
    {/each}
    </div>
</div>

<style>
    * {
        --radius: 0.5em
    }
    div#tabContents {
        border-style: none solid solid solid;
        border-radius: 0 0 var(--radius) var(--radius);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        min-height: 3em;
    }
    ol#tabs {
        padding: 0px;
        margin: 0px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    ol#tabs > li {
        list-style: none;
        border-style: solid;
        padding: 1em;
        border-radius: var(--radius) var(--radius) 0 0;
        flex-grow: 1;
    }
    ol#tabs > li.cover {
        list-style: none;
        border-style: none;
        border-bottom-style: solid;
        padding: 1em;
        border-radius: 0;
    }
    ol#tabs > li.active {
        border-bottom-style: none;
    }
</style>