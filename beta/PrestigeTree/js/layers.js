addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#30A008",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        
        if(hasUpgrade("p2", 11)) mult = mult.mul(upgradeEffect("p2", 11));
        if(hasUpgrade("p2", 21)) mult = mult.mul(upgradeEffect("p2", 21));
        
        if(hasUpgrade("p3", 11)) mult = mult.mul(upgradeEffect("p3", 11));
        
        mult = mult.mul(layers["m"].effect().pow(0.5));
        
        mult = mult.mul(layers["b"].effect())

        let pow = new Decimal(1);
        
        let total = mult.pow(pow);
        
        if(inChallenge("p2", 12)) total = total.pow(0.1);
        
        
        return total
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){
        let gen = new Decimal(0);
        
        if(hasUpgrade("p2", 24)) gen = gen.add(upgradeEffect("p2", 24));
        
        if(hasMilestone("b", 1)) gen = gen.add(new Decimal(0.2))

        return gen
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11: {
            description: "Multiply Point gain by 1.5",
            cost: new Decimal(1),
            effect(){
                effect = new Decimal(1.5);
                
                if(hasUpgrade(this.layer, 21)) effect = effect.pow(upgradeEffect(this.layer, 21));
                
                if(hasUpgrade("p2", 22)) effect = effect.pow(upgradeEffect("p2", 22));
                
                return effect; 
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        12: {
            description: "Multiply Point gain by 2",
            cost: new Decimal(2),
            effect(){
                effect = new Decimal(2);
                
                if(hasUpgrade(this.layer, 22)) effect = effect.pow(upgradeEffect(this.layer, 22));
                
                if(hasUpgrade("p2", 22)) effect = effect.pow(upgradeEffect("p2", 22));
                
                return effect;
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        13: {
            description: "Multiply Point gain by 5",
            cost: new Decimal(5),
            effect(){
                effect = new Decimal(5);   
                
                if(hasUpgrade(this.layer, 23)) effect = effect.pow(upgradeEffect(this.layer, 23));
                
                if(hasUpgrade("p2", 22)) effect = effect.pow(upgradeEffect("p2", 22));
                
                return effect;
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        14: {
            description: "Multiply Point gain by log10(points)",
            cost: new Decimal(20),
            effect(){
                effect = Decimal.log(player.points.add(1), new Decimal(10)).add(1);   
                
                if(hasUpgrade(this.layer, 24)) effect = effect.pow(upgradeEffect(this.layer, 24));
                
                if(hasUpgrade("p2", 22)) effect = effect.pow(upgradeEffect("p2", 22));
                
                return effect;
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        15: {
            description: "Multiply Point gain by log10(prestige points), and unlock the next row of upgrades",
            cost: new Decimal(50),
            effect(){
                effect = Decimal.log(player[this.layer].points.add(1), new Decimal(10)).add(1);   
                
                if(hasUpgrade(this.layer, 25)) effect = effect.pow(upgradeEffect(this.layer, 25));
                
                if(hasUpgrade("p2", 22)) effect = effect.pow(upgradeEffect("p2", 22));
                
                return effect;
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        21: {
            description: "Square Effect of Above Upgrade",
            cost: new Decimal(100),
            effect(){
                let effect = new Decimal(2); 
                return effect
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15);   
            }
        },
        22: {
            description: "Square Effect of Above Upgrade",
            cost: new Decimal(150),
            effect(){
                let effect = new Decimal(2); 
                if(hasUpgrade(this.layer, 32)) effect = effect.add(upgradeEffect(this.layer, 32));
                return effect  
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15);   
            }
        },
        23: {
            description: "Square Effect of Above Upgrade",
            cost: new Decimal(400),
            effect(){
                let effect = new Decimal(2); 
                if(hasUpgrade(this.layer, 33)) effect = effect.add(upgradeEffect(this.layer, 33));
                return effect
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15);   
            }
        },
        24: {
            description: "Square Effect of Above Upgrade",
            cost: new Decimal(10000),
            effect(){
                let effect = new Decimal(2); 
                if(hasUpgrade(this.layer, 34)) effect = effect.add(upgradeEffect(this.layer, 34));
                return effect
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15);   
            }
        },
        25: {
            description: "Square Effect of Above Upgrade",
            cost: new Decimal(250000),
            effect(){
                let effect = new Decimal(2); 
                if(hasUpgrade(this.layer, 35)) effect = effect.add(upgradeEffect(this.layer, 35));
                return effect  
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15);   
            }
        },
        31: {
            description: "Multiply Point gain by 1.05 for every upgrade purchased across all menus.",
            cost: new Decimal("1e9"),
            effect(){
                let numUpgrades = new Decimal(0);

                for(const key of LAYERS){
                    numUpgrades = numUpgrades.add(player[key].upgrades.length)
                }

                let effect = new Decimal(1.05).pow(numUpgrades)
                
                return effect;
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade("p3", 12) && hasUpgrade("p", 15);   
            }
        },
        32: {
            description: "Above upgrade effect +log10(log10(points))",
            cost: new Decimal("1e10"),
            effect(){
                let effect = Decimal.log(Decimal.log(player.points.add(1), 10).add(1), 10);
                
                return effect;
            },
            effectDisplay(){
                return "+" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade("p3", 12) && hasUpgrade("p", 15);   
            }
        },
        33: {
            description: "Above upgrade effect +log10(log10(points))",
            cost: new Decimal("1e11"),
            effect(){
                let effect = Decimal.log(Decimal.log(player.points.add(1), 10).add(1), 10);
                
                return effect;
            },
            effectDisplay(){
                return "+" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade("p3", 12) && hasUpgrade("p", 15);   
            }
        },
        34: {
            description: "Above upgrade effect +log10(log10(points))",
            cost: new Decimal("1e15"),
            effect(){
                let effect = Decimal.log(Decimal.log(player.points.add(1), 10).add(1), 10);
                
                return effect;
            },
            effectDisplay(){
                return "+" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade("p3", 12) && hasUpgrade("p", 15);   
            }
        },
        35: {
            description: "Above upgrade effect +log10(log10(points))",
            cost: new Decimal("1e20"),
            effect(){
                let effect = Decimal.log(Decimal.log(player.points.add(1), 10).add(1), 10);
                
                return effect;
            },
            effectDisplay(){
                return "+" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade("p3", 12) && hasUpgrade("p", 15);   
            }
        }
    },
    layerShown(){return true},
    doReset(resettingLayer){
        if(layers[resettingLayer].row <= layers[this.layer].row){
            return;
        }
        var savingupgradeids = []
        if(hasUpgrade("p2", 15)){
            savingupgradeids.push(11);
            savingupgradeids.push(12);
            savingupgradeids.push(13);
            savingupgradeids.push(14);
            savingupgradeids.push(15);
        }
        
        if(hasUpgrade("p2", 22)){
            savingupgradeids.push(21);
            savingupgradeids.push(22);
            savingupgradeids.push(23);
        }
        
        if(hasUpgrade("p2", 25)){
            savingupgradeids.push(24);
            savingupgradeids.push(25);
        }
        
        
        var prevupgrades = player[this.layer].upgrades;
        
        layerDataReset(this.layer, [])
        
        for(const id of savingupgradeids){
            if(prevupgrades.includes(id)){
                player[this.layer].upgrades.push(id);
            }
        }
    },
    autoUpgrade(){
        return hasMilestone("b", 4)
    }
})

addLayer("p2", {
    name: "prestige 2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#444444",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "prestige 2 points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player["p"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        if(hasUpgrade(this.layer, 14)) mult = mult.mul(upgradeEffect(this.layer, 14))
        if(hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21))
        
        if(hasUpgrade("p3", 11)) mult = mult.mul(upgradeEffect("p3", 11));

        mult = mult.mul(layers["b"].effect())
        mult = mult.mul(layers["b"].effect())

        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){
        let gen = new Decimal(0)

        return gen;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["p"],
    upgrades: {
        11: {
            description: "Double Point gain and Prestige Point gain",
            cost: new Decimal(1),
            effect(){
                return new Decimal(2);   
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        12: {
            description: "Multiply Point Gain by log10(time played)",
            cost: new Decimal(3),
            effect(){
                let effect = Decimal.log(new Decimal(player.timePlayed).add(1), new Decimal(10)).add(1);

                if(hasUpgrade("p3", 16)) effect = effect.pow(upgradeEffect("p3", 16))

                return effect
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        13: {
            description: "Raise this layer's effect ^5",
            cost: new Decimal(5),
            effect(){
                return new Decimal(5);   
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        14: {
            description: "Multiply Prestige 2 Point gain by 1.2, and unlock the first challenge",
            cost: new Decimal(10),
            effect(){
                return new Decimal(1.2);   
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id))   
            }
        },
        15: {
            description: "Keep the first 5 prestige upgrades on reset.  Also Make Multiplication Points 10x cheaper.  Also unlock the next row of upgrades.", 
            cost: new Decimal(15),
            effect(){
                return new Decimal(10)   
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))   
            }
        },
        21: {
            description: "Double Point Gain, Prestige Point Gain and Prestige 2 Point Gain",
            cost: new Decimal(40),
            effect(){
                return new Decimal(2)   
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15)   
            }
        },
        22: {
            description: "All first row Prestige upgrades are raised ^1.3.  Also keep the next 3 prestige upgrades.",
            cost: new Decimal(100),
            effect(){
                return new Decimal(1.3)   
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id))   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15)   
            }
        },
        23: {
            description: "Multiply Point Gain by log10(Prestige 2 Points).  Also unlock two Multiplication Upgrades.",
            cost: new Decimal(300),
            effect(){
                return Decimal.log(player[this.layer].points.add(1), new Decimal(10)).add(1); 
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id))   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15)   
            }
        },
        24: {
            description: "Gain 10% of Prestige points on reset per second.  Also unlock challenge 2.",
            cost: new Decimal(500),
            effect(){
                return new Decimal(0.1); 
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id) * 100) + "%/s"   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15)   
            }
        },
        25: {
            description: "Point gain is raised ^1.1.  Also keep the next 2 prestige upgrades on reset.",
            cost: new Decimal(25000),
            effect(){
                return new Decimal(1.1);   
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id))   
            },
            unlocked(){
                return hasUpgrade(this.layer, 15)   
            }
        }
    },
    challenges: {
        11: {
            name: "Challenge 1",
            challengeDescription: "Point gain is raised ^0.1",
            goalDescription(){
                return "Reach " + format(layers[this.layer].challenges[this.id].goal()) + " points";
            },
            goal(){
                let goal = new Decimal(50).mul(new Decimal(4).pow(new Decimal(challengeCompletions(this.layer, this.id))));
                goal = goal.div(layers["p3"].effect());
                return goal
            },
            canComplete(){
                return player.points.gte(layers[this.layer].challenges[this.id].goal())
            },
            rewardDescription()
            {
                return  "Multiply point gain by 2 for each completion.  Completions: " + format(challengeCompletions(this.layer, this.id)) + "/" + format(this.completionLimit)
            },
            rewardEffect(){
                pointEffect = new Decimal(2).pow(challengeCompletions(this.layer, this.id));
                return pointEffect
            },
            rewardDisplay(){
                return "Point gain x" + format(challengeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade(this.layer, 14);   
            },
            completionLimit: 100,
        },
        12: {
            name: "Challenge 2",
            challengeDescription: "Prestige Point gain is raised ^0.1, Point gain is raised ^0.25, you can't keep prestige upgrades",
            goalDescription(){
                return "Reach " + format(layers[this.layer].challenges[this.id].goal()) + " points";
            },
            goal(){
                let goal = new Decimal(500).mul(new Decimal(10).pow(new Decimal(challengeCompletions(this.layer, this.id))));
                goal = goal.div(layers["p3"].effect());
                return goal
            },
            canComplete(){
                return player.points.gte(layers[this.layer].challenges[this.id].goal())
            },
            rewardDescription(){
                return  "Multiply prestige point gain by 1.5 for each completion.  Completions: " + format(challengeCompletions(this.layer, this.id)) + "/" + format(this.completionLimit)   
            },
            rewardEffect(){
                let effect = new Decimal(1.5).pow(challengeCompletions(this.layer, this.id))
                return effect
            },
            rewardDisplay(){
                return "Prestige Point gain x"+format(challengeEffect(this.layer, this.id))   
            },
            unlocked(){
                return hasUpgrade(this.layer, 24)   
            },
            completionLimit: 100,
            onEnter(){
                layerDataReset("p", [])   
            }
        }
    },
    layerShown(){return true},
    effect(){
        effect = Decimal.log(player[this.layer].points.add(1), new Decimal(10)).add(1).pow(0.5);
        
        if(hasUpgrade(this.layer, 13)) effect = effect.pow(upgradeEffect(this.layer, 13));
        
        return effect;
    },
    effectDescription(){
        return "Multiplying point gain by " + format(layers[this.layer].effect());
    },
    doReset(resettingLayer){
        if(layers[resettingLayer].row <= layers[this.layer].row){
            return;
        }
        var savingupgradeids = []
        if(hasMilestone("b", 0)){
            savingupgradeids.push(11);
            savingupgradeids.push(12);
        }
        if(hasUpgrade("p3", 13)){
            savingupgradeids.push(13)   
        }
        if(hasUpgrade("p3", 14)){
            savingupgradeids.push(14)   
        }
        if(hasUpgrade("p3", 21)){
            savingupgradeids.push(15)
        }
        
        
        var prevupgrades = player[this.layer].upgrades;
        
        var keep = []
        if(hasMilestone("b", 3)) keep.push("challenges")

        layerDataReset(this.layer, keep)
        
        for(const id of savingupgradeids){
            if(prevupgrades.includes(id)){
                player[this.layer].upgrades.push(id);
            }
        }
    }
})

