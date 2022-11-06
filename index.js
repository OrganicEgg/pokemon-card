"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const pokemonAPI = "https://pokeapi.co/api/v2/pokemon";
const pokemonAPIImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"; // $(pokemonIndex).png
console.log("pokemon api: " + pokemonAPI);
const baseURL = "http://localhost:3000";
function getParam(param, url) {
    if (!url)
        url = window.location.href;
    let _url = new URL(url);
    let _params = new URLSearchParams(_url.search);
    return _params.get(param);
}
// Make HTML Card for the pokemon lists
function createPokemonCard(divID, cardTextContent, cardImageSrc) {
    let _card = document.createElement("div");
    _card.setAttribute("class", "card d-inline-flex m-2");
    _card.setAttribute("style", "width: 200px");
    _card.setAttribute("id", divID);
    let _img = document.createElement("img");
    _img.setAttribute("src", cardImageSrc);
    _img.setAttribute("class", "card-img-top");
    _img.setAttribute("alt", "..");
    let _cardBody = document.createElement("div");
    _cardBody.setAttribute("class", "card-body");
    let _cardText = document.createElement("div");
    _cardText.setAttribute("class", "card-text");
    _cardText.innerHTML = cardTextContent;
    // Append
    _card.append(_img);
    _card.append(_cardBody);
    _cardBody.append(_cardText);
    let _container = document.querySelector(".pokemon-list-container");
    _container.append(_card);
}
function createPokemonListActionButton(prevURL, nextURL = '') {
    let _actionButtonContainer = document.querySelector(".pokemon-page-button-container");
    if (prevURL !== null) {
        let _prevOffset = getParam('offset', prevURL);
        let _prevLimit = getParam('limit', prevURL);
        prevURL = baseURL + '/?offset=' + _prevOffset + '&limit=' + _prevLimit;
        let _prevDiv = document.createElement("a");
        _prevDiv.setAttribute("href", prevURL);
        _prevDiv.innerHTML = "<i class='fa fa-arrow-left' aria-hidden='true'></i>Prev";
        if (prevURL != null)
            _actionButtonContainer.append(_prevDiv);
    }
    if (nextURL !== null) {
        let _nextOffset = getParam('offset', nextURL);
        let _nextLimit = getParam('limit', nextURL);
        nextURL = baseURL + '/?offset=' + _nextOffset + '&limit=' + _nextLimit;
        let _nextDiv = document.createElement("a");
        _nextDiv.setAttribute("href", nextURL);
        _nextDiv.setAttribute("class", "ms-3");
        _nextDiv.innerHTML = "Next<i class='fa fa-arrow-right' aria-hidden='true'></i>";
        _actionButtonContainer.append(_nextDiv);
    }
}
// Fetch Pokemon List
let getList = () => __awaiter(void 0, void 0, void 0, function* () {
    let offset = getParam('offset');
    let limit = getParam('limit');
    let _api = pokemonAPI + '?offset=' + offset + '&limit=' + limit;
    console.log({ _api });
    let resp = yield fetch(_api);
    return yield resp.json();
});
(function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let listOfPokemon = yield getList();
        createPokemonListActionButton(listOfPokemon.previous, listOfPokemon.next);
        listOfPokemon.results.forEach(p => {
            let _id = p.url.split("pokemon/");
            _id[1] = _id[1].replace("/", "");
            let _name = p.name.toUpperCase();
            createPokemonCard(_id[1], _name, pokemonAPIImage + _id[1] + '.png');
        });
        (_a = document.getElementById("title")) === null || _a === void 0 ? void 0 : _a.setAttribute("href", baseURL);
    });
})();
