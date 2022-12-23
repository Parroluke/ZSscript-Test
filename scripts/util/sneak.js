import { world } from "@minecraft/server";
world.events.tick.subscribe(() => {
    [...world.getDimension('overworld').getPlayers()].forEach(plr => {
        if (plr.isSneaking && plr.hasTag('sneak'))
            plr.removeTag('sneak');
        if (plr.isSneaking && plr.hasTag('unsneaked'))
            plr.addTag('sneak');
        if (!plr.isSneaking)
            plr.addTag('unsneaked');
        else
            plr.removeTag('unsneaked');
    });
});
