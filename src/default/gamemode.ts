import {world, EntityQueryOptions} from "@minecraft/server"
import {ActionFormData} from "@minecraft/server-ui"
import {runCommand} from "../util/function.js"
world.events.tick.subscribe(()=>{
        [...world.getPlayers()].forEach(plr =>{
            if(plr.isSneaking&&Math.round(plr.rotation.x)==-90&&plr.hasTag('sneak')) {
                const form = new ActionFormData();
                form.title('게임 모드 선택기')
                form.button('크리에이티브 모드\n[ 클릭하여 변경 ]',"textures/items/redstone_dust.png")
                form.button('서바이벌 모드\n[ 클릭하여 변경 ]', "textures/items/iron_sword.png")
                form.button('모험 모드\n[ 클릭하여 변경 ]', "textures/items/map_empty.png")
                form.button('관전 모드\n[ 클릭하여 변경 ]', "textures/items/ender_eye.png")
                const source = plr
                form.show(plr).then(r => {
                    const gamemode = ['creative','survival','adventure','spectator']
                    if(!r.canceled) runCommand(`gamemode ${gamemode[r.selection]} ${source.nameTag}`)
                })
            }
        })
    })
