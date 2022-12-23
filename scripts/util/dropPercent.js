import { world, EntityQueryOptions, BlockLocation } from "@minecraft/server";
import { runCommand } from "./function.js";
let broke = [];
world.events.blockBreak.subscribe((data) => {
    const { x, y, z } = data.block.location;
    let q = new EntityQueryOptions();
    q.name = "system";
    let system = [...world.getDimension('overworld').getEntities(q)][0];
    if (data.brokenBlockPermutation.type.id !== "minecraft:chest" && !system.hasTag(`${x} ${y} ${z}`)) {
        runCommand(`execute @e[x=${x},y=${y},z=${z},r=1,type=item] ~~~ tp @s ~~3~`);
        broke.push(data.block.location);
    }
});
world.events.blockPlace.subscribe((data) => {
    const { x, y, z } = data.block.location;
    runCommand(`tag @e[name=system] add "${x} ${y} ${z}"`);
});
world.events.tick.subscribe(() => {
    broke.forEach(loc => {
        const { x, y, z } = loc;
        runCommand(`structure save tmp ${x} ${y} ${z} ${x} ${y + 1} ${z} true disk false`);
        for (let i = 0; i < 4; i++) {
            runCommand(`structure load tmp ${x} ${y} ${z}`);
            broke = [];
        }
    });
});
world.events.entityHurt.subscribe((data => {
    const { x, y, z } = data.hurtEntity.location;
    const health = data.hurtEntity.getComponent('health');
    if (health.current <= 0)
        broke.push(new BlockLocation(Math.floor(x), Math.floor(y), Math.floor(z)));
}));
