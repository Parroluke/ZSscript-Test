import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player, Entity, MinecraftItemTypes, GameMode } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, getPlayerWithTag, setPlrVelocity, actionbarRaw } from "./util/function.js";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui"

import "./default/dankey.js"
import "./default/gamemode.js"
import "./util/sneak.js"

import {ItemUtil} from "./util/itemUtil.js";
//code incorrection.
//invalid code. check the code number is correct.


let plLoc = [];
let trigger = 0;
world.events.tick.subscribe(({currentTick})=>{
    try {
    let qr = new EntityQueryOptions();
    qr.gameMode = GameMode.survival;
    const players = [...world.getPlayers(qr)];
    

    //30초 에 10퍼로 발동
    
    
    if(currentTick%600==0) {
        const random = Math.floor(Math.random()*100);
        let percent = 10;
        if(random < percent&&trigger==0) {
            trigger = 660;
            percent += 5;
        }
    }


    if(trigger>0) {
        
        if(currentTick%20==0&&trigger>=600) tellraw("@a",`자선사업 ${Math.floor((trigger-600)/20)}초 전..`);
        
            for (let pl=0; pl<players.length;pl++) {
                const plr = players[pl];
                const nextPl = pl+1 == players.length ? players[0] : players[pl+1];
                const nextCon = nextPl.getComponent('inventory').container;
                let chest;
                if(trigger == 602)  plLoc[pl] = {x:Math.floor(plr.location.x),y:Math.floor(plr.location.y),z:Math.floor(plr.location.z)}
                if(trigger<601) chest = world.getDimension(plr.dimension.id).getBlock(new BlockLocation(plLoc[pl].x,plLoc[pl].y+2,plLoc[pl].z)).getComponent('inventory').container;
                
                for(let i=0; i<36&&trigger<601; i++) {
                    const plrCon = plr.getComponent('inventory').container;
                    let plItem = plrCon.getItem(i);
                    if(currentTick%100==0) {
                        let item2 = nextCon.getItem(i) == undefined ? new ItemStack(MinecraftItemTypes.air) : nextCon.getItem(i)
                        chest.setItem(i,item2)
                    }
                        
                    
                    if(plItem!=undefined&&plItem.getLore()[0]==nextPl.nameTag&&trigger<600) {
                            runCommand(`clear ${plItem.getLore()[0]} ${plItem.id} -1 ${plItem.amount}`)
                            for (let v=0; v<36; v++) {
                                let item2 = nextCon.getItem(v) == undefined ? new ItemStack(MinecraftItemTypes.air) : nextCon.getItem(v)
                                chest.setItem(v,item2)
                            }
                            runCommand(`clone ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z} ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z+1} ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z}`)
                            let newItem = new ItemUtil(plItem).setLore([plr.nameTag]);
                            plrCon.setItem(i,newItem)
                        }
                    }
                if(currentTick%100==0) runCommand(`clone ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z} ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z+1} ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z}`)
                if(trigger == 1) runCommand(`structure load chest.${plr.nameTag} ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z}`);

                if(trigger == 601) {
                    runCommand(`structure save chest.${plr.nameTag} ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z} ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z+1} false disk true`)
                    runCommand(`structure load chest ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z}`);
                    
                }
                if(trigger==600) {
                    for (let v=0; v<36; v++) {
                        let item = nextCon.getItem(v) == undefined ? new ItemStack(MinecraftItemTypes.air) : nextCon.getItem(v)
                        chest.setItem(v,item)
                    }
                    runCommand(`clone ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z} ${plLoc[pl].x} ${plLoc[pl].y+2} ${plLoc[pl].z+1} ${plLoc[pl].x} ${plLoc[pl].y+1} ${plLoc[pl].z}`)
                }
        }
        
        trigger --;
    }
    else if(trigger==0) {
        players.forEach(plr =>{
            for(let i=0; i<36; i++) {
                const plrCon = plr.getComponent('inventory').container;
                const plItem = plrCon.getItem(i)
                if(plItem == undefined) {
                    if(plItem.getLore()[0]!=plr.nameTag) {
                        let newItem = new ItemUtil(plItem).setLore([plr.nameTag]);
                        plrCon.setItem(i,newItem)
                    }
                }
            }
        })
    }
    } catch (e) {runCommand(`say ${e}`)}
})

world.events.playerJoin.subscribe((data)=>{
    for(let i=0; i<36; i++) {
        let plrCon = data.player.getComponent('inventory').container;
        let item = plrCon.getItem(i);
        if(item!=undefined) {
            let newItem = new ItemUtil(item).setLore([data.player.nameTag]);
            plrCon.setItem(i,newItem)
        }
    }
})

let broke = [];
world.events.blockBreak.subscribe((data)=>{
    const { x, y, z } = data.block.location;
    let q = new EntityQueryOptions();
    q.name = "system";
    let system = [...world.getDimension('overworld').getEntities(q)][0];
    if(data.brokenBlockPermutation.type.id!=="minecraft:chest"&&!system.hasTag(`${x} ${y} ${z}`)) {
        runCommand(`execute @e[x=${x},y=${y},z=${z},r=1,type=item] ~~~ tp @s ~~3~`)
        broke.push(data.block.location)
    }
})

world.events.blockPlace.subscribe((data) => {
    const { x, y, z } = data.block.location;
    runCommand(`tag @e[name=system] add "${x} ${y} ${z}"`)
})

world.events.tick.subscribe(()=>{
        broke.forEach(loc => {
            const { x, y, z } = loc;
            runCommand(`structure save tmp ${x} ${y} ${z} ${x} ${y+1} ${z} true disk false`)
            for (let i=0; i<4; i++) {
            runCommand(`structure load tmp ${x} ${y} ${z}`)   
            broke = [];
            }
        })
})
world.events.entityHurt.subscribe((data=>{
    const { x, y, z } = data.hurtEntity.location

    if(data.hurtEntity.getComponent('health').current <= 0) broke.push(new BlockLocation(Math.floor(x),Math.floor(y),Math.floor(z)))
}))