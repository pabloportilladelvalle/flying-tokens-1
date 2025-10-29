import { MODULE } from "./const.js"

export let enableFT = true;
export let enableForAll = false;
export let chatOutput = true;
export let notificationOutput = false;
export let enableZoom = false;
export let optMovement = true;
export let optNoShadow = true;
export let optWind = true;
export let customScale = null;

export function registerSettings() {
    game.settings.register(MODULE, 'enableFT', {
        name: 'Automatic Apply',
        hint: `Check this option if you would like to have tokens with flight movement automatically fly when increasing their elevation. If this setting is disabled you can still have Flying Tokens to work on individual tokens.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => cacheSettings(),
    });
    // ... rest unchanged ...
}

export function cacheSettings() {
    enableFT = game.settings.get(MODULE, 'enableFT');
    enableForAll = game.settings.get(MODULE, 'enableForAll');
    chatOutput = game.settings.get(MODULE, 'chatOutput');
    notificationOutput = game.settings.get(MODULE, 'notificationOutput');
    customScale = game.settings.get(MODULE, 'customScale');
    enableZoom = game.settings.get(MODULE, 'enableZoom');
    optMovement = game.settings.get(MODULE, 'optMovement');
    optNoShadow = game.settings.get(MODULE, 'optNoShadow');
    optWind = game.settings.get(MODULE, 'optWind');
}
