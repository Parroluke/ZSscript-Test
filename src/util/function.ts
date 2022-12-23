    import { world, Vector, ExplosionOptions, MinecraftEffectTypes, Player, EntityHealthComponent, Entity } from "@minecraft/server"

    export function setPlrVelocity(velocity: Vector, p: Player) {
        velocity = new Vector(velocity.x*2.5,velocity.y*2.5,velocity.z*2.5)
        velocity = Vector.add(velocity, new Vector(0, -1, 0));
        
        const h = p.getComponent("health") as EntityHealthComponent;
        const hp = h.current;
        p.addEffect(MinecraftEffectTypes.instantHealth, 1, 255);
        h.resetToMaxValue();
    
        p.setVelocity(velocity);
        p.dimension.createExplosion(p.location, 0.05, {breaksBlocks:false});
    
        p.runCommand("effect @s instant_health 0 0 true");
        if (h.current >= 0) h.setCurrent(hp);
      }
    
    
    export function runCommand(command: string) {
            return world.getDimension('overworld').runCommandAsync(command);
        
    }
    export function getScore(target: string | Entity | Player, objective: string) {
          const obj = world.scoreboard.getObjective(objective);
          if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName === target));
          }
          return obj.getScore(target.scoreboard);
        
      }
    export function tellraw(selector: string, text: string)
    {
        if(selector.substr(0,1) != "@" ){
            runCommand(`tellraw "${selector}" {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
        else {
            runCommand(`tellraw ${selector} {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
    }

    export function subtitle(selector: string, text: string) {
        runCommand(`title ${selector} title §e`)
        runCommand(`title ${selector} subtitle ${text}`)
    }

    export function log(text: string)
    { runCommand(`tellraw @a[tag=log] {"rawtext":[{"text":"§7{log} §r${text.replace("\"", "\\\"")}"}]}`)}

    export function actionbarRaw(selector: string, text: string)
    {
        if (selector.substr(0,1) != "@") {
            runCommand(`titleraw "${selector}" actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
        else {
            runCommand(`titleraw ${selector} actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
    }

    export function findPlayer(name: string) {
        let pl = [...world.getPlayers()]
        let pl2 = [];
        for(let n of pl) {
            pl2.push(n)
        }
        for (let p = 0; p < pl2.length; p++) {
            if(name == pl2[p].nameTag)
            { return (pl2[p]); }
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

    export function getPlayerWithTag(tag: string) {
       world.getPlayers({tags:[tag]})
    }