addLayer("m", {
    name: "multipliers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#DDDD00",
    requires: new Decimal("5e3"), // Can be a function that takes requirement increases into account
    resource: "Multiplication Points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player["p"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        if(hasUpgrade("p2", 15)) mult = mult.div(upgradeEffect("p2", 15))
        
        if(hasUpgrade(this.layer, 11)) mult=mult.div(upgradeEffect(this.layer, 11));
        if(hasUpgrade(this.layer, 11)) mult=mult.div(upgradeEffect(this.layer, 12));
        
        if(hasUpgrade("p3", 13)) mult = mult.div(upgradeEffect("p3", 13));
        if(hasUpgrade("p3", 16)) mult = mult.div(upgradeEffect("p3", 16));
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["p"],
    upgrades: {
        11: {
            description: "Multiplication Point cost is divided by log10(points)",
            cost: new Decimal(5),
            effect(){
                return Decimal.log(player.points.add(1), new Decimal(10)).add(1)
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade("p2", 23)   
            }
        },
        12: {
            description: "Multiplication Point cost is divided by log10(prestige points)",
            cost: new Decimal(7),
            effect(){
                return Decimal.log(player["p"].points.add(1), new Decimal(10)).add(1)
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade("p2", 23)   
            }
        },
        21: {
            description: "Boost Juice Multiplier also divides Multiplication Point cost",
            cost: new Decimal(10),
            effect(){
                return layers["b"].effect()
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade("p3", 24)
            }
        },
        22: {
            description: "Divide Multiplication Point cost by Multiplication Points",
            cost: new Decimal(12),
            effect(){
                return player["m"].points.add(1)
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade("p3", 24)
            }
        },
        23: {
            description: "Divide Multiplication Point cost by the single Multiplication Point Multiplier ^ 3",
            cost: new Decimal(15),
            effect(){
                return layers[this.layer].multiplicationPointEffect().pow(new Decimal(3))
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade("p3", 24)
            }
        }
    },
    layerShown(){return true},
    effect(){
        effect = layers[this.layer].multiplicationPointEffect().pow(player[this.layer].points);
        return effect;
    },
    effectDescription(){
        return "Multiplying point gain by " + format(layers[this.layer].effect()) + ".  Also multiplying prestige point gain by " + format(layers[this.layer].effect().pow(0.5)) + 
        ". <br> Each multiplication point multiplies by " + format(layers[this.layer].multiplicationPointEffect());
    },
    canBuyMax(){
        return true;   
    },
    multiplicationPointEffect(){
        let effect = new Decimal(1.25);

        effect = effect.add(buyableEffect("d", 11))

        return effect;
    },
    autoPrestige(){
        return hasMilestone("b", 2)
    },
    autoUpgrade(){
        return hasMilestone("b", 5)
    },
    resetsNothing(){
        return hasMilestone("b", 6)
    }
})

