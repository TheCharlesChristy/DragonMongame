const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576
var run = false
var player
var opponent
var type
socket.emit("Finalise", username)
socket.emit("Getbattledata")
function Goback(){
    socket.emit("GoBack")
}
  
socket.on("ToGame", (message) =>{
    let playerid = message.PID
    location.href = "https://dragonmongame.com/Game?data="+ playerid
})
class bg{
    constructor(){
        this.image = new Image()
        this.image.src = "static/Assets/battleBackground.png"
    }
    update(){
        c.drawImage(this.image, 0,0,1024,576,0,0,1024,576)
    }
}
class teamcount{
    constructor(position){
        this.position = position
        this.image = new Image()
        this.image.src = "static/Assets/capsule.png"
    }
    update(teamlength){
        let swidth = 630*teamlength
        let width = 40*teamlength
        c.drawImage(this.image, 0,0, swidth,630,this.position.x,this.position.y,width,40)
    }
}
//Characters = [char1, char2...]
//charx = 
class Player{
    constructor(Characters){
        this.Characterpointer = 0
        this.Characters=[]
        for(let i =0; i<Characters.length;i++){
            let newchar = new Character(Characters[i])
            this.Characters.push(newchar)
        }
        this.Character = this.Characters[this.Characterpointer]
        this.image = new Image
        this.image.src = "static/Assets/Battle"+this.Characters[this.Characterpointer].name + ".png"
        this.teamcounter = new teamcount({
            x: 10,
            y:180
        })
        this.hpbar = new HealthBar({
            x:10,
            y:145
        })
        this.xpos = 200
    }
    draw(){
        c.drawImage(this.image, 0,0,400,800,this.xpos,canvas.height-450,200,350)
    }
    update(){
        this.draw()
        this.teamcounter.update(this.Characters.length)
        let width = Math.floor(200*(this.Character.hp/this.Character.fullhp))
        this.hpbar.draw(width)
    }
    getcurrentmoves(){
        return [this.Character.Move1.name,this.Character.Move2.name,this.Character.Move3.name,this.Character.Move4.name]
    }
    selectmove1(){
        let move = this.Character.Move1
        if(type==2){
            socket.emit("MoveChosen", move)
        }else{
            this.Character.move = move
            opponent.choosemove()
        }
    }
    selectmove2(){
        let move = this.Character.Move2
        if(type==2){
            socket.emit("MoveChosen", move)
        }else{
            this.Character.move = move
            opponent.choosemove()
        }
    }
    selectmove3(){
        let move = this.Character.Move3
        if(type==2){
            socket.emit("MoveChosen", move)
        }else{
            this.Character.move = move
            opponent.choosemove()
        }
    }
    selectmove4(){
        let move = this.Character.Move4
        if(type==2){
            socket.emit("MoveChosen", move)
        }else{
            this.Character.move = move
            opponent.choosemove()
        }

    }
    applyMove(Move){
        let attack = opponent.getCharacterattack()
        console.log(attack)
        this.Character.applyMove(Move, attack)
    }
    getCharacterattack(){
        let attack = this.Character.attack
        console.log(attack)
        return attack
    }
    Nextmember(){
        let temp = []
        for(let i=0;i<this.Characters.length;i++){
            if(i!=this.Characterpointer){
                temp.push(this.Characters[i])
            }
        }
        this.Characters=temp
        if (this.Characters.length>0){
            DisplayTeam()
            if(type==2){
                socket.emit("Characterdied")
            }
            return false
        }
        else{
            return true
        }
    }
    Healthcheck(){
        let check
        if(this.Character.hp<=0){
            check = this.Nextmember()
        }
        else{
            check=false
        }
        console.log("check")
        console.log(check)
        return check
    }
    getCharacters(){
        return this.Characters
    }
    SwitchCharacter(newpointer){
        console.log(this.Characters)
        this.Characterpointer = newpointer
        this.Character = this.Characters[this.Characterpointer]
        this.image.src = "static/Assets/Battle"+this.Characters[this.Characterpointer].name + ".png"
        if(type == 2){
            socket.emit("SwitchCharacters", newpointer)
            socket.emit("MoveChosen", nonemove)
            hideandwait()
        }
    }
    removeself(){
        this.teamcounter.position.x = 1100
        this.hpbar.position.x = 1100
        this.xpos = 1100
    }
}
class Opponent extends Player{
    constructor(Characters, type){
        super(Characters)
        this.image.src = "static/Assets/"+this.Characters[this.Characterpointer].name + ".png"
        this.nextimgsrc = "static/Assets/"+this.Character.name + ".png"
        this.teamcounter = new teamcount({
            x: 400,
            y:40
        })
        this.hpbar = new HealthBar({
            x:400,
            y:5
        })
        this.xpos = canvas.width-250
    }
    draw(){
        c.drawImage(this.image, 0,0,50,100,this.xpos,25,100,200)
    }
    choosemove(){
        let moves = this.Character.Moves
        this.Character.move = moves[Math.floor(Math.random()*4)]
        waiting.innerHTML = "Opponent chose move: " + this.Character.move.name
        applyMoves()
    }
    setMove(move){
        this.Character.move = new Move(move)
    }
    applyMove(Move){
        let attack = player.getCharacterattack()
        if(this.nextimgsrc!=this.image.src){
            this.image.src=this.nextimgsrc
        }
        this.Character.applyMove(Move, attack)
    }
    UpdateTeam(){
        let temp = []
        for(let i=0;i<this.Characters.length;i++){
            if(i!=this.Characterpointer){
                temp.push(this.Characters[i])
            }
        }
        this.Characters=temp
    }
    Healthcheck(){
        let check
        if(this.Character.hp<=0){
            this.UpdateTeam()
            if(this.Characters.length==0){
                check = true
            }else{
                this.SwitchCharacter(this.Characterpointer)
                check = false
            }
        }
        else{
            check=false
        }
        console.log("check")
        console.log(check)
        return check
    }
    SwitchCharacter(newpointer){
        this.Characterpointer = newpointer
        this.Character = this.Characters[this.Characterpointer]
        this.nextimgsrc = "static/Assets/"+this.Character.name + ".png"
        console.log(this.image.src)
    }
}
//name = str, currenthp = int, fullhp = int, attack = int, defence = int, Moves = {Move1data, Move2data, Move3data, Move4data}
class Character{
    constructor(Characterdata){
        this.name = Characterdata.name
        this.hp = Characterdata.hp
        this.fullhp = Characterdata.Fullhp
        this.healamount = 0
        this.attack = Characterdata.Attack
        this.defense = Characterdata.Defense
        this.Moves = Characterdata.moves
        this.move = null
        this.turnhealthchange = 0
        this.Move1 = new Move(this.Moves[0])
        this.Move2 = new Move(this.Moves[1])
        this.Move3 = new Move(this.Moves[2])
        this.Move4 = new Move(this.Moves[3])
    }
    applyMove(Move, opponentattack){
        this.hp+=this.healamount
        if(this.hp>this.fullhp){
            this.hp = this.fullhp
        }
        if (Move.appliedeffect==1){
            this.turnhealthchange += 0.05
        }
        let dmg = Math.floor((this.hp*this.turnhealthchange)+(Move.hpchange*((opponentattack))/this.defense)**2)
        console.log(Move.name)
        console.log(dmg)
        this.hp -= dmg
        if (this.hp<0){
            this.hp = 0
        }
        console.log(this.name, this.hp)
    }
    applymoveeffects(){
        this.attack = this.attack*this.move.attackchange
        this.defense = this.attack*this.move.defensechange
    }
    StoreMove(move){
        this.move = move
    }
    emptymove(){
        this.move = null
    }
}
//Movedata = {name, hpchange, attackchange, defencechange, appliedeffect}
class Move{
    constructor(Movedata){
        this.name = Movedata.name
        this.hpchange = Movedata.hpchange
        this.attackchange = Movedata.attackchange
        this.defensechange = Movedata.defensechange
        this.appliedeffect = Movedata.effect
    }
}

