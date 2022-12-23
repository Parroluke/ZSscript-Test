import { Location } from "@minecraft/server";
import { runCommand } from "./function.js";
/**
 * 파티클 관련 함수
 * @param name 파티클 이름
 */
export class Particle {
    constructor(public name: string) {
        this.name = name;
    }
    line(loc1: Location, loc2: Location, count: number) {
        const sub: Location = new Location((loc2.x-loc1.x)/count, (loc2.y-loc1.y)/count, (loc2.z-loc1.z)/count);
        let loc3: Location = loc1;
        while(!loc3.equals(loc2)) {
            runCommand(`particle minecraft:${this.name} ${loc3.x.toFixed(2)} ${loc3.y.toFixed(2)} ${loc3.z.toFixed(2)}`)
            loc3 = new Location(loc3.x+sub.x, loc3.y+sub.y, loc3.z+sub.z)
        }
    }
    square(loc1: Location, loc2: Location, count: number, random: undefined | boolean) {

    }
    circle() {}
    sphere(loc: Location, r: number, count: number) {
        for(let i=0; i<count; i++) {
            const random: number = Math.random()*(r*2)-r;
            const random2: number = Math.random()*(r*2)-r;
            const random3: number = Math.random()*(r*2)-r;
            const sum = { x: loc.x+random, y: loc.y+random2, z: loc.z+random3 };
            if(Math.sqrt(Math.pow(sum.x-loc.x,2)+Math.pow(sum.z-loc.z,2)+Math.pow(sum.z-loc.z,2))<=r)runCommand(`particle minecraft:${this.name} ${sum.x.toFixed(2)} ${sum.y.toFixed(2)} ${sum.z.toFixed(2)}`)   
        }
    }
}