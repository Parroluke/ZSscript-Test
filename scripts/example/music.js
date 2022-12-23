
const blocks = { 
    'minecraft:planks':'bass',
    'minecraft:sand':'snare',
    'minecraft:soul_soil':'snare',
    'minecraft:glass':'hat',
    'minecraft:stained_glass':'hat',
    'minecraft:stone':'bd',  
    'minecraft:gold_block':'bell',
    'minecraft:clay':'flute',
    'minecraft:packed_ice':'chime',
    'minecraft:wool':'guitar',
    'minecraft:bone_block':'xylophone',
    'minecraft:iron_block':'iron_xylophone',
    'minecraft:soul_sand':'cow_bell',
    'minecraft:pumpkin':'didgeridoo',
    'minecraft:emerald_block':'bit',
    'minecraft:hay_block':'banjo', 
    'minecraft:glowstone':'pling', 
    'minecraft:honey_block':'harp' 
  };
  
const pitch = [ 
    0.5,     
    0.529732,     
    0.561231,     
    0.594604,     
    0.629961,     
    0.667420,     
    0.707107,     
    0.749154,     
    0.793701,     
    0.840896,     
    0.890899,     
    0.943874,     
    1,     
    1.059463,     
    1.122462,     
    1.189207,     
    1.259921,     
    1.334840,     
    1.414214,     
    1.498307,     
    1.587401,     
    1.681793,     
    1.781797,     
    1.887749,     
    2 
  ];

world.events.tick.subscribe(({currentTick})=>{
    if(getScore("music","play")==1) {
        world.getDimension('overworld').runCommand('title @a actionbar on')
        world.getDimension('overworld').runCommand(`scoreboard players set play music 0`)
        let q = new EntityQueryOptions();
        q.tags = ["music"];
        q.type = "minecraft:armor_stand";
        const musicCart = [...world.getDimension('overworld').getEntities(q)][0];
        const { x, y, z } = musicCart.location
        let musicBlock = [];
        
        for (let i = 1; i<=25; i++) {
            let v = 0;
            while (world.getDimension("overworld").getBlock(new BlockLocation(x+i,y+v,z)).id!=="minecraft:air") {
                const bl = world.getDimension("overworld").getBlock(new BlockLocation(x+i,y+v,z))
                if(bl.id!="minecraft:air") musicBlock.push( {"block":bl.id, "pitch":i} );
                v++;
            }
        }
    
        musicBlock.forEach(bl => {
            world.getDimension('overworld').runCommand(`execute @a ~~~ playsound note.${blocks[bl.block]} @s ~~~ 1 ${pitch[bl.pitch]}`)
        })
        //musicCart.teleport(new Location(x,y,z+1))
    }
    
      
})

