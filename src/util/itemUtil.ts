import { Items, ItemStack } from "@minecraft/server"

/**
 * 아이템 세팅 클래스
 * @param {ItemStack} item 아이템
 */
export class ItemUtil {
    
    constructor(public item: ItemStack) {
        this.item = item;
    }

    //이제 안쓰는 함수
    // newItem(item: ItemStack): ItemStack {
    //     const newItem = new ItemStack(Items.get(item.id), item.amount, item.data);
    //     newItem.nameTag = item.nameTag;
    //     newItem.getComponents = item.getComponents
    //     newItem.setLore(item.getLore());
    //     newItem.getComponent('enchantments').enchantments = item.getComponent('enchantments').enchantments;
    //     return newItem
    // }


    /**
     * 아이템의 부가 설명을 바꿉니다.
     * @param lore 
     * @returns 바뀐 아이템
     */
    setLore(lore: string[]): ItemStack {
        let loreItem = this.item
        loreItem.setLore(lore)
        return loreItem
    }
    
    /**
     * 아이템의 데이터를 바꿉니다.
     * @param data 
     * @returns 바뀐 아이템
     */
    setData(data: number): ItemStack {
        let dataItem = this.item
        dataItem.data = data
        return dataItem
    }

    /**
     * 아이템의 이름을 바꿉니다.
     * @param nameTag 
     * @returns 바뀐 아이템
     */
    setNameTag(nameTag: string): ItemStack {
        let nameItem = this.item
        nameItem.nameTag = nameTag
        return nameItem
    }
    /**
     * 아이템의 내구도를 바꿉니다.
     * @param durability
     * @returns 바뀐 아이템
     */
    setDurability(durability:number) {
        let item = this.item
        item.getComponent('minecraft:durability').damage = durability;
        return item
    } 
}