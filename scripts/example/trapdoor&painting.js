import { world, Location } from "@minecraft/server";
import { runCommand } from "../util/function.js";
world.events.beforeItemUseOn.subscribe((data) => {
    if (data.source.hasTag("trapdoor")) {
        const bl = data.source.dimension.getBlock(data.blockLocation);
        const trapdoor = ["minecraft:trapdoor", "minecraft:jungle_trapdoor", "minecraft:birch_trapdoor", "minecraft:acacia_trapdoor", "minecraft:dark_oak_trapdoor", "minecraft:spruce_trapdoor", "minecraft:mangrove_trapdoor", "minecraft:crimson_trapdoor", "minecraft:warped_trapdoor"];
        if (trapdoor.includes(bl.typeId))
            data.cancel = true;
    }
    ;
});
world.events.tick.subscribe(() => {
    runCommand("tag @a[m=!1] add trapdoor");
    runCommand("tag @a[m=1] remove trapdoor");
    let q = { type: 'minecraft:painting' };
    let paintings = [...world.getDimension('overworld').getEntities(q)];
    paintings.forEach(paint => {
        paint.runCommand(`structure save tmp ~~~ ~~~ true disk false`);
        paint.runCommand(`structure load tmp ~~~`);
        paint.teleport(new Location(0, -104, 0), world.getDimension('overworld'), 0, 0);
    });
});
