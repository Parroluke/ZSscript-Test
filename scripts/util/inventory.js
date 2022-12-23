/**
 * 인벤토리 관련 클래스
 */
export class inventory {
    constructor(entity) {
        this.entity = entity;
        this.entity = entity;
        const inven = entity.getComponent('inventory');
        this.con = inven.container;
    }
    /**
     * 엔티티의 아이템을 가져옵니다.
     * @param index 가져올 인벤 번호
     * @returns 가져온 아이템
     */
    getItem(index) {
        return this.con.getItem(index);
    }
    /**
     * 엔티티의 인벤토리에 아이템을 세팅합니다.
     * @param index 인벤 번호
     * @param item 셋할 아이템
     */
    setItem(index, item) {
        this.con.setItem(index, item);
    }
}
/**
 *  플레이어 인벤토리 관련 클래스
 */
export class PlayerInventory extends inventory {
    constructor(player) {
        super(player);
        this.player = player;
        this.player = player;
    }
    /**
     * 플레이어의 손에 아이템을 세팅합니다.
     * @param item 셋할 아이템
     */
    handSetItem(item) {
        this.con.setItem(this.player.selectedSlot, item);
    }
    /**
     * 플레이어의 손에 있는 아이템을 가져옵니다.
     * @returns 가져온 아이템
     */
    handGetItem() {
        return this.con.getItem(this.player.selectedSlot);
    }
}
