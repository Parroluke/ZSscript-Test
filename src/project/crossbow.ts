import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player, Entity, MinecraftItemTypes, GameMode, EntityType, EffectType } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, setPlrVelocity, actionbarRaw } from "../util/function.js";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui"

// world.events.entityCreate.subscribe((data)=>{
//     runCommand(`say ${[...world.getPlayers()][0].nameTag}`)
//     if(data.entity.id=='minecraft:arrow') data.entity.addTag('vel')
// })

// world.events.tick.subscribe(()=>{
//     try {
//     let q = new EntityQueryOptions();
//     q.type='arrow';
//     [...world.getDimension('overworld').getEntities(q)].forEach(ar=>{
//         if(ar.hasTag('vel')) ar.setVelocity(add([...world.getPlayers()][0].viewVector,3))
//         // ar.removeTag('vel')
//     })
// } catch(e) {runCommand(`say ${e}`)}
// })
world.events.tick.subscribe(()=>{
    [...world.getPlayers()].forEach(plr => {
        if(hasItem(plr,'slot.armor.head',0,'netherite_helmet',-1)) plr.addEffect(MinecraftEffectTypes.slowness,10,8,false)
    })
})
world.events.itemCompleteCharge.subscribe((data)=>{ 
runCommand(`say ${data.useDuration}`)
})
world.events.beforeItemUse.subscribe((data)=>{
    if(data.item.typeId=="minecraft:crossbow"||data.item.typeId=="minecraft:bow") {
        if(arrow(data.source,'slot.weapon.offhand',0,'arrow')!==false) {}
        else {
            actionbarRaw(data.source.nameTag,'§c[ 화살 장착 X ]')
            data.cancel=true;
        } 
    }
})

world.events.projectileHit.subscribe((data)=>{
if(data.entityHit) data.source.runCommand(`playsound random.orb @s ~~~`)
})

function hasItem(plr: Entity, location: string, slot: number, item: string, data: number) {
try {
let command = plr.runCommand(`testfor @s[hasitem={location=${location},slot=${slot},item=${item},data=${data}}]`).statusMessage;
if(data==-1) command = plr.runCommand(`testfor @s[hasitem={location=${location},slot=${slot},item=${item}}]`).statusMessage;
} catch(e) {return false}
return true;
}

function add(vec1: Vector, times: number) {
let vec = vec1;
for (let i=0;i<times;i++) {
    vec = new Vector(vec.x+vec.x,vec.y+vec.y,vec.z+vec.z)
}
return vec;
}

function arrow(plr: Entity, location: string, slot: number, item: string) {
for (let a = 0; a<44; a++) {
    if(hasItem(plr,location,slot,item,a)) return a;
}
return false;
}

// class Projectile {
//     constructor()
//     add(prj,type,loc,view) {
//         const tmp = {
//             prj,
//             type,
//             loc,
//             view
//         };
//         this.projectile.push(tmp)
//     }
//     move() {  }
//     hit() {  }
//     death() {}
// }