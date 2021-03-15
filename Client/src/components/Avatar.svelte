<script>
    import Avatars from '@dicebear/avatars';
    //import sprites from '@dicebear/avatars-jdenticon-sprites';
    import sprites from '@dicebear/avatars-identicon-sprites';

    export var id;
    export var badge = null;
    export var name = null;
    export var size = "4em";
    export var bgColor = "inherit";
    export var badgeColor = "white";

    /**
     * Avatars node module documentation:
     * https://www.npmjs.com/package/@dicebear/avatars-jdenticon-sprites
     * https://avatars.dicebear.com/styles/identicon
    */

    let options = {
        //hues: 256,
        width: size || 300,
        //height: 300,
        //colorLightness: [0.1,0.8],
        //grayscaleLightness: [0.2,0.7],
        //colorSaturation: 1,
        //grayscaleSaturation: 1,
        //colorLevel: 50,
    };
    let avatars = new Avatars(sprites, options);
    let svg = avatars.create(id);
</script>

<div id="avatar" style="--bgColor: {bgColor}">
    {@html svg}
    {#if badge}
    <div id="badge" style="--badgeColor: {badgeColor}">
        <p>{badge}</p>
    </div>
    {/if}
    {#if name}
    <div id="name">
        {name}
    </div>
    {/if}
</div>

<style>
    div#avatar {
        display: flex;
        position: relative;
        border-radius: 50%;
        background-color: var(--bgColor);
        width: min-content;
        height: min-content;
        padding: 1em;
        justify-content: center;
    }
    div#badge {
        position: absolute;
        top: 0px;
        right: 0px;
        border-radius: 50%;
        font-size: smaller;
        width: 2em;
        height: 2em;
        background-color: var(--badgeColor);
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    div#name {
        position: absolute;
        top: 100%;
        width: min-content;
    }
</style>

