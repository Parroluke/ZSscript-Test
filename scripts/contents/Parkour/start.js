import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player, Entity, MinecraftItemTypes, GameMode, SoundOptions } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, getPlayerWithTag, setPlrVelocity, actionbarRaw } from "../../util/function.js";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui"

class start {
    sound() {
        world.events.tick.subscribe(({currentTick}) => {
            let p=0;
            if(currentTick%30==0) {
                [...world.getPlayers()].forEach(plr => {
                    let s = new SoundOptions();
                    s.pitch = 0.7;
                    plr.playSound("note.pling",s);
                })
                p++;
            }
            if(p==5) world.events.tick.unsubscribe(Start)
        })
    }
}
export const Start = new start();