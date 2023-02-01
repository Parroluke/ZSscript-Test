import { world, BeforeItemUseOnEvent, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui"
import { event, EventBuilder } from "../util/event";
import { PlayerInventory } from "../util/inventory.js";


event.addEvent("BeforeItemUseOn", async (e) => {
    try {
        const block = new EventBuilder<BeforeItemUseOnEvent>(e).beforeItemUseOn.getBlock()
        if(block.typeId === "minecraft:enchanting_table" && !e.source.isSneaking) {
            e.cancel = true;
            
            const inv =  new PlayerInventory(e.source as Player).getAllItem().map((v)=>v.typeId)
            
            const form = new ModalFormData()
            form.title('인첸트')
            form.dropdown('a',inv)

            const formvalue = (await form.show(e.source as Player))
        }
    }
    catch (e) {world.say(e)}
});




