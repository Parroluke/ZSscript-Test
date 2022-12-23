import { world } from "@minecraft/server";
export class Event {
    constructor() {
        /**
         * 이벤트를 감지하여 함수를 실행합니다.
         */
        this.events = [];
        world.events.tick.subscribe(data => this.emit('tick', data));
        world.events.chat.subscribe(data => this.emit('chat', data));
        world.events.itemUse.subscribe(data => this.emit('itemUse', data));
        world.events.itemUseOn.subscribe(data => this.emit('itemUseOn', data));
        world.events.chat.subscribe(data => this.emit('chat', data));
        world.events.entityHit.subscribe(data => this.emit('entityHit', data));
        world.events.entityHurt.subscribe(data => this.emit('entityHurt', data));
        world.events.blockBreak.subscribe(data => this.emit('blockBreak', data));
        world.events.blockPlace.subscribe(data => this.emit('blockPlace', data));
        world.events.playerJoin.subscribe(data => this.emit('playerJoin', data));
        world.events.playerLeave.subscribe(data => this.emit('playerLeave', data));
        world.events.itemCompleteCharge.subscribe(data => this.emit('itemCompleteCharge', data));
        world.events.beforeItemDefinitionEvent.subscribe(data => this.emit('beforeItemDefinition', data));
        world.events.itemReleaseCharge.subscribe(data => this.emit('itemReleaseCharge', data));
        world.events.beforeChat.subscribe(data => this.emit('beforeChat', data));
        world.events.worldInitialize.subscribe(data => this.emit('worldInitialize', data));
    }
    /**
     * 감지할 이벤트와 실행할 함수를 추가합니다.
     * @param {String} eventName 감지할 이벤트
     * @param {Function} func 실행할 함수
     */
    addEvent(eventName, func) {
        const tmp = {
            eventName,
            func,
        };
        this.events.push(tmp);
        return func;
    }
    /**
     * 이벤트를 삭제합니다.
     * @param {String} eventName 이벤트 속성
     * @param {Function} func 함수
     */
    removeEvent(eventName, func) {
        if (typeof func === "number")
            this.events.splice(func, 1);
        const index = this.events.findIndex(v => v.eventName === eventName && v.func === func);
        if (index !== -1)
            this.events.splice(index, 1);
    }
    /**
     * 이벤트 실행
     * @param {String} eventName 이벤트 속성
     * @param  {any[]} args 파라미터
     */
    emit(eventName, ...args) {
        this.events.forEach(obj => {
            if (obj.eventName == eventName) {
                obj.func(...args);
            }
        });
    }
}
/**
 * 이벤트 감지 클래스
 */
export const event = new Event();