addLayer("p3", {
    name: "prestige  3 points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#666666",
    requires: new Decimal("3e3"), // Can be a function that takes requirement increases into account
    resource: "Prestige 3 Points", // Name of prestige currency
    baseResource: "prestige 2 points", // Name of resource prestige is based on
    baseAmount() {return player["p2"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.125, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        if(hasUpgrade(this.layer, 25)) mult = mult.mul(upgradeEffect(this.layer, 25))
        if(hasUpgrade(this.layer, 14)) mult = mult.mul(upgradeEffect(this.layer, 14))

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ["p2", "m"],
    upgrades: {
        11: {
            description: "Double Point gain, Prestige Point gain and prestige 2 point gain",
            cost: new Decimal(1),
            effect(){
                return new Decimal(2);   
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));   
            }
        },
        12: {
            description: "Unlock the third row of prestige upgrades.",
            cost: new Decimal(2)
        },
        13: {
            description: "Multiplication point cost is divided by " + format(new Decimal(1000)) + ".  Also keep the third prestige 2 upgrade on reset.",
            cost: new Decimal(10),
            effect(){
                return new Decimal(1000)   
            },
            effectDisplay(){
                return "/" + format(upgradeEffect(this.layer, this.id))   
            }
        },
        14:{
            description: "Prestige 3 Point gain is multiplied by log10(prestige 3 points)",
            cost: new Decimal(15),
            effect(){
                return Decimal.log(player[this.layer].points.add(1), 10).add(1)
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        15: {
            description: "Point gain is raised ^ log10(log10(log10(prestige 3 points))).  Also keep the fourth prestige 2 upgrade on reset.",
            cost: new Decimal(25),
            effect(){
                let effect = Decimal.log(Decimal.log(Decimal.log(player[this.layer].points.add(1), 10).add(1), 10).add(1), 10).add(1)
                return effect
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id))   
            }
        },
        16: {
            description: "Square the effect of the second Prestige 2 upgrade, divide multiplier cost by 2 and unlock the next row of upgrades.",
            cost: new Decimal(100),
            effect(){
                return new Decimal(2);
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id)) + ",<br> /" + format(upgradeEffect(this.layer, this.id)) 
            }
        },
        21: {
            description: "Triple duck feather gain, keep the fifth prestige 2 upgrade on reset",
            cost: new Decimal(500),
            effect(){
                return new Decimal(3);
            },
            effectDisplay(){
                return "x" + format(upgradeEffect(this.layer, this.id));
            },
            unlocked(){
                return hasUpgrade(this.layer, 16);
            }
        },
        22: {
            description: "Raise point gain ^1.1",
            cost: new Decimal(1000),
            effect(){
                return new Decimal(1.1)
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade(this.layer, 16)
            }
        },
        23: {
            description: "Boost Juice softcap is based on Boosters ^2 instead of Boosters ^1",
            cost: new Decimal(5000),
            effect(){
                return new Decimal(2)
            },
            effectDisplay(){
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade(this.layer, 16)
            }
        },
        24: {
            description: "Unlock 3 More Multiplication Upgrades",
            cost: new Decimal(25000),
            unlocked(){
                return hasUpgrade(this.layer, 16)
            }
        },
        25: {
            description: "Boost Juice Multiplier Applies to Prestige 3 Points with reduced effect (^0.25)",
            cost: new Decimal("5e5"),
            effect(){
                return layers["b"].effect().pow(new Decimal(0.25))
            },
            effectDescription(){
                return "x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked(){
                return hasUpgrade(this.layer, 16)
            }
        }
    },
    layerShown(){return true},
    effect(){
        effect = player[this.layer].points.add(1).pow(2/3);
        return effect;
    },
    effectDescription(){
        return "Dividing Challenge Requirements by " + format(layers[this.layer].effect())
    }
})

