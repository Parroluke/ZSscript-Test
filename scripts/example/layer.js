import { Commands, World } from "@minecraft/server";
const prefix = '+'
World.events.beforeChat.subscribe(data => {
    if (data.message.substr(0, prefix.length) == prefix)
    {
        data.cancel =true;
        allCommand(data);
    }
});
export function allCommand(data) {
    if (data.message.trim() == prefix + "layer") {
        for (let j=0; j<2; j++) {
            for (let h=0; h<2; h++) {
                for (let i=0; i<=63; i++) {    
                    runCommand(`execute @a ~~~ fill ~100 ${0-i} ~100 ~ ${0-i} ~ deepslate 0 keep`)
                    }
                    runCommand(`execute @a ~~~ fill ~100 -64 ~100 ~ -64 ~ bedrock`)
                    runCommand(`execute @a ~~~ tp @s ~100~~`)
                }
                runCommand(`execute @a ~~~ tp @s ~-200~~100`)
            }
        }
        
    }

export function runCommand(command) {
    try { 
        return { error: false, ...Commands.run(command, World.getDimension('overworld')) };
    } catch(error) {
        return { error: true };
    }
}
export function findPlayer(name) {
    let pl = World.getPlayers();

    for (let i = 0; i < pl.length; i++) {
        if(name == pl[i].name)
        { return (pl[i]); }
    }
    return (false);
}
