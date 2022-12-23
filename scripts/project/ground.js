import { world } from "@minecraft/server";
import { runCommand } from "../util/function.js";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
world.events.itemUse.subscribe((data) => {
    try {
        if (data.item.typeId == "minecraft:emerald") {
            let groundInfo = getInfo();
            const nameTag = `${data.source.nameTag}`;
            const source = data.source;
            const { x, y, z } = data.source.location;
            let buttons = [];
            let form = new ActionFormData();
            form.title('땅 설정');
            if (groundInfo[nameTag] == null || !groundInfo.hasOwnProperty(nameTag)) {
                form.button("땅 구매", "textures/items/emerald.png");
                buttons.push("땅 구매");
            }
            else {
                form.button("땅 정보", "textures/items/map_empty.png");
                buttons.push("땅 정보");
                form.button("땅 확장", "textures/items/ender_pearl.png");
                buttons.push("땅 확장");
                form.button("땅 판매", "textures/items/gold_nugget.png");
                buttons.push("땅 판매");
                form.button("땅 관리", "textures/items/ender_eye.png");
                buttons.push("땅 관리");
            }
            form.show(data.source).then((r) => {
                if (buttons[r.selection] == "땅 정보") {
                    let mForm = new ActionFormData();
                    mForm.title('땅 정보');
                    mForm.body(`지주 : ${nameTag}\n위치 : ${groundInfo[nameTag].loc1} - ${groundInfo[nameTag].loc2}`);
                    mForm.button("확인");
                    mForm.show(source);
                }
                if (buttons[r.selection] == "땅 구매") {
                    let setObj = {
                        "loc1": [Math.round(x) - 3, Math.round(y) - 3, Math.round(z) - 3],
                        "loc2": [Math.round(x) + 3, Math.round(y) + 3, Math.round(z) + 3],
                        "place": [],
                        "break": []
                    };
                    groundInfo[nameTag] = setObj;
                    runCommand(`say ${JSON.stringify(groundInfo)}`);
                    saveInfo(groundInfo);
                }
                if (buttons[r.selection] == "땅 판매") {
                    groundInfo[nameTag] = null;
                    saveInfo(groundInfo);
                }
                if (buttons[r.selection] == "땅 확장") {
                    let extendForm = new ActionFormData();
                    extendForm.title('땅 확장');
                    extendForm.body('확장 비용 : 에메랄드 1');
                    extendForm.button('↔ 수평 확장');
                    extendForm.button('↕ 수직 확장');
                    extendForm.show(source)
                        .then(r => {
                        const loc1 = groundInfo[nameTag].loc1;
                        const loc2 = groundInfo[nameTag].loc2;
                        if (r.selection == 0) {
                            groundInfo[nameTag].loc1 = [loc1[0] - 1, loc1[1], loc1[2] - 1];
                            groundInfo[nameTag].loc2 = [loc2[0] + 1, loc2[1], loc2[2] + 1];
                        }
                        if (r.selection == 1) {
                            groundInfo[nameTag].loc1 = [loc1[0], loc1[1] - 1, loc1[2]];
                            groundInfo[nameTag].loc2 = [loc2[0], loc2[1] + 1, loc2[2]];
                        }
                        if (!r.canceled)
                            saveInfo(groundInfo);
                    });
                }
                if (buttons[r.selection] == "땅 관리") {
                    let setting = groundInfo[nameTag];
                    let playerForm = new ModalFormData();
                    const players = [...world.getPlayers()].map((v) => v = v.nameTag);
                    playerForm.title('권한 설정');
                    playerForm.dropdown("플레이어", players, 0);
                    playerForm.show(source)
                        .then((r) => {
                        let settingForm = new ModalFormData();
                        const player = players[r.formValues[0]];
                        settingForm.toggle("블록 설치&상호작용", setting.place.includes(player));
                        settingForm.toggle("블록 파괴", setting.break.includes(player));
                        settingForm.title(`${nameTag} 권한 설정`);
                        settingForm.show(source)
                            .then(r => {
                            const permi = new permission(source);
                            if (r.formValues[0])
                                permi.setPermission("place", nameTag, true);
                            else
                                permi.setPermission("place", nameTag, false);
                            if (r.formValues[1])
                                permi.setPermission("break", nameTag, true);
                            else
                                permi.setPermission("break", nameTag, false);
                        });
                    });
                }
            });
        }
    }
    catch (e) {
        runCommand(`say ${e}`);
    }
});
//아이템 사용 & 블록 설치
world.events.beforeItemUse.subscribe((data) => {
    if (includeBlock(data.source.location) !== data.source.nameTag && data.item.typeId !== "minecraft:emerald") {
        data.cancel = true;
    }
});
world.events.beforeItemUseOn.subscribe((data) => {
    if (includeBlock(data.blockLocation) !== data.source.nameTag) {
        data.cancel = true;
    }
});
//블록 파괴
world.events.entityHit.subscribe((data) => {
    const loc = `${data.hitBlock.x} ${data.hitBlock.y} ${data.hitBlock.z}`;
    runCommand(`structure save ${data.entity.nameTag}.broke ${loc} ${loc} false disk true`);
});
world.events.blockBreak.subscribe((data) => {
    if (includeBlock(data.block.location) !== data.player.nameTag) {
        const loc = `${data.block.x} ${data.block.y} ${data.block.z}`;
        runCommand(`execute @a[name=${data.player.nameTag},m=!1] ~~~ structure load ${data.player.nameTag}.broke ${loc}`);
        runCommand(`execute @p ${loc} kill @e[type=item,r=1.3]`);
    }
});
function saveInfo(value) {
    const info = [...world.getDimension('overworld').getEntities({ name: 'groundInfo' })][0];
    info.removeTag(info.getTags()[0]);
    info.addTag(JSON.stringify(value));
}
function includeBlock(loc) {
    let groundInfo = getInfo();
    let r = false;
    Object.keys(groundInfo).forEach((gr) => {
        if (groundInfo[gr] != null) {
            const { loc1, loc2 } = groundInfo[gr];
            if (loc.x >= loc1[0] && loc.x <= loc2[0] && loc.y >= loc1[1] && loc.y <= loc2[1] && loc.z >= loc1[2] && loc.z <= loc2[2])
                r = gr;
        }
    });
    return r;
}
function getInfo() {
    const info = [...world.getDimension('overworld').getEntities({ name: 'groundInfo' })][0];
    return JSON.parse(info.getTags()[0]);
}
class permission {
    /**
     * 대상의 권한 설정
     * @param {Player} plr 플레이어
     */
    constructor(plr) {
        this.plr = plr;
        this.plr = plr;
    }
    /**
     * 대상이 땅 내에서 "break" 권한을 갖고 있는지 실험합니다.
     * @param {Object} gr 땅 오브젝트
     */
    testBreak(gr) {
        if (gr?.break.includes(this.plr.nameTag))
            return true;
        else
            return false;
    }
    /**
     * 대상이 땅 내에서 "place" 권한을 갖고 있는지 실험합니다.
     * @param {Object} gr 땅 오브젝트
     */
    testPlace(gr) {
        if (gr?.place.includes(this.plr.nameTag))
            return true;
        else
            return false;
    }
    /**
     * 대상의 땅 내 권한을 변경합니다.
     * @param {String} permission 권한 이름
     * @param {String} grSt 땅 이름
     * @param {Boolean} value 설정할 값
     */
    setPermission(permission, grSt, value) {
        let info = getInfo();
        let gr = info[grSt];
        let permissions = gr[permission].filter((v) => v != this.plr.nameTag);
        if (value)
            permissions.push(this.plr.nameTag);
        gr[permission] = permissions;
        saveInfo(info);
    }
}
