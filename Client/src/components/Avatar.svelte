<script>
    import Avatars from '@dicebear/avatars';
    //import sprites from '@dicebear/avatars-jdenticon-sprites';
    import sprites from '@dicebear/avatars-identicon-sprites';

    export var id;
    export var size = null;

    /**
     * Avatars node module documentation:
     * https://www.npmjs.com/package/@dicebear/avatars-jdenticon-sprites
    */

    let options = {
        //hues: 256,
        width: size || 300,
        //height: 300,
        //colorLightness: [0.1,0.8],
        //grayscaleLightness: [0.2,0.7],
        //colorSaturation: 1,
        //grayscaleSaturation: 1,
        colorLevel: 50,
    };
    let avatars = new Avatars(sprites, options);
    let svg = avatars.create(id);
</script>

{@html svg}

<style></style>

