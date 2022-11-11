const pokemonAPI = "https://pokeapi.co/api/v2/pokemon"
const pokemonAPIImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" // $(pokemonIndex).png
console.log("pokemon api: " + pokemonAPI)
const baseURL = "http://localhost:3000"
let loadingState = true

interface PokemonList {
    count: number
    next: string
    previous?: any
    results: {
        name: string
        url: string
    }[]
}

interface Pokemon {
    name: string
    weight: number
    height: number
    stats: {
        base_stat: number
        effort: number
        stat: {
            name: string
            url: string
        }
    }[]
    species: {
        name: string
        url: string
    }
}

function getParam(param: string, url?: string): string | null {
    if (!url) url = window.location.href
    let _url = new URL(url)
    let _params = new URLSearchParams(_url.search)
    return _params.get(param)
}

// Make HTML Card for the pokemon lists
function createPokemonCard(divID: string, cardTextContent: string, cardImageSrc: string) {
    let _card = document.createElement("div")
    _card.setAttribute("class", "card d-inline-flex m-2")
    _card.setAttribute("style", "width: 200px")
    _card.setAttribute("id", divID)

    let _img = document.createElement("img")
    _img.setAttribute("src", cardImageSrc)
    _img.setAttribute("class", "card-img-top")
    _img.setAttribute("alt", "..")

    let _cardBody = document.createElement("div")
    _cardBody.setAttribute("class", "card-body")

    let _cardText = document.createElement("div")
    _cardText.setAttribute("class", "card-text")
    _cardText.innerHTML = cardTextContent

    _card.append(_img)
    _card.append(_cardBody)
    _cardBody.append(_cardText)

    let _container = document.querySelector(".pokemon-list-container") as HTMLDivElement
    _container.append(_card)
}

function createPokemonListActionButton(prevURL: string, nextURL: string = '') {
    let _actionButtonContainer = document.querySelector(".pokemon-page-button-container") as HTMLDivElement

    if (prevURL !== null) {
        let _prevOffset = getParam('offset', prevURL)
        let _prevLimit = getParam('limit', prevURL)

        prevURL = baseURL + '/?offset=' + _prevOffset + '&limit=' + _prevLimit

        let _prevDiv = document.createElement("a")
        _prevDiv.setAttribute("href", prevURL)
        _prevDiv.innerHTML = "<i class='fa fa-arrow-left' aria-hidden='true'></i>Prev"

        if (prevURL != null) _actionButtonContainer.append(_prevDiv)
    }

    if (nextURL !== null) {
        let _nextOffset = getParam('offset', nextURL)
        let _nextLimit = getParam('limit', nextURL)

        nextURL = baseURL + '/?offset=' + _nextOffset + '&limit=' + _nextLimit

        let _nextDiv = document.createElement("a")
        _nextDiv.setAttribute("href", nextURL)
        _nextDiv.setAttribute("class", "ms-3")
        _nextDiv.innerHTML = "Next<i class='fa fa-arrow-right' aria-hidden='true'></i>"
        _actionButtonContainer.append(_nextDiv)
    }
}

// Fetch Pokemon List
let getList = async (): Promise<PokemonList> => {
    let offset = getParam('offset')
    let limit = getParam('limit')

    let _api = pokemonAPI + '?offset=' + offset + '&limit=' + limit
    console.log({ _api })
    let resp = await fetch(_api);
    return await resp.json()
}

function loading(d: string) {
    let loadingContainer = document.querySelector(".pokemon-list-loading-container") as HTMLDivElement
    loadingContainer.style.display = d
}

(async function () {
    let listOfPokemon = await getList()
    createPokemonListActionButton(listOfPokemon.previous, listOfPokemon.next)
    listOfPokemon.results.forEach(p => {
        let _id = p.url.split("pokemon/")
        _id[1] = _id[1].replace("/", "")
        let _name = p.name.toUpperCase()
        createPokemonCard(_id[1], _name, pokemonAPIImage + _id[1] + '.png')
    });
    loading("none")
    loadingState = false
    document.getElementById("title")?.setAttribute("href", baseURL)
})()