class HealthBar{
    constructor(position){
        this.position = position
        this.baseimg = new Image()
        this.baseimg.src = "static/Assets/BaseBar.png"
        this.hpimg = new Image()
        this.hpimg.src = "static/Assets/Health.png"
    }
    draw(width){
        c.drawImage(this.baseimg, this.position.x, this.position.y)
        c.drawImage(this.hpimg, this.position.x+6, this.position.y+6, width-1, 19)
    }
}

function applyMoves(){
    console.log("player:")
    player.applyMove(opponent.Character.move)
    console.log("opponent:")
    opponent.applyMove(player.Character.move)
    player.Character.applymoveeffects()
    opponent.Character.applymoveeffects()
    player.Character.emptymove()
    opponent.Character.emptymove()
    console.log(type)
    if(type==2){
        gameover = player.Healthcheck()
        console.log("gameover")
        console.log(gameover)
        if(gameover==true){
            socket.emit("noteamleft")
        }else{
            socket.emit("teamleft")
        }
    }else{
        playercheck = player.Healthcheck()
        oppcheck = opponent.Healthcheck()
        if(playercheck&&oppcheck){
            background.image.src = "static/Assets/Draw.png"
            player.removeself()
            opponent.removeself()
            background.update()
            hideandwait()
            waiting.innerHTML = "Press any key to exit"
            document.addEventListener("keydown", function(){
                Goback()
            })
        }else if(playercheck){
            background.image.src = "static/Assets/Lose.png"
            player.removeself()
            opponent.removeself()
            background.update()
            socket.emit("offlinelose")
            hideandwait()
            waiting.innerHTML = "Press any key to exit"
            document.addEventListener("keydown", function(){
                Goback()
            })
        }else if(oppcheck){
            background.image.src = "static/Assets/Win.png"
            player.removeself()
            opponent.removeself()
            background.update()
            socket.emit("offlinewin")
            hideandwait()
            waiting.innerHTML = "Press any key to exit"
            document.addEventListener("keydown", function(){
                Goback()
            })
        }else if(!playercheck&&!oppcheck){
            startbuttons()
        }
    }
}


