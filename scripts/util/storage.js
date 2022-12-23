import { world } from "@minecraft/server";
import { event } from "./event";
import { runCommand } from "./function";
/**
 * 월드의 저장소
 */
class worldStorage {
    constructor() {
        this.dataEntity = [...world.getDimension('overworld').getEntities({ name: "storage" })][0];
        if (!this.dataEntity) {
            runCommand('summon armor_stand storage 0 10000 0');
            runCommand(`tag @e[name=storage] add "{}"`);
            runCommand('tickingarea add 0 0 0 0 0 0 storage true');
        }
        event.addEvent('tick', () => {
            runCommand('tp @e[name=storage] 0 10000 0'); // Nogravity
        });
        event.addEvent('playerJoin', (d) => {
            if (!d.player.getTags().find(v => v.startsWith("{")))
                d.player.addTag("{}");
        });
    }
    getStorage() {
        let result = JSON.parse(this.dataEntity.getTags()[0]);
        return result;
    }
    setStorage(value) {
        this.dataEntity.removeTag(this.dataEntity.getTags()[0]);
        this.dataEntity.addTag(JSON.stringify(value));
    }
    getPerStorage(p) {
        let result = JSON.parse(p.getTags().find(v => v.startsWith("{")));
        return result;
    }
    setPerStorage(p, value) {
        p.removeTag(p.getTags().find(v => v.startsWith("{")));
        p.addTag(JSON.stringify(value));
    }
    /**
     * 사용할 전역변수를 등록합니다.
     * @param key 전역변수 이름
     */
    addGlobal(key, value = null) {
        let get = this.getStorage();
        get[key] = value;
        this.setStorage(get);
    }
    /**
     * 전역변수의 값을 지정합니다.
     * @param key 전역변수 이름
     * @param value 변수에 지정할 값
     */
    setGlobal(key, value) {
        let get = this.getStorage();
        get[key] = value;
        this.setStorage(get);
    }
    /**
     * 전역변수의 값을 가져옵니다.
     * @param key 가져올 전역변수 이름
     * @returns 가져온 값
     */
    getGlobal(key) {
        let result = this.getStorage()[key];
        return result;
    }
    /**
     * 사용할 개인변수를 등록합니다.
     * @param player 개인
     * @param key 개인변수 이름
     */
    addPersonal(player, key) {
        let get = this.getPerStorage(player);
        get[key] = null;
        this.setPerStorage(player, get);
    }
    /**
     * 개인변수의 값을 지정합니다.
     * @param key 개인변수 이름
     * @param value 변수에 지정할 값
     * @param player 개인
     */
    setPersonal(player, key, value) {
        let get = this.getPerStorage(player);
        get[key] = value;
        this.setPerStorage(player, get);
    }
    /**
     * 개인변수의 값을 가져옵니다.
     * @param player 개인
     * @param key 가져올 개인변수 이름
     * @returns 가져온 값
     */
    getPersonal(player, key) {
        let result = this.getPerStorage(player)[key];
        return result;
    }
}
export const storage = new worldStorage();
