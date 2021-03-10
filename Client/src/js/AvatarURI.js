/**
 * Avatars node module documentation:
 * https://www.npmjs.com/package/@dicebear/avatars-jdenticon-sprites
 * https://avatars.dicebear.com/styles/identicon
*/

import Avatars from '@dicebear/avatars';
//import sprites from '@dicebear/avatars-jdenticon-sprites';
import sprites from '@dicebear/avatars-identicon-sprites';


const options = {
    //hues: 256,
    width: 300,
    //height: 300,
    //colorLightness: [0.1,0.8],
    //grayscaleLightness: [0.2,0.7],
    //colorSaturation: 1,
    //grayscaleSaturation: 1,
    //colorLevel: 50,
};

const avatars = new Avatars(sprites, options);

export function avatar (id) {
    const svg = avatars.create(id);
    const b64 = btoa(svg);
    const uri = `data:image/svg+xml;base64,${b64}`;
    return uri;
}