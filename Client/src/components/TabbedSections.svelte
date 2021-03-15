<script>
    /**
     * *** Props:
     * sections: Array of objects like {title,contents}
     * contentsComponent: svelte:component
     * childPropsKeys: Section key list for use as props for svelte:component. Ex.: ['name','age','bio']
     */

    export var sections = [];
    export var contentsComponent;
    export var childPropsKeys = [];

    var activeSection = 0;
    var childProps = [];

    sections.forEach(
        (section,idx)=>{
            var props = {};
            childPropsKeys.forEach(
                key => props[key] = section[key]
            )
            childProps[idx] = props;
        }
    )

</script>

<div>
    <div id="tabs">
    {#each sections as section, idx}
        {section.title}
    {/each}
    </div>
    <div id="tabContents">
    {#each sections as section, idx}
        {#if activeSection === idx}
            {idx}
            <svelte:component this="{contentsComponent}" {...childProps[idx]}/>
        {/if}
    {/each}
    </div>
</div>
