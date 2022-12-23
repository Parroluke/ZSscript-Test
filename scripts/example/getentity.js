import {World,Commands} from "@minecraft/server"
let pls
World.events.tick.subscribe(()=> {
    pls = findPlayer('JinhyoungLuke')
    
    runCommand(`say ${pls}`)
})



export function findPlayer(name) {
    let pl = World.getPlayers();

    for (let p = 0; p < pl.length; p++) {
        if(name == pl[p].nameTag)
        { return (pl[p]); }
    }
    return (false);
}

export function runCommand(command) {
    try { 
        return { error: false, ...Commands.run(command, World.getDimension('overworld')) };
    } catch(error) {
        return { error: true };
    }
}


import {World,BlockLocation,Location,Commands} from "@minecraft/server"



/**World.events.tick.subscribe(()=> {
    let pls = findPlayer("JinhyoungLuke")
    runCommand(`scoreboard players add air detect 0`)
    let facingair = getScoreboardValue('air','detect')
    let Elocation;
    for (let i=0;i<19&&facingair==0;i++) {
    
    runCommand(`scoreboard players set air detect 1`)
    runCommand(`execute ${pls.nameTag} ~~1.6~ detect ^^^${i} air 0 scoreboard players set air detect 0`)
    facingair = getScoreboardValue('air','detect')
    if(facingair=1) {
        
        runCommand(`execute ${pls.nameTag} ~~~ summon armor_stand loc_${pls.nameTag} ^^^${i}`)
        
        actionbarRaw(`@a`,`${Elocation.x}`)
        
    }

    }
})

World.events.entityCreate.subscribe((Edata)=>{
    if (Edata.entity.nameTag==`loc_${pls.nameTag}`) {
        Elocation = Edata.entity.location
        Edata.entity.kill();
    }
})*/s

export function runCommand(command) {
    try { 
        return { error: false, ...Commands.run(command, World.getDimension('overworld')) };
    } catch(error) {
        return { error: true };
    }
}
export function findPlayer(name) {
    let pl = World.getPlayers();

    for (let p = 0; p < pl.length; p++) {
        if(name == pl[p].nameTag)
        { return (pl[p]); }
    }
    return (false);
}
export function actionbarRaw(selector, text)
{
    if (selector.substr(0,1) != "@") {
        runCommand(`titleraw "${selector}" actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
    else {
        runCommand(`titleraw ${selector} actionbar {"rawtext":[{"text":"${text.replace("\"", "\'")}"}]}`); }
}
export function getScoreboardValue (player, objective) {
    return runCommand(`scoreboard players test ${player} ${objective} 0 10000`).statusMessage.substr(6,1)
}