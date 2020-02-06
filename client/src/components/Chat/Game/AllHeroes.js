const ninja = {
    card1: {src:'./icons/ninja/card1.png',text1: "Ninja", text2:"HP 3" , hp:3},
    card2: {src:'./icons/ninja/card2.png',text1: "Curative Herbs", text2:"HP 3", hp:3, conditions:[]},
    card3: {src:'./icons/ninja/card3.png',text1: "Weird Concoction", text2:"HP 5", hp:5, conditions:[]},
    card4: {src:'./icons/ninja/card4.png',text1: "Smoke Bomb", text2:"Defeat one Monster, then discard a different equipment tile." , conditions:["kill-discard","any", "discard"]},
    card5: {src:'./icons/ninja/card5.png',text1: "Wooden Shuriken", text2:"Defeat Vampires", conditions:["kill-keep", "Vampire"]},
    card6: {src:'./icons/ninja/card6.png',text1: "Ninjato", text2:"Defeat Monsters with strength 7 or greater", conditions:["kill-keep", "greater", "6"]},
    card7: {src:'./icons/ninja/card7.png',text1: "Shinobi Gear", text2:"If your HP is less than 5, defeat Monsters with strength 1,3 and 5.", conditions:["kill-keep","hp", 5, [1,3,5]]}
}

const bard = {
    card1: {src:'./icons/bard/card1.png',text1: "Bard", text2:"HP 3", hp:3},
    card2: {src:'./icons/bard/card2.png',text1: "Glamorous Tunic", text2:"HP 5", hp:5},
    card3: {src:'./icons/bard/card3.png',text1: "Fancy hat", text2:"HP 2", hp:2},
    card4: {src:'./icons/bard/card4.png',text1: "Lucky Coin", text2:"Defeat an even-strength Monster. If the next Monster is even, repeat the process", conditions:["kill-discard", "repeat", "even"]},
    card5: {src:'./icons/bard/card5.png',text1: "Elvish Harp", text2:"If your Hp is less than 5, odd-strength Monsters deal 1 damage and even-strength Monsters deal 2", conditions:["reduce-damage", "Goblin"]},
    card6: {src:'./icons/bard/card6.png',text1: "Charming Flute", text2:"Defeat Goblins. For each defeated this way, reduce all damage by 1", conditions:["kill-keep", "reduce" ,"Goblin", 1]},
    card7: {src:'./icons/bard/card7.png',text1: "Dancing blade", text2:"Defeat one odd-strength Monster", conditions:["kill-discard","odd"]},
}

const warrior = {
    card1: {src:'./icons/warrior/card1.png',text1: "Warrior", text2:"HP 3", hp:3},
    card2: {src:'./icons/warrior/card2.png',text1: "Plate Armor", text2:"HP 5", hp:5},
    card3: {src:'./icons/warrior/card3.png',text1: "Knight Shield", text2:"HP 3", hp:3},
    card4: {src:'./icons/warrior/card4.png',text1: "Torch", text2:"Defeat monsters with strength 3 or less", conditions:["kill-keep","less" ,"4"]},
    card5: {src:'./icons/warrior/card5.png',text1: "Dragon Spear", text2:"Defeat the dragon", conditions:["kill-discard","Dragon"]},
    card6: {src:'./icons/warrior/card6.png',text1: "Holy Grail", text2:"Defeat Monsters with even-numbered strength", conditions:["kill-keep", "even"]},
    card7: {src:'./icons/warrior/card7.png',text1: "Vorpal Sword", text2:"Defeat Monsters that you choose before entering the dungeon", conditions:["kill-choose","keep","before"]},
}

const mage = {
    card1: {src:'./icons/mage/card1.png',text1: "Mage", text2:"HP 2", hp:2},
    card2: {src:'./icons/mage/card2.png',text1: "Wall of Fire", text2:"HP 6", hp:6},
    card3: {src:'./icons/mage/card3.png',text1: "Bracelet of Protection", text2:"HP 3", hp:3},
    card4: {src:'./icons/mage/card4.png',text1: "Holy Grail", text2:"Defeat Monsters with even-numbered strength", conditions:["kill-keep", "even"]},
    card5: {src:'./icons/mage/card5.png',text1: "Polymorph", text2:"Defeat one Monster you draw, replacing it with the next Monster from the deck (once per Dungeon)", conditions:["switch-monster", "Goblin"]},
    card6: {src:'./icons/mage/card6.png',text1: "Demonic Pact", text2:"Defeat the Demon and the next Monster", conditions:["kill-discard","Demon","next"]},
    card7: {src:'./icons/mage/card7.png',text1: "Omnipotence", text2:"If all the Monsters in the Dungeon are different, you win the round", conditions:["after-death","unique-monsters"]},
}

const barbarian = {
    card1: {src:'./icons/barbarian/card1.png',text1: "Barbarian", text2:"HP 4", hp:4},
    card2: {src:'./icons/barbarian/card2.png',text1: "Chainmail", text2:"HP 4", hp:4},
    card3: {src:'./icons/barbarian/card3.png',text1: "Leather shield", text2:"HP 3", hp:3},
    card4: {src:'./icons/barbarian/card4.png',text1: "Vorpal Axe", text2:" Defat one Monster after you draw it", conditions:["kill-choose", "keep","after"]},
    card5: {src:'./icons/barbarian/card5.png',text1: "war Hammer", text2:"Defeat golems", conditions:["kill-keep", "Golem"]},
    card6: {src:'./icons/barbarian/card6.png',text1: "Torch ", text2:" Defeat monsters with strength 3 or less", conditions:["kill-keep", "less", "4"]},
    card7: {src:'./icons/barbarian/card7.png',text1: "Healing Potion", text2:"When you die, come back to life with your Adventurer's HP", conditions:["after-death","resurrect"]},
}

const rogue = {
    card1: {src:'./icons/rogue/card1.png',text1: "Rogue", text2:"HP 3", hp:3},
    card2: {src:'./icons/rogue/card2.png',text1: "Mithril Armor", text2:"HP 5", hp:5},
    card3: {src:'./icons/rogue/card3.png',text1: "Buckler", text2:"HP 3", hp:3},
    card4: {src:'./icons/rogue/card4.png',text1: "Invisibility Cloak", text2:"Defeat Monsters with strength 6 or more", conditions:["kill-keep", "greater", "5"]},
    card5: {src:'./icons/rogue/card5.png',text1: "Vorpal Dagger", text2: "Defeat Monsters that you choose before entering the dungeon", conditions:["kill-choose", "keep","before"]},
    card6: {src:'./icons/rogue/card6.png',text1: "Healing Potion", text2:"When you die, come back to life with your Adventurer's HP", conditions:["after-death","resurrect"]},
    card7: {src:'./icons/rogue/card7.png',text1: "Ring of Power", text2:"Defeat Monsters with strength 2 or less. Add their total strength to your hp", conditions:["kill-keep", "add", 3]},
}


const heroes = [ninja, bard, warrior, mage, barbarian, rogue]

module.exports = {heroes}