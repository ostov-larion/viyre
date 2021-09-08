document.querySelector("#play-btn").addEventListener("click", Play)

document.querySelector("#north").onclick = () => Player.move(Player.location.n())
document.querySelector("#south").onclick = () => Player.move(Player.location.s())
document.querySelector("#west").onclick = () => Player.move(Player.location.w())
document.querySelector("#east").onclick = () => Player.move(Player.location.e())

function Play() {
    document.querySelectorAll("#board, #stats, #compass, #notes").forEach(e => e.style = "visibility: visible; opacity: 1;")
    document.querySelectorAll("#title, #desc").forEach(e => e.style = "animation: 2s fadein;")
    document.querySelectorAll(".card").forEach(e => e.classList.add("inverted"))
    document.querySelector("#menu").style = "display: none;"
    Player.renderStats()
    Player.move(Player.location)
}

function ShowCards() {
    let t = 1
    let i = setInterval(() => {
        document.getElementById("card-" + t).classList.remove("inverted")
        if(t == 4) clearInterval(i)
        else t++
    }, 300)
}

function SetCard(n, card) {
    let checkProvoc = (...ids) => ids.every(
        id => document.getElementById(id).dataset.provoc == "true" 
            ?
            document.getElementById(id).classList.contains('inverted')
            :
            true
        )
    document.getElementById("card-" + n).innerHTML = `<div><b>${card.name}</b>${card.icon ? `<img src="${card.icon}"></img>` : ""}</div>`
    document.getElementById("card-" + n).dataset.provoc = card.provoc
    document.getElementById("card-" + n).onmouseover = () => {
        document.getElementById("notes").innerText = document.getElementById("card-" + n).classList.contains("inverted") ? "" : card.note
    }
    if(!card.cond()) {
        document.getElementById("card-" + n).dataset.disabled = true
        document.getElementById("card-" + n).innerHTML = `<div><b>${card.name}</b>${card.icon ? `<img src="${card.icon}"></img>` : ""}<i>${card.condNote}</i></div>`
    }
    else {
        document.getElementById("card-" + n).dataset.disabled = false
    }
    document.getElementById("card-" + n).onclick = () => {
        document.getElementById("card-" + n).classList.add("inverted")
        document.getElementById("notes").innerText = card.ontapNote
        card.ontap()
        if(checkProvoc("card-1", "card-2", "card-3", "card-4")) {
            if(Player.location.n() == null) document.querySelector("#north").disabled = true
            else document.querySelector("#north").disabled = false
            if(Player.location.s() == null) document.querySelector("#south").disabled = true
            else document.querySelector("#south").disabled = false
            if(Player.location.w() == null) document.querySelector("#west").disabled = true
            else document.querySelector("#west").disabled = false
            if(Player.location.e() == null) document.querySelector("#east").disabled = true
            else document.querySelector("#east").disabled = false
        }
    }
}

let choose = (...els) => els[Math.floor(Math.random() * els.length )]

let Location = ([name]) => ([description]) => (n,s,w,e) => deck => ({name, description, deck: {...deck}, n, s, w, e})
let Deck = (...cards) => ({
    cards, 
    getCards: () => [
        choose(...cards),
        choose(...cards),
        choose(...cards),
        choose(...cards),
    ]
})
let Card = ({name, note, ontap = () => {}, ontapNote, provoc = false, cond = () => true, condNote = "", icon}) => ({name, ontap, note, ontapNote, provoc, cond, condNote, icon})
let nothing = () => null

let Cards = {}

Cards["Пиво"] = Card ({
    name: "Пиво", 
    note: "Может купить кружку крепкого?", 
    icon: "static/beer.svg", 
    ontap: () => {Player.add("hp", 5); Player.add("gd", -10)}, 
    ontapNote: "Ты выпил пива.", 
    cond: () => Player.gd >= 10, 
    condNote: "Необходимо 10 gd"
})
Cards["Человек"] = Card ({
    name: "Человек", 
    note: "Стоит неподалеку.", 
    icon: "static/human.svg", 
    ontapNote: "Уже ушел.", 
    provoc: true
})

let TabernDeck = Deck(Cards["Пиво"], Cards["Человек"])

let test = Location `Таверна` 
    `Ты стоял в плохо освященной таверне. Все сидели тихо, и пили пойло.` 
    (() => test2, nothing, nothing, nothing) 
    (TabernDeck)

let test2 = Location `Test Loc 2` `Test Desc 2` (nothing, () => test, nothing, nothing) (TabernDeck)

currentCards = []

let Player = {
    hp : 40,
    max_hp: 100,
    dp : 0,
    gd : 10,
    location: test,
    add(stat, value){
        if(this["max_" + stat] && this[stat] + value >= this["max_" + stat]) this[stat] = this["max_" + stat]
        else this[stat] += value
        this.renderStats()
        console.log(currentCards)
        SetCard(1, currentCards[0])
        SetCard(2, currentCards[1])
        SetCard(3, currentCards[2])
        SetCard(4, currentCards[3])
    },
    move(location){
        this.location = location
        document.getElementById("title").innerText = location.name
        document.getElementById("desc").innerText = location.description
        document.querySelectorAll("#title, #desc, #board, #stats, #compass, #notes").forEach(e => e.style = "visibility: visible; opacity: 1; animation: 2s fadein;")
        document.querySelectorAll(".card").forEach(e => e.classList.add("inverted"))
        let cards = location.deck.getCards()
        currentCards = cards
        console.log(cards)
        SetCard(1, cards[0])
        SetCard(2, cards[1])
        SetCard(3, cards[2])
        SetCard(4, cards[3])
        ShowCards()
        if(cards.find(card => card.provoc == true)){
            document.querySelector("#north").disabled = true
            document.querySelector("#south").disabled = true
            document.querySelector("#west").disabled = true
            document.querySelector("#east").disabled = true
        }
        else {
            if(location.n() == null) document.querySelector("#north").disabled = true
            else document.querySelector("#north").disabled = false
            if(location.s() == null) document.querySelector("#south").disabled = true
            else document.querySelector("#south").disabled = false
            if(location.w() == null) document.querySelector("#west").disabled = true
            else document.querySelector("#west").disabled = false
            if(location.e() == null) document.querySelector("#east").disabled = true
            else document.querySelector("#east").disabled = false
        }
        
    },
    renderStats(){
        document.getElementById("stats").innerText = `hp: ${this.hp} | dp: ${this.dp} | gd: ${this.gd}`
    }
}