const background = new bg()
function OfflineBattle(){
    background.update()
    opponent.update()
    player.update()
    window.requestAnimationFrame(OfflineBattle)
}

const nonemove = new Move({
    name: "none",
    hpchange: 0,
    attackchange: 1,
    defensechange: 1,
    effect: 0
})

function LiveBattle(){
    background.update()
    opponent.update()
    player.update()
    window.requestAnimationFrame(LiveBattle)
}

socket.on("Playerbattledata", (message) => {
    let playerteam = message["data"]
    player = new Player(playerteam)
})
socket.on("Opponentbattledata", (message) => {
    let oppteam = message["data"]
    type = message["type"]
    opponent = new Opponent(oppteam)
    if (type==0||type==1){
        OfflineBattle()
    }else if (type==2){
        LiveBattle()
    }
})

socket.on("skipmove", function(){
    if(type==2){
        hideandwait()
    }
    player.Character.move = nonemove
    socket.emit("MoveChosen", nonemove)
})

socket.on("SwitchChars", (pointer)=>{
    opponent.SwitchCharacter(pointer)
})

socket.on("healuser", (message)=>{
    let healamount = message.amount
    player.Character.healamount = healamount
})

socket.on("healopp", (message)=>{
    let healamount = message.amount
    opponent.Character.healamount = healamount
})


socket.on("oppchardied", function(){
    opponent.UpdateTeam()
})

socket.on("win", function(){
    background.image.src = "static/Assets/Win.png"
    player.removeself()
    opponent.removeself()
    background.update()
    hideandwait()
    waiting.innerHTML = "Press any key to exit"
    document.addEventListener("keydown", function(){
        socket.emit("onlinewin")
        Goback()
    })
})
socket.on("draw", function(){
    background.image.src = "static/Assets/Draw.png"
    player.removeself()
    opponent.removeself()
    background.update()
    hideandwait()
    waiting.innerHTML = "Press any key to exit"
    document.addEventListener("keydown", function(){
        Goback()
    })
})
socket.on("lose", function(){
    background.image.src = "static/Assets/Lose.png"
    player.removeself()
    opponent.removeself()
    background.update()
    hideandwait()
    waiting.innerHTML = "Press any key to exit"
    document.addEventListener("keydown", function(){
        socket.emit("onlinelose")
        Goback()
    })
})

socket.on("DoMoves", (message) => {
    player.Character.move = message.Playermove
    opponent.Character.move = message.Oppmove
    applyMoves()
})
socket.on("Items", (data) => {
    let Itemids = Object.values(data)
    for (let i=0;i<Itemids.length;i++){
        var newitem = new Item(Itemids[i])
        Items.push(newitem)
    }
})
socket.on("Quantities", (data) => {
    Quantities = Object.values(data)
    for (let i=0;i<Quantities.length;i++){
        const item = Items[i]
        item.GetAmount(Quantities[i])
    }
    Displayitems()
})
socket.on("oppitemused", (itemid)=>{
    if(itemid==6){
        opponent.Character.hp += 50
    }else if(itemid==7){
        opponent.Character.hp += 100
    }else if(itemid==8){
        opponent.Character.hp += 200
    }else if(itemid==9){
        opponent.Character.hp += 400
    }else if(itemid==10){
        opponent.Character.hp += 1000
    }
})


