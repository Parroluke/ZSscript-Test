import {World,Commands,BlockLocation,Location} from "@minecraft/server"
let pls

World.events.tick.subscribe(()=> {
    pls = findPlayer("JinhyoungLuke")
    let pld = getCardinalDirection('me',pls)
    runCommand(`title @a actionbar ${pld}`)
})


export function  getBlockLocation(player) {
    return new BlockLocation(Math.floor(player.location.x), Math.floor(player.location.y), Math.floor(player.location.z));
}
export function getDirection(player) {
    const ocA = player.location;
    let ocB;
    const dimension = World.getDimension('overworld')
    runCommand(`execute "${player.nameTag}" ~~~ summon wedit:direction_marker ~~~`);
    let entity;
    for (const e of dimension.getEntitiesAtBlockLocation(getBlockLocation(player))) {
        if (e.id == 'wedit:direction_marker') {
            entity = e;
            entity.nameTag = 'direction_for_' + player.nameTag.replace(' ', '_');
            break;
        }
    }
    runCommand(`execute "${player.nameTag}" ~~~ tp @e[name=${entity.nameTag}] ^^^20`);
    ocB = entity.location;
    runCommand(`execute @e[name=${entity.nameTag}] ~~~ tp @s ~ -256 ~`);
    entity.kill();
    entity.nameTag = 'kill';
    let di = [ocB.x - ocA.x, ocB.y - ocA.y, ocB.z - ocA.z];
    const lend = Math.sqrt(di[0] * di[0] + di[1] * di[1] + di[2] * di[2]);
    di = di.map(v => { return v / lend; });
    return new Location(di[0], di[1], di[2]);
}

export function findPlayer(name) {
    let pl = World.getPlayers();

    for (let p = 0; p < pl.length; p++) {
        if(name == pl[p].nameTag)
        { return (pl[p]); }
    }
    return (false);
}

export function runCommand(command) {
    try { 
        return { error: false, ...Commands.run(command, World.getDimension('overworld')) };
    } catch(error) {
        return { error: true };
    }
}
const DIRECTIONS = {
    'u': [0, 1, 0],
    'd': [0, -1, 0],
    'n': [0, 0, -1],
    's': [0, 0, 1],
    'e': [1, 0, 0],
    'w': [-1, 0, 0]
};
export function getCardinalDirection(direction, player) {
    const dirChar = direction.charAt(0);
    if (DIRECTIONS[dirChar]) {
        return DIRECTIONS[dirChar];
    }
    else {
        const dir = getDirection(player);
        let cardinal;
        const absDir = [Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z)];
        if (absDir[0] > absDir[1] && absDir[0] > absDir[2]) {
            cardinal = [Math.sign(dir.x), 0, 0];
        }
        else if (absDir[2] > absDir[0] && absDir[2] > absDir[1]) {
            cardinal = [0, 0, Math.sign(dir.z)];
        }
        else {
            cardinal = [0, Math.sign(dir.y), 0];
        }
        if (dirChar == 'b') {
            cardinal = cardinal.map(n => { return -n; });
        }
        else if (dirChar == 'l' || dirChar == 'r') {
            cardinal = absDir[0] > absDir[2] ? [Math.sign(dir.x), 0, 0] : [0, 0, Math.sign(dir.z)];
            if (dirChar == 'r') {
                cardinal = [-cardinal[2], 0, cardinal[0]];
            }
            else {
                cardinal = [cardinal[2], 0, -cardinal[0]];
            }
        }
        return cardinal;
    }
}
