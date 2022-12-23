import { Player, TickEvent } from "@minecraft/server";
import { event } from "./event";
import { runCommand } from "./function";

export class InteractionBar {
    dialogE: () => void;
    constructor(public player: Player) {
        this.player = player;
    }
    dialogBar(dialog: string[]) {
        let index = 0;
        runCommand(`tellraw @a {"rawtext":[{"text":"${dialog[index]}"}]}`)
        this.dialogE = event.addEvent('tick', () => {
            let select = ["§ㅁ§e[<]§r", "§e[>]§r"];
            if(select[this.player.selectedSlot]) {
                select[this.player.selectedSlot] = `§l${select[this.player.selectedSlot]}`       
                if(this.player.hasTag('sneak')) {
                    if(this.player.selectedSlot===1&&index<dialog.length) index++
                    if(this.player.selectedSlot===0&&index>0) index--
                    if(index==dialog.length) this.removeE()
                    else runCommand(`tellraw @a {"rawtext":[{"text":"${dialog[index]}"}]}`)
                    
                } 
            }
            runCommand(`title @a actionbar §6대화 설정\n${select.toString().replace(/,/g,' ')}`)
        })
    }
    removeE(): void {
        event.removeEvent('tick', this.dialogE)
    }
}