addLayer("d", {
    name: "ducks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        duckfeathers: new Decimal(0)
    }},
    color: "#5e3200",
    requires: new Decimal(9), // Can be a function that takes requirement increases into account
    resource: "Ducks", // Name of prestige currency
    baseResource: "multiplication points", // Name of resource prestige is based on
    baseAmount() {return player["m"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 1.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ["m"],
    buyables: {
        11: {
            cost(x){
                let cost = new Decimal(0.01).mul(new Decimal(2).pow(x))

                cost = cost.div(buyableEffect(this.layer, 21))

                return cost
            },
            effect(){
                let effect = new Decimal(0.05).mul(getBuyableAmount(this.layer, this.id));

                return effect
            },
            display(){
                let description = "Adds +0.05 to the multiplication point effect per level"
                let amounttext = "Bought: " + format(getBuyableAmount(this.layer, this.id))
                let costtext = "Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Duck Feathers"
                let effecttext = "Currently: +" + format(buyableEffect(this.layer, this.id))
                
                return description + "<br>" + amounttext + "<br>" + costtext + "<br>" + effecttext
            },
            canAfford(){
                return player[this.layer].duckfeathers.gte(this.cost(getBuyableAmount(this.layer, this.id)))
            },
            buy(){
                player[this.layer].duckfeathers = player[this.layer].duckfeathers.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                addBuyables(this.layer, this.id, 1);
            }
        },
        12: {
            cost(x){
                let cost = new Decimal(0.1).mul(new Decimal(3).pow(x))

                cost = cost.div(buyableEffect(this.layer, 21))

                return cost
            },
            effect(){
                let effect = new Decimal(2).pow(getBuyableAmount(this.layer, this.id))

                return effect
            },
            display(){
                let description = "Divides Multiplication Point cost by 2 per level"
                let amounttext = "Bought: " + format(getBuyableAmount(this.layer, this.id))
                let costtext = "Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Duck Feathers"
                let effecttext = "Currently: /" + format(buyableEffect(this.layer, this.id))

                return description + "<br>" + amounttext + "<br>" + costtext + "<br>" + effecttext
            },
            canAfford(){
                return player[this.layer].duckfeathers.gte(this.cost(getBuyableAmount(this.layer, this.id)))
            },
            buy(){
                player[this.layer].duckfeathers = player[this.layer].duckfeathers.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                addBuyables(this.layer, this.id, 1);
            }
        },
        13: {
            cost(x){
                let cost = new Decimal(0.05).mul(new Decimal(2).pow(x))

                cost = cost.div(buyableEffect(this.layer, 21))

                return cost
            },
            effect(){
                let effect = new Decimal(1).add(new Decimal(0.2).mul(getBuyableAmount(this.layer, this.id)))

                return effect
            },
            display(){
                let description = "Multiplies Duck Feather gain by +0.2x per level"
                let amounttext = "Bought: " + format(getBuyableAmount(this.layer, this.id))
                let costtext = "Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Duck Feathers"
                let effecttext = "Currently: x" + format(buyableEffect(this.layer, this.id))

                return description + "<br>" + amounttext + "<br>" + costtext + "<br>" + effecttext
            },
            canAfford(){
                return player[this.layer].duckfeathers.gte(this.cost(getBuyableAmount(this.layer, this.id)))
            },
            buy(){
                player[this.layer].duckfeathers = player[this.layer].duckfeathers.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                addBuyables(this.layer, this.id, 1);
            }
        },
        21: {
            cost(x){
                let cost = new Decimal(0.1).mul(new Decimal(5).pow(x))

                cost = cost.div(buyableEffect(this.layer, 21))

                return cost
            },
            effect(){
                let effect = new Decimal(1).add(getBuyableAmount(this.layer, this.id))

                return effect
            },
            display(){
                let description = "Divides Buyable Costs by +1 per level"
                let amounttext = "Bought: " + format(getBuyableAmount(this.layer, this.id))
                let costtext = "Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Duck Feathers"
                let effecttext = "Currently: /" + format(buyableEffect(this.layer, this.id))

                return description + "<br>" + amounttext + "<br>" + costtext + "<br>" + effecttext
            },
            canAfford(){
                return player[this.layer].duckfeathers.gte(this.cost(getBuyableAmount(this.layer, this.id)))
            },
            buy(){
                player[this.layer].duckfeathers = player[this.layer].duckfeathers.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                addBuyables(this.layer, this.id, 1);
            }
        }
    },
    layerShown(){return true},
    effect(){
        if(player[this.layer].points.lte(0)) return new Decimal(0)

        effect = new Decimal(3).pow(player[this.layer].points.sub(1)).div(new Decimal(1000));

        if(hasUpgrade("p3", 21)) effect = effect.mul(upgradeEffect("p2", 21))

        effect = effect.mul(buyableEffect(this.layer, 13))

        return effect;
    },
    effectDescription(){
        return "Gaining " + format(layers[this.layer].effect()) + " duck feathers per second. <br> You have " + format(player[this.layer].duckfeathers) + " duck feathers"
    },
    canBuyMax(){
        return false;   
    },
    update(diff){
        player[this.layer].duckfeathers = player[this.layer].duckfeathers.add(layers[this.layer].effect().mul(diff))   
    },
    resetsNothing(){
        return false; //make this a booster milestone   
    }
})

addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        boostJuice: new Decimal(0)
    }},
    color: "#DD8800",
    requires: new Decimal(750), // Can be a function that takes requirement increases into account
    resource: "Boosters", // Name of prestige currency
    baseResource: "prestige 2 points", // Name of resource prestige is based on
    baseAmount() {return player["p2"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 1.1,
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ["p2"],
    milestones: {
        0: {
            requirementDescription: "1 Booster",
            effectDescription: "Keep the first 2 prestige 2 upgrades on reset",
            done(){return player[this.layer].points.gte(1)}
        },
        1: {
            requirementDescription: "2 Boosters",
            effectDescription: "Automatic Prestige Point Gain + 20%",
            done(){return player[this.layer].points.gte(2)},
            unlocked(){
                return (hasUpgrade("p2", 24) && hasMilestone(this.layer, this.id - 1)) || hasMilestone(this.layer, this.id)
            }
        },
        2: {
            requirementDescription: "4 Boosters",
            effectDescription: "Automatically purchase Multiplication Points",
            done(){return player[this.layer].points.gte(4)},
            unlocked(){
                return (player["m"].points.gte(1) && hasMilestone(this.layer, this.id - 1)) || hasMilestone(this.layer, this.id)
            }
        },
        3: {
            requirementDescription: "7 Boosters",
            effectDescription: "Keep prestige 2 Challenge Completions on reset",
            done(){return player[this.layer].points.gte(7)},
            unlocked(){
                return (hasUpgrade("p2", 14) && hasMilestone(this.layer, this.id - 1)) || hasMilestone(this.layer, this.id)
            }
        },
        4: {
            requirementDescription: "11 Boosters",
            effectDescription: "Autobuy Prestige Upgrades",
            done(){return player[this.layer].points.gte(11)},
            unlocked(){
                return hasMilestone(this.layer, this.id - 1);
            }
        },
        5: {
            requirementDescription: "20 Boosters",
            effectDescription: "Automatically purchase Multiplication Upgrades",
            done(){return player[this.layer].points.gte(20)},
            unlocked(){
                return hasMilestone(this.layer, this.id - 1)
            }
        },
        6: {
            requirementDescription: "25 Boosters",
            effectDescription: "Buying Multiplication Points doesn't reset anything",
            done(){return player[this.layer].points.gte(25)},
            unlocked(){
                return hasMilestone(this.layer, this.id - 1)
            }
        }
    },
    layerShown(){return true},
    effect(){
        return layers[this.layer].actualJuice().add(5).div(5).pow(0.3);
    },
    effectDescription(){
        return "Generating " + format(layers[this.layer].juiceGain()) + " Boost Juice / second <br> You have " + format(layers[this.layer].actualJuice()) + " Boost Juice (softcapped past " + format(layers[this.layer].juiceSoftcap()) + ", ^" + format(layers[this.layer].juiceSoftcapPower()) + ")" +
        "<br> Boost Juice is multiplying Point, Prestige Point, and Prestige 2 Point gain by " + format(layers[this.layer].effect())
    },
    juiceSoftcap(){
        let effectivepoints = player[this.layer].points

        if(hasUpgrade("p3", 23)) effectivepoints = effectivepoints.pow(upgradeEffect("p3", 23))

        return new Decimal(10).mul(effectivepoints)
    },
    juiceSoftcapPower(){
        return new Decimal(1/3)
    },
    juiceGain(){
        effect = player[this.layer].points.pow(0.5).div(4)

        return effect;
    },
    actualJuice(){
        let juice = player[this.layer].boostJuice;

        if(juice.gt(layers[this.layer].juiceSoftcap())){
            juice = juice.div(layers[this.layer].juiceSoftcap()).pow(layers[this.layer].juiceSoftcapPower()).mul(layers[this.layer].juiceSoftcap())
        }

        return juice
    },
    update(diff){
        player[this.layer].boostJuice = player[this.layer].boostJuice.add(layers[this.layer].juiceGain().mul(diff))
    }
})