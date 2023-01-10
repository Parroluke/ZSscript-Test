import { world, Vector, MinecraftEffectTypes } from "@minecraft/server";
export function setPlrVelocity(velocity, p) {
    velocity = new Vector(velocity.x * 2.5, velocity.y * 2.5, velocity.z * 2.5);
    velocity = Vector.add(velocity, new Vector(0, -1, 0));
    const h = p.getComponent("health");
    const hp = h.current;
    p.addEffect(MinecraftEffectTypes.instantHealth, 1, 255);
    h.resetToMaxValue();
    p.setVelocity(velocity);
    p.dimension.createExplosion(p.location, 0.05, { breaksBlocks: false });
    p.runCommand("effect @s instant_health 0 0 true");
    if (h.current >= 0)
        h.setCurrent(hp);
}
export function runCommand(command) {
    return world.getDimension('overworld').runCommandAsync(command);
}
export async function getScore(target, objective) {
    let re;
    await runCommand(`scoreboard players add ${target} ${objective} 0`).then((a)=>{
        
        const obj = world.scoreboard.getObjective(objective);
        if (typeof target == 'string') {
            re = obj.getScore(obj.getParticipants().find(v => v.displayName === target));
        }
        else re = obj.getScore(target.scoreboard);
        runCommand(`scoreboard players set get a ${re}`)
    })
    
    return re;
    
}
export function get(t,o) {
    getScore(t,o)
    const obj = world.scoreboard.getObjective(o);
    if (typeof t == 'string') {
        return obj.getScore(obj.getParticipants().find(v => v.displayName === t));
    }
    else return obj.getScore(t.scoreboard);
}


export function tellraw(selector, text) {
    if (selector.substr(0, 1) != "@") {
        runCommand(`tellraw "${selector}" {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`);
    }
    else {
        runCommand(`tellraw ${selector} {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`);
    }
}
export function subtitle(selector, text) {
    runCommand(`title ${selector} title §e`);
    runCommand(`title ${selector} subtitle ${text}`);
}
export function log(text) { runCommand(`tellraw @a[tag=log] {"rawtext":[{"text":"§7{log} §r${text.replace("\"", "\\\"")}"}]}`); }
export function actionbarRaw(selector, text) {
    if (selector.substr(0, 1) != "@") {
        runCommand(`titleraw "${selector}" actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`);
    }
    else {
        runCommand(`titleraw ${selector} actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`);
    }
}
export function findPlayer(name) {
    let pl = [...world.getPlayers()];
    let pl2 = [];
    for (let n of pl) {
        pl2.push(n);
    }
    for (let p = 0; p < pl2.length; p++) {
        if (name == pl2[p].nameTag) {
            return (pl2[p]);
        }
    }
    return (false);
}
// export function findTagsStartWith(name: string, tag: string)
// {
//     const listTag = runCommand(`tag ${name} list`).statusMessage.split(' ');
//     const tags = [];
//     for (const aTag of listTag) {
//         if (aTag.replace('§a','').startsWith(tag)) tags.push(aTag.replace('§a', '').replace('§r', '').replace(',', ' ').trim())
//     }
//     return (tags);
// }
export function getPlayerWithTag(tag) {
    return [...world.getPlayers({ tags: [tag] })][0];
}
