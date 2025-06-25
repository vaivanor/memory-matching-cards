//Memory Matching Game

const defaultSymbol = '★';
const allSymbols = ['♩', '♪', '♫', '𝄢', '𝄞', '♭', '♯', '𝄂', '𝄇'];
let symbolNr = 0;
let symbolsOriginal = [];
let symbolsDublicate = [];
let symbols = [];
let shuffleSymbols = [];

//i simboliu masyva idedamas reikiamas kiekis elementu, tiek kiek nurodyta ivedimo lauke / 2
const createSymbolArray = (symbolNr) => {
    for (let i = 0; i < symbolNr; i++) {
        const element = allSymbols[i];
        symbolsOriginal.push(element);
        symbolsDublicate.push(element);
    }
    symbols = symbolsOriginal.concat(symbolsDublicate);
    console.log(symbols);
};

//masyvo elementu maisymas (obj su random reiksme, pvz. sort: 0.72, value: '♩', rusiuojama pagal skaiciaus reiksme
const shuffle = (symbols) => { 
    return symbols
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value); 
}; 

//-----------------------------------------------------------------------

let countM = 0;
let countT = 0;
let timer = 0;
let countTimeStarted = false;

//-----------------------------------------------------------------------

//nustatomas geriausias stulpeliu skaicius, kad nevirsytos butu 3 eilutes
const getColumnNumber = (cardCount) => {
    for (let i = 6; i >= 1; i--) {
        if (cardCount % i === 0 && cardCount / i <= 3) {
            return i;
        }
    }
    return Math.ceil(cardCount / 3);
}

//sukuriamos korteles
const createCards = (shuffleSymbols) => {
    const container = document.querySelector('.container');
    const columns = getColumnNumber(symbolNr*2);
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    shuffleSymbols.forEach(() => {
        const element = document.createElement('div');
        element.className = 'card';
        element.innerText = defaultSymbol;
        container.appendChild(element);
    });
};

//----------------------------------------------------------------------

//pakeiciamas paspaustos korteles simbolis ir priskiriama klasė
const changeSymbol = (element, index) => {
    element.classList.add('clicked');
    element.innerText = shuffleSymbols[index];
};

//paspaudimas ant korteles
const setCardClicks = () => {
    const elements = document.querySelectorAll('.card');
    elements.forEach((element, index) => {
        element.addEventListener('click', () => {
            changeSymbol(element, index);
            checkCardMatch();
        });
    });
};

//ar pasirinktos dvi korteles yra vienodos
const checkCardMatch = () => {
    const elementsClicked = document.querySelectorAll('.clicked');
    if(elementsClicked.length === 2) {
        countMoves();
        const first = elementsClicked[0];
        const second = elementsClicked[1];
        if(first.innerText === second.innerText) {
            setMatch(elementsClicked);
            stopTime();
        } else {
            setMissMatch(elementsClicked); 
        }
    }
};

//jei vienodos pasirinktos
const setMatch = (elements) => {
    elements.forEach((element) => {
        element.classList.add('matched');
        element.classList.remove('clicked');
    });
};

//jei skirtingos pasirinktos
const setMissMatch = (elements) => {
    setTimeout(() => {
        elements.forEach((element) => {
            element.innerText = defaultSymbol;
            element.classList.remove('clicked');
        });
    }, 500);  
};

//----------------------------------------------------------------------

//ejimu skaiciavimas 2 atverstos korteles 1 move
const countMoves = () => {
    const moves = document.querySelector('.move');
    countM++;
    moves.innerText = countM;
};

//laikmatis
const countTime = () => {
    const time = document.querySelector('.time');
    const container = document.querySelector('.container');
    container.addEventListener('click', (event) => {
        if(!countTimeStarted && event.target.classList.contains('card')) {
            countTimeStarted = true;
            timer = setInterval(() => {
                countT++;
                time.innerText = countT;
            }, 1000);     
        }
    });
}

const stopTime = () => {
    const elementsMatched = document.querySelectorAll('.matched');
    if(elementsMatched.length === shuffleSymbols.length) {
        clearInterval(timer);
    }
}

//puslapio perkrovimas, kai paspaudziamas restart
const reloadPage = () => {
    const restart = document.querySelector('button#restart');
    restart.addEventListener('click', () => {
        window.location.reload();
    });
};

//----------------------------------------------------------------------

//paimamas skaicius is formos, pagal tai sukuriamas reikiamas kiekis korteliu
const startGame = () => {
    const myForm = document.querySelector('form#form');
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputNr = document.querySelector('input[name="name"]');
        symbolNr = inputNr.value / 2;

        createSymbolArray(symbolNr);

        shuffleSymbols = shuffle(symbols);

        createCards(shuffleSymbols);
        setCardClicks();
        
        const content = document.querySelector('.content');
        content.style.display = 'block';
        const form = document.querySelector('.formContainer');
        form.style.display = 'none';
    });   
}

startGame();
reloadPage();
countTime();