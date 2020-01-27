const ninja = {
    card1: {text1: "Ninja", "text2":"HP 3"},
    card2: {text1: "Curative Herbs", "text2":"HP 3"},
    card3: {text1: "Weird Concoction", "text2":"HP 5"},
    card4: {text1: "Smoke Bomb", "text2":"Defeat one Monster, thne discard a different equipment tile."},
    card5: {text1: "Wooden Shuriken", "text2":"Defeat Vampires"},
    card6: {text1: "Ninjato", "text2":"Defeat Monsters with strength 7 or greater"},
    card7: {text1: "Shinobi Gear", "text2":"If your HP is less than 5, defeat Monsters with strength 1,3 and 5."},
}

const bard = {
    card1: {text1: "Bard", "text2":"HP 3"},
    card2: {text1: "Glamorous Tunic", "text2":"HP 5"},
    card3: {text1: "Fancy hat", "text2":"HP 2"},
    card4: {text1: "Lucky Coin", "text2":"Defeat an even-strength Monster. If the next Monster is even, repeat the process"},
    card5: {text1: "Elvish Harp", "text2":"If your Hp is less than 5, odd-strength Monsters deal 1 damage and even-strength Monsters deal 2"},
    card6: {text1: "Charming Flute", "text2":"Defeat Goblins. For each defeated this way, reduce all damage by 1"},
    card7: {text1: "Dancing blade", "text2":"Defeat one odd-strength Monster"},
}

const princess = {
    card1: {text1: "Princess", "text2":"HP 2"},
    card2: {text1: "Mr. Charm", "text2":"HP 5"},
    card3: {text1: "Chaperon", "text2":"HP 3"},
    card4: {text1: "Greatsword", "text2":"Before entering the dungeon, another player chooses a Monster with strength 5 6 or 7 which you then defeat"},
    card5: {text1: "Dragon Leash", "text2":"Defeat the dragon and the next Monster"},
    card6: {text1: "Family Crown", "text2":"Reduce all damage by 2"},
    card7: {text1: "Royal Scepter", "text2":"Defeat the second Monster of each kind"},
}

const warrior = {
    card1: {text1: "Warrior", "text2":"HP 3"},
    card2: {text1: "Plate Armor", "text2":"HP 5"},
    card3: {text1: "Knight Shield", "text2":"HP 3"},
    card4: {text1: "Torch", "text2":"Defeat monsters with strength 3 or less"},
    card5: {text1: "Dragon Spear", "text2":"Defeat the dragon"},
    card6: {text1: "Holy Grail", "text2":"Defeat Monsters with even-numbered strength"},
    card7: {text1: "Vorpal Sword", "text2":"Defeat one Monster that you choose before entering the dungeon"},
}

const mage = {
    card1: {text1: "Mage", "text2":"HP 2"},
    card2: {text1: "Wall of Fire", "text2":"HP 6"},
    card3: {text1: "Bracelet of Protection", "text2":"HP 3"},
    card4: {text1: "Holy Grail", "text2":"Defeat Monsters with even-numbered strength"},
    card5: {text1: "Polymorph", "text2":"Defeat one Monster you draw, replacing it with the next Monster from the deck (once per Dungeon)"},
    card6: {text1: "Demonic Pact", "text2":"Defeat the Demon and the next Monster"},
    card7: {text1: "Omnipotence", "text2":"If all the Monsters in the Dungeon are different, you win the round"},
}

const barbarian = {
    card1: {text1: "Barbarian", "text2":"HP 4"},
    card2: {text1: "Chainmail", "text2":"HP 4"},
    card3: {text1: "Leather shield", "text2":"HP 3"},
    card4: {text1: "Vorpal Axe", "text2":"Defat one Monster after you draw it (once per dungeon)"},
    card5: {text1: "war Hammer", "text2":"Defeat golems"},
    card6: {text1: "Torch ", "text2":" Defeat monsters with strength 3 or less"},
    card7: {text1: "Healing Potion", "text2":"When you die, come back to life with your Adventurer's HP (once per dungeon)"},
}

const rogue = {
    card1: {text1: "Rogue", "text2":"HP 3"},
    card2: {text1: "Mithril Armor", "text2":"HP 5"},
    card3: {text1: "Buckler", "text2":"HP 3"},
    card4: {text1: "Invisibility Cloak", "text2":"Defeat Monsters with strength 6 or more"},
    card5: {text1: "Vorpal Dagger", "text2":"Defeat one Monster that you choose before entering the dungeon"},
    card6: {text1: "Healing Potion", "text2":"When you die, come back to life with your Adventurer's HP"},
    card7: {text1: "Ring of Power", "text2":"Defeat Monsters with strength 2 or less. Add their total strength to your hp"},
}




const heroes = [ninja, bard, princess, warrior, mage, barbarian, rogue]

module.exports = {heroes}