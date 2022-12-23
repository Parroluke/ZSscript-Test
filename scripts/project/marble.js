const nation = [
    '시작', '베트남', '인도', '중국', '도박', 'UAE', '이집트', '터키', '감옥', '일본', '멕시코', '브라질',
    '황금열쇠', '호주', '덴마크', '스페인', '축제', '스웨덴', '노르웨이', '독일', '행운', '러시아', '이탈리아', '네덜란드',
    '포탈', '캐나다', '영국', '프랑스', '황금열쇠', '미국', '한국', '국세청'
];
const nationprice = [
    0, 7, 9, 11, 0, 13, 15, 17, 0,
    19, 21, 23, 0, 25, 27, 29, 0, 31,
    33, 35, 0, 37, 39, 41, 0, 43, 45,
    47, 0, 49, 51, 0
];
const NoneBuild = [`0`, `4`, `8`, `12`, `16`, `20`, `24`, `28`, `31`];
const playerColor = ["§c", "§a", "§9", "§d"];
import { runCommand, getScore, tellraw, subtitle, actionbarRaw, getPlayerWithTag } from "../util/function.js";
import { world } from "@minecraft/server";
const prefix = "marble";
let dicetick = 0;
let sneak;
let turnnum;
let turnpl;
let kan;
let owner;
let ownerpl;
let turnname;
world.events.tick.subscribe(({ currentTick }) => {
    //dice
    dicetick++;
    if (dicetick > 20) {
        runCommand(`scoreboard players test dice marble 1 1`).then(()=>{
            runCommand(`scoreboard players set dice marble 0 `);
            runCommand(`scoreboard players remove roll marble 1`);
            runCommand(`scoreboard players set rolled marble 1`);
            let portalkan = getScore(`portal${turnnum}`, `marble`);
            if (portalkan != -2) {
                runCommand(`title @a title §d포탈 : §b${nation[portalkan]}`);
                runCommand(`scoreboard players set portal${turnnum} marble -2`);
                let portaladd = portalkan > getScore(`marblekan${turnnum}`, `marbleNation`) ? portalkan - getScore(`marblekan${turnnum}`, `marbleNation`) : (portalkan + 32) - getScore(`marblekan${turnnum}`, `marbleNation`);
                runCommand(`scoreboard players set dices marble ${portaladd}`);
            }
            else {
                let dice1 = Math.floor(Math.random() * 6);
                let dice2 = Math.floor(Math.random() * 6);
                runCommand(`clone -301 4 ${-401 + (dice1 * 7)} -295 20 ${-394 + (dice1 * 7)} -271 4 -437`);
                runCommand(`clone -301 4 ${-401 + (dice2 * 7)} -295 20 ${-394 + (dice2 * 7)} -264 4 -432`);
                runCommand(`title @a title §l${(dice1 + 1) + (dice2 + 1)}`);
                runCommand(`scoreboard players add dices marble ${(dice1 + 1) + (dice2 + 1)}`);
                if (dice1 == dice2) {
                    runCommand(`title @a subtitle 더블!`);
                    runCommand(`scoreboard players add roll marble 1`);
                    if (getScore(`prison${turnnum}`, `marble`) > 0)
                        runCommand(`scoreboard players set prison${turnnum} marble -1`);
                }
            }
        })
    }
    if (currentTick % 4 == 0) {
        //dice move
        let dices = getScore('dices', 'marble');
        turnnum = getScore('turn', 'marble');
        if (dices > 0) {
            if (getScore(`prison${turnnum}`, `marble`) > 0) {
                runCommand(`title @a subtitle 탈출 실패! ${getScore(`prison${turnnum}`, `marble`)}턴 남음!`);
                runCommand(`scoreboard players set dices marble 0`);
                runCommand(`scoreboard players remove prison${turnnum} marble 1`);
            }
            else {
                if (getScore(`prison${turnnum}`, `marble`) == -1) {
                    runCommand(`title @a subtitle 탈출 성공!`);
                    runCommand(`scoreboard players set prison${turnnum} marble 0`);
                }
                runCommand(`scoreboard players add marblekan${turnnum} marbleNation 1`);
                if (getScore(`marblekan${turnnum}`, `marbleNation`) > 31)
                    runCommand(`scoreboard players remove marblekan${turnnum} marbleNation 32`);
                const malLoc = ["~0.2~4~0.2", "~-0.2~4~0.2", "~-0.2~4~-0.2", "~0.2~4~-0.2"];
                runCommand(`execute @e[name=marblekan${getScore(`marblekan${turnnum}`, `marbleNation`)}] ~~~ tp @e[tag=marblemal] ${[malLoc[turnnum - 1]]}`);
                runCommand(`execute @e[tag=marblemal] ~~~ tp @s @s`);
                turnpl = getPlayerWithTag(`marble${turnnum}P`);
                turnname = `${playerColor[turnnum - 1]}${turnpl.nameTag} §f:`;
                runCommand(`testfor @e[tag=marblemal,x=-250,y=5,z=-448,dx=3,dy=0,dz=-3]`).then(()=>{
                    runCommand(`execute @e[tag=marblemal] ~~~ structure load marbleM ~~~`);
                    runCommand(`execute @a ~~~ playsound dig.chain @s ~~~ 1 0.5`);
                    let monthMoney = dices == 1 ? 200 : 100;
                    tellraw(`@a`, `§e출발지 도착! ${playerColor[turnnum - 1]}${turnpl.nameTag} + ${monthMoney}`);
                    runCommand(`scoreboard players add ${turnpl.nameTag} marblemoney ${monthMoney}`);
                    runCommand(`scoreboard players add lap${turnnum} marble 1 `);
                })
                let turnKan = getScore(`marblekan${turnnum}`, `marbleNation`);
                if (turnKan == 8 && dices == 1) {
                    tellraw(`@a`, `${turnname} §4감옥 도착!`);
                    runCommand(`playsound random.anvil_land @a`);
                    if (getScore(`prison${turnnum}`, `marble`) == -2) {
                        subtitle(`@a`, `감옥 면제권 사용!`);
                        runCommand(`scoreboard players set prison${turnnum} marble 0`);
                    }
                    else {
                        subtitle(`@a`, `더블이 나오기 전까지 3턴 동안 나갈 수 없음!`);
                        runCommand(`scoreboard players set prison${turnnum} marble 3`);
                    }
                }
                else if (turnKan == 24 && dices == 1) {
                    tellraw(`@a`, `${turnname} §5포탈에 도착!`);
                    runCommand(`playsound random.orb @a`);
                    subtitle(`${turnpl.nameTag}`, `다음 턴에 이동할 칸을 선택하세요!`);
                    runCommand(`scoreboard players set portal${turnnum} marble -1`);
                }
                else if (turnKan == 4 && dices == 1) {
                    tellraw(`@a`, `${turnname} §9도박`);
                    runCommand(`playsound random.orb @a`);
                    subtitle(`${turnpl.nameTag}`, `도박에 걸 금액을 채팅창에 입력해주세요.`);
                    runCommand(`scoreboard players set dobak${turnnum} marble -1`);
                    turnpl.addTag(`dobakpl`);
                }
                else if (turnKan == 31 && dices == 1) {
                    let removeMoney = getScore(turnpl.nameTag, 'marblemoney') < 30 ? getScore(turnpl.nameTag, 'marblemoney') : 30;
                    tellraw(`@a`, `${turnname} §e국세청 도착! (세금 -${removeMoney})`);
                    runCommand(`scoreboard players remove ${turnpl.nameTag} marblemoney ${removeMoney}`);
                    runCommand(`scoreboard players add segold marble ${removeMoney}`);
                    runCommand(`fill -283 9 -432 -283 9 -434 concretepowder 4`);
                    //runCommand(`fill -283 5 -432 -283 9 -434 yellow_glazed_terracota 0 replace concretepowder`)
                    runCommand(`execute @a ~~~ playsound land.chain @s ~~~ 1 0.5`);
                }
                else if (turnKan == 20 && dices == 1) {
                    let segold = getScore('segold', 'marble');
                    tellraw(`@a`, `${turnname} §b행운 도착! (+${segold})`);
                    runCommand(`scoreboard players set segold marble 0`);
                    runCommand(`scoreboard players add ${turnpl.nameTag} marblemoney ${segold}`);
                    runCommand(`fill -283 5 -432 -283 9 -434 air`);
                    runCommand(`execute @a ~~~ playsound dig.chain @s ~~~ 1 1.5`);
                }
                else if (turnKan == 12 && dices == 1) {
                    goldKey(turnnum);
                }
                else if (turnKan == 28 && dices == 1) {
                    goldKey(turnnum);
                }
                else if (turnKan == 16 && dices == 1) {
                    tellraw(`@a`, `${turnname} §6축제에 도착!`);
                    subtitle(`@a`, `최대 3곳까지 통행료 2배!`);
                    for (let v = 0; v < 3; v++) {
                        let partyNa = getScore(`party${v}`, `marbleNation`);
                        if (partyNa != 0)
                            runCommand(`scoreboard players set price${partyNa} marbleNation ${getScore(`price${partyNa}`, `marbleNation`) / 2}`);
                    }
                    let partyarr = [];
                    for (let i = 0; i < 32; i++) {
                        if (getScore(`owner${i}`, `marbleNation`) == turnnum)
                            partyarr.push(i);
                    }
                    let partyarr2 = [];
                    if (partyarr.length == 0)
                        tellraw(`@a`, `§c축제가 일어날 수 있는 땅이 없음..`);
                    else {
                        runCommand(`scoreboard players set party marble ${turnnum}`);
                        for (let b = 0; b < 3 && b < partyarr.length; b++) {
                            let Naran = Math.floor(Math.random() * partyarr.length);
                            if (partyarr2.includes(partyarr[Naran]) == false)
                                partyarr2.push(partyarr[Naran]);
                            let per = Math.floor(Math.random() * 2);
                            if (b < 0 && per == 0)
                                partyarr2.pop();
                        }
                        for (let i = 0; i < partyarr2.length; i++) {
                            runCommand(`scoreboard players set price${partyarr2[i]} marbleNation ${getScore(`price${partyarr2[i]}`, `marbleNation`) * 2}`);
                            runCommand(`scoreboard players set party${i} marbleNation ${partyarr2[i]}`);
                            runCommand(`playsound firework.launch @a`);
                            tellraw(`@a`, `${nation[partyarr2[i]]} §b축제 개최!`);
                        }
                    }
                }
                if (dices == 1) {
                    kan = getScore(`marblekan${turnnum}`, 'marbleNation');
                    owner = getScore(`owner${kan}`, 'marbleNation');
                    if (!(owner == turnnum || owner == 0)) {
                        if (getScore(`tonghang${turnnum}`, 'marble') > 0) {
                            tellraw(`@a`, `${playerColor[turnnum - 1]}${turnpl.nameTag} §f: 통행료 면제권 사용`);
                            runCommand(`playsound random.levelup @a`);
                            runCommand(`scoreboard players remove tonghang${turnnum} marble 1`);
                        }
                        else {
                            ownerpl = getPlayerWithTag(`marble${owner}P`);
                            if (getScore(`total${turnnum}`, `marble`) <= getScore(`price${kan}`, 'marbleNation')) {
                                runCommand(`scoreboard players operation ${ownerpl.nameTag} marblemoney += ${turnpl.nameTag} marblemoney`);
                                tellraw(`@a`, `${playerColor[turnnum - 1]}${turnpl.nameTag} §d- §f${getScore(`total${turnnum}`, `marble`)} §b+ ${playerColor[owner - 1]}${ownerpl.nameTag}`);
                                pasan(turnnum);
                            }
                            else if (getScore(turnpl.nameTag, `marblemoney`) < getScore(`price${kan}`, `marbleNation`)) {
                                runCommand(`scoreboard players set sell marble 1`);
                                runCommand(`title @a title §4주의! 파산위험!`);
                                runCommand(`title @a subtitle §a통행료를 낼 수 있도록 땅을 매각하세요!`);
                            }
                            else {
                                runCommand(`scoreboard players operation ${turnpl.nameTag} marblemoney -= price${kan} marbleNation `);
                                runCommand(`scoreboard players operation ${ownerpl.nameTag} marblemoney += price${kan} marbleNation `);
                                tellraw(`@a`, `${playerColor[turnnum - 1]}${turnpl.nameTag} §d- §f${getScore(`price${kan}`, 'marbleNation')} §b+ ${playerColor[owner - 1]}${ownerpl.nameTag}`);
                            }
                        }
                    }
                }
                runCommand(`playsound random.pop @a`);
                runCommand(`scoreboard players remove dices marble 1`);
            }
        }
    }
});
world.events.tick.subscribe(({ currentTick }) => {
    if (getScore(`pls`, `marble`) == 1) {
        runCommand(`title @a title §e @a[tag=!marblepasan]`);
        runCommand(`title @a subtitle §e모두를 파산시킨 최고의 부자`);
        runCommand(`execute @a[tag=!marblepasan] ~~~ summon fireworks_rocket ~~2~`);
        for (let i = 1; i < 5; i++) {
            runCommand(`tag @a remove marble${i}P`);
            runCommand(`execute @e[name=marblemal${i}] ~~~ tp @s ~ -104 ~`);
        }
        tellraw(`@a`, `'marble stop'을 채팅창에 입력하여 게임을 끝내주세요.`);
        runCommand(`scoreboard players set pls marble -1`);
    }
    if (currentTick % 10 == 0) {
        //actionbar
        for (let b = 0; b < 32; b++) {
            runCommand(`scoreboard players add level${b} marbleNation 0`);
            runCommand(`scoreboard players add owner${b} marbleNation 0`);
            runCommand(`scoreboard players add price${b} marbleNation 0`);
            if (getScore(`price${b}`, `marbleNation`) == 0)
                runCommand(`scoreboard players set price${b} marbleNation ${nationprice[b]}`);
            if (nationprice[b] == 0)
                runCommand(`execute @e[name=marblekan${b}] ~~4~ titleraw @a[r=2] actionbar {"rawtext":[{"text":"§a${nation[b]}"}]}`);
            else
                runCommand(`execute @e[name=marblekan${b}] ~~4~ titleraw @a[r=2] actionbar {"rawtext":[{"text":"§d국가 : ${nation[b]}\n§a원가 : ${nationprice[b]}\n§e통행료 : ${getScore(`price${b}`, `marbleNation`)}"}]}`);
        }
        for (let k = 0; k < getScore(`players`, `marble`); k++) {
            let totalprice = 0;
            for (let b = 0; b < 32; b++) {
                if (getScore(`owner${b}`, `marbleNation`) == k + 1)
                    totalprice = totalprice + getScore(`price${b}`, `marbleNation`);
            }
            let q = new EntityQueryOptions();
            q.tags = [`marble${k + 1}P`];
            let mp = [...world.getPlayers(q)][0].nameTag;
            runCommand(`scoreboard players set total${k + 1} marble ${totalprice + getScore(`${mp}`, `marblemoney`)}`);
            runCommand(`scoreboard players operation "${playerColor[k]}${mp}" marblemoney2 = ${mp} marblemoney`);
        }
    }
    turnnum = getScore('turn', 'marble');
    turnpl = getPlayerWithTag(`marble${turnnum}P`);
    turnname = `${playerColor[turnnum - 1]}${turnpl.nameTag} §f:`;
    runCommand(`execute @e[name=marblemal${turnnum}] ~~~ particle minecraft:endrod ~~5~`);
    for (let i = 0; i < 3; i++) {
        if (getScore(`party${i}`, `marbleNation`) != 0)
            runCommand(`execute @e[name=marblekan${getScore(`party${i}`, `marbleNation`)}] ~~~ particle minecraft:villager_happy ~~4.3~`);
    }
    if (turnpl.isSneaking == false)
        sneak = 1;
    //sneak
    if (sneak == 1 && turnpl.isSneaking == true) {
        //runCommand(`say ${turnpl.isSneaking}`)
        runCommand(`testfor @a[tag=marble${turnnum}P,x=-252,y=4,z=-446,dx=-26,dy=30,dz=26]`).then(()=>{
            sneak = 0;
            if (getScore('roll', 'marble') > 0 && getScore(`sell`, 'marble') != 1 && getScore(`portal${turnnum}`, `marble`) != -1 && getScore(`dobak${turnnum}`, `marble`) == !-1)
                dice();
            else if (getScore('dices', 'marble') == 0 && getScore(`sell`, 'marble') != 1 && getScore(`portal${turnnum}`, `marble`) != -1 && getScore(`dobak${turnnum}`, `marble`) == !-1)
                turn();
        })
    }
    runCommand(`scoreboard players test dice marble 1 1`).then(()=>{
        dicetick = 0;
        runCommand(`kill @e[name="Polished Blackstone Button",type=item]`);
    })
        
    runCommand(`testfor @a[tag=marble${turnnum}P,x=-252,y=4,z=-446,dx=-26,dy=30,dz=26]`).then(()=>{
        if (getScore('roll', 'marble') == 1 && getScore(`sell`, 'marble') != 1 && getScore(`portal${turnnum}`, `marble`) != -1 && getScore(`dobak${turnnum}`, `marble`) == !-1)
            actionbarRaw(`@a[tag=marble${turnnum}P]`, `§6[ §7주사위 굴리기 §6]`);
        else if (getScore('dices', 'marble') == 0 && getScore(`sell`, 'marble') != 1 && getScore(`portal${turnnum}`, `marble`) != -1 && getScore(`dobak${turnnum}`, `marble`) == !-1)
            actionbarRaw(`@a[tag=marble${turnnum}P]`, `§6[ §7턴 넘기기 §6]`);
    })
    
    let turnplLoc = { x: Math.round(turnpl.location.x), y: Math.round(turnpl.location.y), z: Math.round(turnpl.location.z) };
    let turnMarbleKan = getScore(`marblekan${turnnum}`, `marbleNation`);
    let turnKanEntity = `@e[name=marblekan${turnMarbleKan},x=${turnplLoc.x},y=${turnplLoc.y - 4},z=${turnplLoc.z},r=2,c=1]`;
    let turnKanEntitytest = runCommand(`testfor ${turnKanEntity}`)
    turnKanEntitytest.then(()=>{
        let turnKan = turnKanEntitytest.split(' ')[1] == "검색됨" ? `${turnMarbleKan}` : turnKanEntitytest.slice(15);
        let buildLv = getScore(`level${turnKan}`, 'marbleNation');
        let owner = getScore(`owner${turnKan}`, `marbleNation`);
        let price = getScore(`price${turnKan}`, 'marbleNation');
        let price2 = nationprice[turnKan];
        let price3 = Math.round(((price2 + 15) * 1.2));
        for (let p = 0; p < buildLv; p++) {
            price2 = Math.round(((price2 + 8) * 1.1));
            price3 = Math.round(((price3 + 15) * 1.2));
        }
        if (owner != turnnum && owner != 0 && getScore(`sell`, `marble`) == 0 && getScore(`rolled`, `marble`) == 1) {
            actionbarRaw(turnpl.nameTag, `§d${nation[turnKan]}\n§e비용 : ${price}\n§6[ §d인수하기 §6]`);
            let ownerpl = getPlayerWithTag(`marble${owner}P`);
            if (turnpl.isSneaking == true && sneak == 1) {
                sneak = 0;
                if (getScore(`${turnpl.nameTag}`, `marblemoney`) >= price) {
                    runCommand(`scoreboard players remove ${turnpl.nameTag} marblemoney ${price} `);
                    runCommand(`scoreboard players add ${ownerpl} marblemoney ${price}`);
                    tellraw(`@a`, `§f${nation[turnKan]}[${price}] §d소유권 이전! ${playerColor[owner - 1]}${ownerpl.nameTag} §f-> ${playerColor[turnnum - 1]}${turnpl.nameTag}`);
                    runCommand(`scoreboard players set owner${turnKan} marbleNation ${turnnum}`);
                    runCommand(`execute ${turnKanEntity} ~~~ particle minecraft:knockback_roar_particle ~~4~`);
                    runCommand(`execute ${turnKanEntity} ~~~ playsound random.anvil_use @a ~~4~ 3 1.5`);
                    build(`@e[name=marbleKan${turnKan}]`, getScore(`level${turnKan}`, `marbleNation`) - 1, turnnum, kan);
                }
                else {
                    tellraw(turnpl.nameTag, `§c인수하기 위한 돈이 부족합니다.`);
                }
            }
        }
        if (getScore('rolled', 'marble') == 1 && NoneBuild.includes(turnKan) == false && getScore(`lap${turnnum}`, 'marble') >= buildLv && buildLv < 4) {
            if (getScore(`${turnpl.nameTag}`, 'marblemoney') < price2)
                actionbarRaw(`${turnpl.nameTag}`, `§d${nation[turnKan]}\n§e비용 : ${price2}\n§c돈 부족`);
            else if (owner == turnnum || owner == 0) {
                actionbarRaw(`${turnpl.nameTag}`, `§d${nation[turnKan]}\n§e비용 : ${price2}\n§6[ §a건설하기 §6]`);
                if (sneak == 1 && turnpl.isSneaking == true) {
                    sneak = 0;
                    for (let i = 0; i < 3; i++) {
                        if (getScore(`party${i}`, `marbleNation`) == turnKan) {
                            price3 = price3 * 2;
                        }
                    }
                    runCommand(`execute ${turnKanEntity} ~~~ particle minecraft:knockback_roar_particle ~~4~`);
                    runCommand(`execute ${turnKanEntity} ~~~ playsound random.anvil_use @a ~~4~ 3 1.5`);
                    if (buildLv == 0)
                        runCommand(`scoreboard players set owner${turnKan} marbleNation ${turnnum}`);
                    build(turnKanEntity, buildLv, turnnum, turnKan);
                    runCommand(`scoreboard players add level${turnKan} marbleNation 1`);
                    runCommand(`scoreboard players set price${turnKan} marbleNation ${price3}`);
                    runCommand(`scoreboard players remove ${turnpl.nameTag} marblemoney ${price2}`);
                    tellraw(`@a`, `${turnname} §f${nation[turnKan]}[${price2}] §e건설 완료`);
                }
            }
        }
    })
});
world.events.tick.subscribe(({ currentTick }) => {
    turnnum = getScore('turn', 'marble');
    turnpl = getPlayerWithTag(`marble${turnnum}P`);
    let turnplLoc = { x: Math.round(turnpl.location.x), y: Math.round(turnpl.location.y), z: Math.round(turnpl.location.z) };
    if (getScore(`sell`, `marble`) == 1) {
        for (let c = 0; c < 32; c++) {
            if (getScore(`owner${c}`, `marbleNation`) == turnnum) {
                runCommand(`execute @e[name=marblekan${c}] ~~~ function marblesell`);
            let kanEntitytest = runCommand(`testfor @e[name=marblekan${c},x=${turnplLoc.x},y=${turnplLoc.y - 4},z=${turnplLoc.z},r=2]`)
            kanEntitytest.then(()=>{
                if(getScore(`owner${c}`, `marbleNation`) == turnnum) {
                    actionbarRaw(turnpl.nameTag, `§d${nation[c]}\n§6[ §4매각하기 §6]`);
                    if (sneak == 1 && turnpl.isSneaking == true) {
                        sneak = 0;
                        runCommand(`scoreboard players operation ${turnpl.nameTag} marblemoney += price${c} marbleNation`);
                        build(`@e[name=marblekan${c}]`, -1, turnnum, c);
                        runCommand(`execute @a ~~~ playsound dig.chain @s ~~~ 1 0.8`);
                        tellraw(`@a`, `§4${nation[c]} 매각!`);
                        kan = getScore(`marblekan${turnnum}`, 'marbleNation');
                        for (let i = 0; i < 3; i++) {
                            if (getScore(`party${i}`, `marbleNation`) == c) {
                                tellraw(`@a`, `${nation[c]}:§5축제 효과 해제`);
                                runCommand(`scoreboard players set party${i} marbleNation 0`);
                                runCommand(`scoreboard players set price${c} marbleNation ${getScore(`price${c}`, `marbleNation`) / 2}`);
                            }
                        }
                        if (getScore(turnpl.nameTag, `marblemoney`) > getScore(`price${kan}`, `marbleNation`)) {
                            owner = getScore(`owner${kan}`, 'marbleNation');
                            ownerpl = getPlayerWithTag(`marble${owner}P`);
                            runCommand(`scoreboard players set sell marble 0`);
                            runCommand(`scoreboard players operation ${turnpl.nameTag} marblemoney -= price${kan} marbleNation `);
                            runCommand(`scoreboard players operation ${ownerpl.nameTag} marblemoney += price${kan} marbleNation `);
                            tellraw(`@a`, `${playerColor[turnnum - 1]}${turnpl.nameTag} §d- §f${getScore(`price${kan}`, 'marbleNation')} §b+ ${playerColor[owner - 1]}${ownerpl.nameTag}`);
                        }
                    }
                }
            }) 
            
        }
    }
    if (getScore(`portal${turnnum}`, `marble`) == -1) {
        for (let c = 0; c < 32; c++) {
            if (c != 24) {
                let kanEntitytest = runCommand(`testfor @e[name=marblekan${c},x=${turnplLoc.x},y=${turnplLoc.y - 4},z=${turnplLoc.z},r=2]`)
                kanEntitytest.then(()=>{
                    actionbarRaw(`${turnpl.nameTag}`, `§d${nation[c]}\n§6[ §e이동하기 §6]`);
                    if (sneak == 1 && turnpl.isSneaking == true) {
                        sneak == 0;
                        runCommand(`scoreboard players set portal${turnnum} marble ${c}`);
                        tellraw(`${turnpl.nameTag}`, `§b이동할 장소 : §d${nation[c]}`);
                        }
                })
                }
            }
        }
    }
});
//chat Command
world.events.beforeChat.subscribe(data => {
    if (data.message.substr(0, prefix.length) == prefix) {
        data.cancel = true;
        allCommand(data);
    }
    turnnum = getScore('turn', 'marble');
    turnpl = getPlayerWithTag(`marble${turnnum}P`);
    turnname = `${playerColor[turnnum - 1]}${turnpl.nameTag} §f:`;
    const dobakData = parseInt(data.message);
    if (getScore(`dobak${turnnum}`, `marble`) == -1 && data.sender.hasTag('dobakpl')) {
        if (isNaN(data.message) == true || dobakData > getScore(turnpl.nameTag, 'marblemoney')) {
            if (isNaN(data.message) == true)
                tellraw(turnpl.nameTag, '§c돈을 정확한 정수로 입력하세요.(Ex.5)');
            else if (dobakData > getScore(turnpl.nameTag, 'marblemoney'))
                tellraw(turnpl.nameTag, '§c자산보다 많은 수의 돈을 걸 수 없습니다.');
        }
        else {
            runCommand(`setblock -277 4 -462 redstone_block`);
            let dice1 = Math.floor(Math.random() * 6) + 1;
            let dice2 = Math.floor(Math.random() * 6) + 1;
            runCommand(`clone -301 4 ${-401 + ((dice1 - 1) * 7)} -295 20 ${-394 + ((dice1 - 1) * 7)} -271 4 -437`);
            runCommand(`clone -301 4 ${-401 + ((dice2 - 1) * 7)} -295 20 ${-394 + ((dice2 - 1) * 7)} -264 4 -432`);
            const diceplus = dice1 + dice2;
            if (diceplus > 7) {
                runCommand(`title @a title §l${dice1}+${dice2}=§b${diceplus}`);
                tellraw(`@a`, `${turnname} §b도박 성공!(+${dobakData})`);
                runCommand(`scoreboard players add ${turnpl.nameTag} marblemoney ${dobakData}`);
            }
            else {
                runCommand(`title @a title §l${dice1}+${dice2}=§c${diceplus}`);
                tellraw(`@a`, `${turnname} §c도박 실패..(-${dobakData})`);
                runCommand(`scoreboard players remove ${turnpl.nameTag} marblemoney  ${dobakData}`);
            }
            runCommand(`scoreboard players set dobak${turnnum} marble 0`);
            data.cancel = true;
            runCommand(`tag @a remove dobakpl`);
        }
    }
});
export function allCommand(data) {
    if (data.message.trim() == prefix + " start") {
        runCommand(`scoreboard objectives add marble dummy`);
        runCommand(`scoreboard objectives add marblemoney2 dummy "§l§e SPECULATION "`);
        runCommand(`scoreboard objectives add marblemoney dummy `);
        runCommand(`scoreboard objectives add marbleNation dummy`);
        runCommand(`scoreboard objectives setdisplay sidebar marblemoney2`);
        runCommand(`scoreboard players set sell marble 0`);
        runCommand(`scoreboard players set segold marble 0`);
        for (let j = 1; j < 5; j++) {
            
            let getmarbleplayers = world.getPlayers({tags:[`marble${j}P`]})
            if (getmarbleplayers) {
                runCommand(`scoreboard players set players marble ${j}`);
                runCommand(`scoreboard players set pls marble ${j}`);
            }
            runCommand(`scoreboard players set lap${j} marble 0`);
            runCommand(`scoreboard players set prison${j} marble 0`);
            runCommand(`scoreboard players set portal${j} marble -2`);
            runCommand(`scoreboard players set dobak${j} marble 0`);
            runCommand(`scoreboard players set tonghang${j} marble 0`);
            if (j < 4)
                runCommand(`scoreboard players set party${j - 1} marbleNation 0`);
        }
        let marbleplayers = getScore('players', 'marble');
        if (marbleplayers > 1) {
            runCommand(`structure load marblemal1 -249 5 -448`);
            runCommand(`structure load marblemal2 -249 5 -449`);
            if (marbleplayers > 2)
                runCommand(`structure load marblemal3 -248 5 -449`);
            if (marbleplayers > 3)
                runCommand(`structure load marblemal4 -248 5 -448`);
            for (let j = 1; j < 5; j++) {
                runCommand(`scoreboard players set @a[tag=marble${j}P] marblemoney 500`);
                runCommand(`tag @e[name=marblemal${j}] add marblemals`);
            }
            runCommand(`scoreboard players set turn marble 0`);
            turn();
        }
        else if (marbleplayers == null || marbleplayers == 1) {
            stop();
            runCommand(`say §4시작하기 위한 인원 부족`);
        }
    }
    if (data.message.trim() == prefix + " stop") {
        stop();
    }
    if (data.message.trim() == prefix + " end") {
        let total = [];
        for (let i = 1; i <= getScore(`players`, `marble`); i++) {
            total.push(getScore(`total${i}`, `marble`));
        }
        let maxIndex = 0;
        let max = 0;
        for (let i = 1; i <= total.length; i++) {
            if (total[i - 1] > max) {
                max = total[i - 1];
                maxIndex = i;
            }
        }
        runCommand(`tag @a[tag=!marble${maxIndex}P] add marblepasan`);
        runCommand(`scoreboard players set pls marble 1`);
    }
}
export function stop() {
    try {
    for (let i = 1; i < 5; i++) {
        runCommand(`tag @a remove marble${i}P`);
        runCommand(`execute @e[name=marblemal${i}] ~~~ tp @s ~ -104 ~`);
    }
    runCommand('say e')
    build(`@e[tag=marblekan]`,-1,0,0)
    
    runCommand(`fill -283 5 -432 -283 9 -434 air`);
    runCommand(`scoreboard objectives remove marblemoney`);
    runCommand(`scoreboard objectives remove marblemoney2`);
    runCommand(`scoreboard objectives remove marbleNation`);
    runCommand(`scoreboard objectives remove marble`);
    runCommand(`tag @a remove marblepasan`);
    tellraw(`@a`, `§c게임 중지`);
} catch(e) {runCommand(`say ${e}`)}
}
export function dice() {
    runCommand(`setblock -277 4 -462 redstone_block`);
    runCommand(`scoreboard players set dice marble 1`);
}
export function turn() {
    runCommand(`scoreboard players add turn marble 1`);
    if (getScore('players', 'marble') == turnnum)
        runCommand(`scoreboard players set turn marble 1`);
    runCommand(`testfor @a[tag=marble${getScore('turn', 'marble')}P,tag=marblepasan]`).then(()=>{
        runCommand(`scoreboard players add turn marble 1`);
        let a = null;
        for (let i = getScore('turn', 'marble'); a == null; i++) {
            let pasan = runCommand(`testfor @a[tag=marblepasan,tag=marble${i}P]`)
            pasan.then(()=>{
                a = 1;
            })
            pasan.catch(()=>{
                runCommand(`scoreboard players add turn marble 1`);
            })
                
            if (getScore('turn', 'marble') > getScore(`players`, `marble`)) {
                runCommand(`scoreboard players set turn marble 1`);
                i = 1;
            }
        }
    })
    turnnum = getScore('turn', 'marble');
    runCommand(`tag @e remove marblemal`);
    runCommand(`tag @e[name=marblemal${turnnum}] add marblemal`);
    subtitle('@a', `${playerColor[turnnum - 1]}@a[tag=marble${turnnum}P] 의 차례입니다!`);
    runCommand(`title @a[tag=marble${turnnum}P] title 주사위를 굴리세요!`);
    runCommand(`scoreboard players add roll marble 1`);
    runCommand(`scoreboard players set rolled marble 0`);
    runCommand(`scoreboard players add turned marble 1`);
}
export function build(entity, level, owner, kan) {
    
    if (level == -1) {
        runCommand(`scoreboard players set owner${kan} marbleNation 0`);
        runCommand(`scoreboard players set price${kan} marbleNation 0`);
        runCommand(`scoreboard players set level${kan} marbleNation 0`);
    }
    let buildColor = [14, 5, 11, 6];
    runCommand(`execute ${entity} ~~~ detect ~~3~ concrete 5 structure load marbleBuild${level} ~-3~4~-1`);
    runCommand(`execute ${entity} ~~~ detect ~~3~ concrete 3 structure load marbleBuild${level} ~-1~4~-3 90_degrees`);
    runCommand(`execute ${entity} ~~~ detect ~~3~ concrete 4 structure load marbleBuild${level} ~1~4~-1 180_degrees`);
    runCommand(`execute ${entity} ~~~ detect ~~3~ concrete 14 structure load marbleBuild${level} ~-1~4~1 270_degrees`);
    runCommand(`execute ${entity} ~~4~ fill ~3~3~3 ~-3~-3~-3 wool ${buildColor[owner - 1]} replace wool 0`);
}
export function pasan(num) {
    tellraw(`@a`, `${playerColor[num - 1]}${getPlayerWithTag(`marble${num}P`).nameTag} §4파산!`);
    for (let b = 0; b < 32; b++) {
        if (getScore(`owner${b}`, `marbleNation`) == num)
            build(`@e[name=marblekan${b}]`, -1, num, b);
    }
    runCommand(`tag @a[tag=marble${num}P] add marblepasan`);
    runCommand(`scoreboard players reset @a[tag=marble${num}P] marblemoney`);
    runCommand(`scoreboard players reset ${playerColor[num - 1]}${getPlayerWithTag(`marble${num}P`).nameTag} marblemoney2`);
    runCommand(`scoreboard players set roll marble 0`);
    turn();
    runCommand(`execute @a ~~~ playsound random.anvil_use @s ~~~ 1 0.5`);
    runCommand(`execute @e[name=marblemal${num}] ~~~ tp @s ~ -104 ~`);
    runCommand(`scoreboard players remove pls marble 1`);
}
export function goldKey(turnnum) {
    turnpl = getPlayerWithTag(`marble${turnnum}P`);
    turnname = `${playerColor[turnnum - 1]}${turnpl.nameTag} §f:`;
    kan = getScore(`marblekan${turnnum}`, `marbleNation`);
    let tpkan;
    const goldEvent = ['감옥 면제권', '세계여행', '축제 개최', '긴급 체포', '월급 보너스', '도박 중독', '언럭키 가이', '폭풍우', '통행료 면제권', '자리 교환'];
    const event = Math.floor(Math.random() * goldEvent.length);
    runCommand(`title @a title §e${goldEvent[event]}`);
    tellraw(`@a`, `${turnname} §e황금열쇠§f[§6${goldEvent[event]}§f]`);
    runCommand(`execute @a ~~~ playsound random.enderchestopen @s ~~~ 1 1.5`);
    if (event == 0) {
        runCommand(`scoreboard players set prison${turnnum} marble -2`);
        runCommand(`title @a subtitle 다음 감옥을 면제합니다.`);
    }
    if (event == 1) {
        tpkan = 24;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 즉시 포탈로 이동합니다.`);
    }
    if (event == 2) {
        tpkan = 16;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 핫플레이스! 축제를 바로 개최합니다.`);
    }
    if (event == 3) {
        tpkan = 8;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 죄를 지어 감옥으로 체포합니다.`);
    }
    if (event == 4) {
        tpkan = 0;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 보너스! 월급을 1번 더 받습니다.`);
    }
    if (event == 5) {
        tpkan = 4;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 도박의 맛을 잊지 못해 다시 도박으로 이동합니다.`);
    }
    if (event == 6) {
        tpkan = 31;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 불운이 찾아와 세금을 더 내도록 만듭니다.`);
    }
    if (event == 7) {
        let tpadd = Math.floor(Math.random() * 32);
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`title @a subtitle 랜덤 땅으로 이동합니다.`);
    }
    if (event == 8) {
        runCommand(`title @a subtitle 다음 상대방의 땅에서 통행료를 내지 않습니다.`);
        runCommand(`scoreboard players add tonghang${turnnum} marble 1`);
    }
    if (event == 9) {
        const random = Math.floor(Math.random()*getScore('players','marble')-1)
        let kan2 = getScore(`marblekan${random}`, 'marbleNation');
        tpkan = kan2;
        let tpadd = tpkan > kan ? tpkan - kan : (tpkan + 32) - kan;
        runCommand(`scoreboard players set dices marble ${tpadd + 1}`);
        runCommand(`execute @e[name=marblekan${kan}] ~~~ tp @e[name=marblemal${random}] ~~4~`);
        runCommand(`scoreboard players set marblekan${random} marbleNation ${kan}`);
        runCommand(`titleraw @a subtitle {"rawtext":[{"text":"랜덤한 플레이어와 자리를 교체합니다.\n${playerColor[turnnum - 1]}"},{"selector":"@a[tag=marble${turnnum}P]"},{"text":"§f <-> ${playerColor[random - 1]}"},{"selector":"@a[tag=marble${random}P]"}]}`);
    }
}
