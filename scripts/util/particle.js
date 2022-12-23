import { Location } from "@minecraft/server";
import { runCommand } from "./function.js";
/**
 * 파티클 관련 함수
 * @param name 파티클 이름
 */
export class Particle {
    constructor(name) {
        this.name = name;
        this.name = name;
    }
    line(loc1, loc2, count) {
        const sub = new Location((loc2.x - loc1.x) / count, (loc2.y - loc1.y) / count, (loc2.z - loc1.z) / count);
        let loc3 = loc1;
        while (!loc3.equals(loc2)) {
            runCommand(`particle minecraft:${this.name} ${loc3.x.toFixed(2)} ${loc3.y.toFixed(2)} ${loc3.z.toFixed(2)}`);
            loc3 = new Location(loc3.x + sub.x, loc3.y + sub.y, loc3.z + sub.z);
        }
    }
    square(loc1, loc2, count, random) {
    }
    circle() { }
    sphere(loc, r, count) {
        for (let i = 0; i < count; i++) {
            const random = Math.random() * (r * 2) - r;
            const random2 = Math.random() * (r * 2) - r;
            const random3 = Math.random() * (r * 2) - r;
            const sum = { x: loc.x + random, y: loc.y + random2, z: loc.z + random3 };
            if (Math.sqrt(Math.pow(sum.x - loc.x, 2) + Math.pow(sum.z - loc.z, 2) + Math.pow(sum.z - loc.z, 2)) <= r)
                runCommand(`particle minecraft:${this.name} ${sum.x.toFixed(2)} ${sum.y.toFixed(2)} ${sum.z.toFixed(2)}`);
        }
    }
}
