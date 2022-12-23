import { BlockLocation, world } from "@minecraft/server";
import { runCommand, tellraw } from "../util/function.js";
import { PlayerInventory } from "../util/inventory.js";
const prefix = ':';
world.events.beforeChat.subscribe((data) => {
    let itemblock = world.getDimension('overworld').getBlock(new BlockLocation(0, 312, 0));
    let chest;
    let chestCon;
    let senderInven = new PlayerInventory(data.sender);
    let senderCon = senderInven.con;
    if (data.message.substr(0, prefix.length) == prefix)
        data.cancel = true;
    if (data.message.startsWith(prefix + "s ")) {
        let num = data.message.slice(3);
        if (num instanceof Number) {
            tellraw(data.sender.nameTag, `§c${num}은(는) 올바른 수가 아닙니다.`);
        }
        else {
            runCommand(`structure delete d${num}.${data.sender.nameTag}`);
            runCommand(`setblock 0 312 0 chest`);
            chest = itemblock.getComponent(`inventory`);
            chestCon = chest.container;
            for (let i = 0; i < 9; i++) {
                let getitem = senderCon.getItem(i);
                chestCon.setItem(i, getitem);
            }
            runCommand(`structure save d${num}.${data.sender.nameTag} 0 312 0 0 312 0 false disk true`);
            runCommand(`setblock 0 312 0 air`);
            tellraw(data.sender.nameTag, `[${num}] 단축키를 성공적으로 저장했습니다.`);
        }
    }
    if (data.message.startsWith(prefix + "l ")) {
        let hasKey = runCommand(`structure load d${data.message.slice(3)}.${data.sender.nameTag} 0 312 0`);
        hasKey.catch(() => {
            tellraw(data.sender.nameTag, `§c${data.message.slice(3)}의 단축키를 찾을 수 없습니다.`);
        });
        hasKey.then(() => {
            try {
                chest = itemblock.getComponent(`inventory`);
                chestCon = chest.container;
                for (let i = 0; i < 9; i++) {
                    let getitem2 = chestCon.getItem(i);
                    senderCon.setItem(i, getitem2);
                }
            }
            catch (e) {
                runCommand(`say ${e}`);
            }
            runCommand(`setblock 0 312 0 air`);
        });
    }
});
