import { ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, getPlayerWithTag, setPlrVelocity, actionbarRaw } from "../util/function.js";

let block = [];
let plBlock = [];
world.events.itemUse.subscribe((data)=>{
    
    let bl = data.source.getBlockFromViewVector()
    if(bl?.id=='minecraft:concrete') {
        const color = bl.permutation.getProperty('color').value
        if(color=='red') plBlock.push(1)
        else if(color=='blue') plBlock.push(2)
        else if(color=='yellow') plBlock.push(3)
        else if (color=='lime') plBlock.push(4)
        if(block[plBlock.length-1]!=plBlock[plBlock.length-1]) runCommand('title @a title 실패!')
        if(JSON.stringify(block) === JSON.stringify(plBlock)) next()
    }
    runCommand(`title @a actionbar ${block} / ${plBlock}`)
})

world.events.tick.subscribe(({currentTick})=>{
    [...world.getPlayers()].forEach(plr=>{
        const bl = plr.getBlockFromViewVector()
        if(currentTick%2==0) {
            runCommand('fill 1001 22 460 1001 28 454 stained_glass 14 replace concrete')
            runCommand('fill 1001 28 448 1001 22 442 stained_glass 11 replace concrete')
            runCommand('fill 1001 16 460 1001 10 454 stained_glass 4 replace concrete')
            runCommand('fill 1001 16 448 1001 10 442 stained_glass 5 replace concrete')
            
        }
        if(bl?.id=='minecraft:stained_glass'&&getScore('uzi','show')==0) {
            const color = bl.permutation.getProperty('color').value
            if(color=='red') runCommand('fill 1001 22 460 1001 28 454 concrete 14 replace stained_glass')
            else if(color=='blue') runCommand('fill 1001 28 448 1001 22 442 concrete 11 replace stained_glass')
            else if(color=='yellow') runCommand('fill 1001 16 460 1001 10 454 concrete 4 replace stained_glass')
            else if (color=='lime') runCommand('fill 1001 16 448 1001 10 442 concrete 5 replace stained_glass')
        }
        if(currentTick%20==0) {
            runCommand('fill 1001 22 460 1001 28 454 stained_glass 14 replace sealantern')
            runCommand('fill 1001 28 448 1001 22 442 stained_glass 11 replace sealantern')
            runCommand('fill 1001 16 460 1001 10 454 stained_glass 4 replace sealantern')
            runCommand('fill 1001 16 448 1001 10 442 stained_glass 5 replace sealantern')
        }


        //show
        if(currentTick%15==0&&getScore('uzi','show')>0) {
            let i = block.length-getScore('uzi','show')
            runCommand(`playsound random.orb @a`)
            if(block[i]===1) runCommand('fill 1001 22 460 1001 28 454 sealantern')
            else if(block[i]===2) runCommand('fill 1001 28 448 1001 22 442 sealantern')
            else if(block[i]===3) runCommand('fill 1001 16 460 1001 10 454 sealantern')
            else if(block[i]===4) runCommand('fill 1001 16 448 1001 10 442 sealantern')
            runCommand('scoreboard players remove show uzi 1')
            
       }
        
    })
})

world.events.buttonPush.subscribe((data)=>{
     if(data.block.location.equals(new BlockLocation(1021,11,451))) {
        next()
     }
 })
 
function next() {
    plBlock=[]
    runCommand(`playsound random.levelup @a`)
    const ran =  Math.floor(Math.random()*4)+1
    block.push(ran)
    runCommand(`title @a title Stage §a${block.length}`)
    runCommand(`scoreboard players set show uzi ${block.length}`)
}