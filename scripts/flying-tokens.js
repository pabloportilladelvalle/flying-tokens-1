import { MODULE, MODULE_DIR } from "./const.js";
import { chatMessage } from "./util.js";
import { registerSettings, cacheSettings, enableFT, enableForAll, enableZoom, chatOutput, notificationOutput, optMovement, optNoShadow, optWind, customScale } from "./settings.js";
import { FlyingHud } from "./flying-hud.js";

// Compatibility checks
let fvttVersion;
let system;

// Initialization hooks
Hooks.once("init", () => {
    registerSettings();
    cacheSettings();
});

Hooks.once("ready", async () => {
    fvttVersion = parseInt(game.version);
    system = game.system.id;
    console.log(" ====================================== 🐦 Flying Tokens  ======================================= ");
    console.log(" ==================================== FoundryVTT Version:", fvttVersion, " ==================================== ");
    pf2eAutoScaleCheck();
});

// PF2E autoscale checks
function pf2eAutoScaleCheck(token, permanent = true) {
    let check;
    if (system === 'pf2e' && customScale) {
        if (token) check = token.getFlag("pf2e", "linkToActorSize");
        else check = game.settings.get('pf2e', 'tokens.autoscale');
        if (check) ui.notifications.warn('If you want Flying Tokens to autoscale you must disable PF2E setting "<b>Scale tokens according to size</b>" or individually disable this in the token config.', { permanent });
    }
}

// Pre-update tokens (must use document API in v13)
Hooks.on("preUpdateToken", async (token, updateData) => {
    let enableFlight = token.getFlag(MODULE, "enableFlight");
    if (enableFT || enableFlight) {
        let elevation = getProperty(updateData, "elevation");
        if (elevation !== undefined && isFlyer(token)) {
            await fly(token, elevation);
        }
    }
});

// Token HUD rendering
Hooks.on("renderTokenHUD", (app, html, data) => {
    if (!enableFT) FlyingHud.renderHud(app, html, data);
});

// Token config extension (modern document API example)
Hooks.on("renderTokenConfig", (app, html, data) => {
    if (isFlyer(app.token)) {
        let altToken = app.token.document.getFlag(MODULE, "altToken") || "";
        let newHtml = `<div class="form-group">
                <label>Flying Image Path</label>
                <div class="form-fields">
                  <button type="button" class="file-picker" data-type="imagevideo" data-target="flags.${MODULE}.altToken" title="Browse Files" tabindex="-1">
                    <i class="fas fa-file-import fa-fw"></i>
                  </button>
                  <input class="image" type="text" name="flags.${MODULE}.altToken" placeholder="path/image.png" value="${altToken}">
                </div>
              </div>`;
        const tinthtml = html.find('input[name="texture.src"]');
        const formGroup = tinthtml.closest(".form-group");
        formGroup.after(newHtml);
        app.setPosition({ height: "auto" });

        // FilePicker in v13 expects asynchronous usage:
        html.find(`button[data-target="flags.${MODULE}.altToken"]`).on('click', async () => {
            const fp = await FilePicker.browse("imagevideo", altToken); // Browse current folder
            // Insert logic to select file path from returned files
            // Set path on token config
