import { DynamicPropertiesDefinition, ItemStack, Items, ScoreboardIdentity ,BlockPermutation,MinecraftBlockTypes ,MinecraftEffectTypes,ExplosionOptions,Dimension,BlockLocation, Enchantment,MinecraftEnchantmentTypes, Vector, world, Location, EntityQueryOptions, EntityIterator, Player, Entity, MinecraftItemTypes, GameMode } from "@minecraft/server";
import { runCommand, tellraw, getScore, findPlayer, getPlayerWithTag, setPlrVelocity, actionbarRaw } from "../../util/function.js";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui"
import { Start } from "./start.js"


world.events.buttonPush.subscribe((data) => {
    runCommand(`say ${data.block.location.x}`)
    if(data.block.location.equals(new BlockLocation(-639,5,146))) Start.sound()
})