import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player, Entity, MinecraftItemTypes, GameMode, EntityType, EffectType, ItemUseEvent, TickEvent, EntityQueryScoreOptions, MinecraftEntityTypes, Events, system, BlockType } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, setPlrVelocity, actionbarRaw } from "./util/function.js";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui"

import "./default/dankey.js"
import "./default/gamemode.js"
import "./util/sneak.js"
import { Particle } from "./util/particle.js";
import { event } from "./util/event.js";
import { ItemUtil } from "./util/itemUtil.js";
import { inventory, PlayerInventory } from "./util/inventory.js";
import { GameTestSequence, register, SimulatedPlayer } from "@minecraft/server-gametest";
import { InteractionBar } from "./util/interectBar.js";
import { storage } from "./util/storage.js";
//import "./contents/Parkour/run.js"


// function distance(loc1: Location, loc2: Location): number {
//     const dis: number = Math.sqrt(Math.pow(loc2.x-loc1.x,2)+Math.pow(loc2.y-loc1.y,2)+Math.pow(loc2.z-loc1.z,2));
//     return dis;
// }





let b: number;
world.events.tick.subscribe(()=>{
    // storage.addGlobal('ab','a')
    // storage.setGlobal('ab','b')
    // runCommand(`say ${storage.getGlobal('ab')}`) 
    //global

    let pl = [...world.getPlayers()][0]
    // storage.addPersonal(pl,'super')
    // storage.setPersonal(pl, 'super', "aaaa")
    // runCommand(`say ${storage.getPersonal(pl, 'super')}`)
    

    //pl.getBlockFromViewVector().setType(MinecraftBlockTypes.getAllBlockTypes()[Math.floor(Math.random()*MinecraftBlockTypes.getAllBlockTypes().length)])
    if(pl.isSneaking) b++
    else b = 0
    if(b==100) {
        runCommand('say success')
    }  
})
    


function getPlayers(q:EntityQueryOptions) {
    const players = [...world.getPlayers()]
    if (players.length==1) return players[0]
    else if(!players) return null
    else return players
}
event.addEvent('beforeChat',(data)=>{
    if(data.message.startsWith('lore')) {
        try {
            const inven = new PlayerInventory(data.sender);
            inven.handSetItem(new ItemUtil(inven.handGetItem()).setLore(JSON.parse(data.message.slice(5))))
            inven.handSetItem(new ItemUtil(inven.handGetItem()).setDurability(1))
            data.cancel = true;
        }
        catch(e) {runCommand(`tellraw "${data.sender.nameTag}" {"rawtext":[{"text":"§c${e}"}]}`)}
    }
})


// event.addEvent('playerJoin',(data)=>{
    
//     let e = new InteractionBar(data.player);
//     e.dialogBar(["a","b","c","d"])
// })

// register("E", "Fail", (test) => {
//     test.print('aa')
//     for(let i=0; i<20; i++) {
//         test.spawnSimulatedPlayer(new BlockLocation(1,2,1),'니얼굴')
//         const siPl = [...world.getPlayers({})][i+1] as SimulatedPlayer
//         siPl.move(10,10)
//     }
    
    
//     test.idle(1000)
//   });
