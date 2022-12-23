import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, getPlayerWithTag, setPlrVelocity, actionbarRaw } from "./util/function.js";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui"

//유지 스킬
world.events.tick.subscribe(()=>{
    try {
    [...world.getPlayers()].forEach(plr =>{
        let item = plr.getComponent('inventory').container.getItem(plr.selectedSlot)
        let cooldown = world.scoreboard.getObjective('uzi').getScore(plr.scoreboard)
        if(item?.id == 'minecraft:wooden_sword'&&plr.isSneaking&&cooldown==0) {
            runCommand(`scoreboard players add "${plr.nameTag}" sneak 1`)
            let sneakScore = world.scoreboard.getObjective('sneak').getScore(plr.scoreboard)
            const box1 = '■'
            const box2 = '□'
            let boxText = `${box1.repeat(sneakScore)}${box2.repeat(20-sneakScore)}`
            runCommand(`title "${plr.nameTag}" actionbar §a${boxText}`)
            runCommand(`execute "${plr.nameTag}" ~~~ playsound beacon.ambient @a ~~~ 1 1`)
            if(sneakScore==20) {
                setPlrVelocity(plr.viewVector,plr)
                runCommand(`scoreboard players set "${plr.nameTag}" sneak 0`)
                runCommand(`scoreboard players set "${plr.nameTag}" uzi 50`)
                runCommand(`execute "${plr.nameTag}" ~~~ playsound random.totem @a ~~~ 3 1.5`)
            }
        }
        else {
            if(!plr.isSneaking) runCommand(`scoreboard players set "${plr.nameTag}" sneak 0`)
            if(cooldown!==0) {
                runCommand(`title "${plr.nameTag}" actionbar ${cooldown}`)
                runCommand(`scoreboard players remove "${plr.nameTag}" uzi 1`)
            }
        }
        runCommand(`scoreboard players add @a uzi 0`)
    })
} catch(e) {runCommand(`say ${e}`)}
})

world.events.itemUseOn.subscribe((data)=>{
    try {
    const newItem = data.item
    newItem.setLore(["ab","가나다","ababaaa"])
    data.source.getComponent("minecraft:inventory").container.setItem(data.source.selectedSlot, newItem)
    } catch(e) {runCommand(`say ${e}`)}
})

world.events.entityHit.subscribe((data)=>{
    try {
    if(data.hitBlock?.id=="minecraft:concrete") {
        const color = data.hitBlock.permutation.getProperty('color').value
        if(color=="blue"||color=="red") {
            let {x,y,z} = data.hitBlock.location
            for (let i=0;i<5;i++) {
                let loc;
                
                    if(i==0) loc = new BlockLocation(x,y,z)
                    if(i==1) loc = new BlockLocation(x,y+1,z)
                    if(i==2) loc = new BlockLocation(x,y-1,z)
                    if(i==3) loc = new BlockLocation(x,y,z+1)
                    if(i==4) loc = new BlockLocation(x,y,z-1)
                
                const boolColor = world.getDimension('overworld').getBlock(loc).permutation.getProperty('color')?.value
                if(boolColor=='red') runCommand(`setblock ${loc.x} ${loc.y} ${loc.z} concrete 11`)
                else if(boolColor=='blue') runCommand(`setblock ${loc.x} ${loc.y} ${loc.z} concrete 14`)
                
            }
        }
    }
}
    catch(e) {runCommand(`say ${e}`)}
})