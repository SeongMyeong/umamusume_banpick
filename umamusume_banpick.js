let DEFAULT_ROUND_COUNT = 7;        // 라운드 미입력 시 초기 라운드

let initCharacterArray = [];        // Character.json 으로 읽어 온 캐릭터 목록
let displayCharacterArray = [];     // Input 을 이용한 search 등을 사용하기 위한 캐릭터 목록
let filteredCharacterArray = [];    // -> initCharacterArray.filter 로 처리하며, 라운드 완료  후 initCharacterArray 로 초기화

let roundBannedCharacter = [];    // 라운드 별 밴 한 캐릭터 배열 (display)
let roundPickedCharacter = [[], [], []];    // 라운드 별 픽 한 캐릭터 배열 (display)

let pickSelectedCharacter = [];   // 특정 라운드에 픽 한 캐릭터

let pickNumber = 0;

let nowRoundCount = -1;
let totalRoundCount = DEFAULT_ROUND_COUNT;

let isStart = true;
let isRoundBanReady = false;
let isRoundPickReady = false;

const assetRoot = './assets/images/icon_face/';
const namecardRoot = './assets/namecard/';

/**
 * select character wrapper div, turn origin -> banned, banned -> origin 
 * @param {*} event
 * should to refactoring
 */
function selectCharacter (event) {
    let targetDiv = event.target;
    let targetDivContainer = $(targetDiv).parent()[0];
    let targetClassName = targetDivContainer.className;
    let checked = false;
    
    const selectedCharacterId = event.target.id;
    checkCharacterOnBanPick(selectedCharacterId, checked);
}

// Check Character
function checkCharacterOnBanPick(selectedCharacterId, checked) {
    // Pick Time
    if (isRoundBanReady) {
        if (roundBannedCharacter.includes(selectedCharacterId)) {
            alert("밴 캐릭터는 지금라운드에 선택할 수 없습니다.")
            return;
        }
        if (pickSelectedCharacter.includes(selectedCharacterId)) {
            pickSelectedCharacter = pickSelectedCharacter.filter(el => el !== selectedCharacterId);
        } else {
            if (pickSelectedCharacter.length === 3) {
                alert("최대 3마리까지 선택이 가능합니다.")
                return;
            }
            pickSelectedCharacter.push(selectedCharacterId)
        }

        roundPickedCharacter[pickNumber] = pickSelectedCharacter;
        
        displayCharacters(displayCharacterArray)
        displayPickBoardCharacter(pickSelectedCharacter)
    } else {
        // Ban Time
        if (roundBannedCharacter.includes(selectedCharacterId)) {
            roundBannedCharacter = roundBannedCharacter.filter(el => el !== selectedCharacterId);
        } else {
            if (roundBannedCharacter.length === 2) {
                alert("최대 3마리까지 선택이 가능합니다.")
                return;
            }
            roundBannedCharacter.push(selectedCharacterId);
        }
        
        // roundBannedCharacter[nowRoundCount] = banSelectedCharacter;
        
        displayCharacters(displayCharacterArray)
        displayBanBoardCharacter(roundBannedCharacter)
    }
}

function displayBanBoardCharacter(characterArray) {
    const banContainer = document.getElementById("ban_item_container_" + nowRoundCount)
    banContainer.innerHTML = "";

    characterArray.map(el => {
        // const namecardImage = namecardRoot + el + ".png";
        const namecardImage = assetRoot + el + ".png";
        let namecardImageElement = document.createElement('img');
        namecardImageElement.className = 'ban_character_namecard'
        namecardImageElement.src = namecardImage;

        banContainer.append(namecardImageElement);
    })
}

function displayPickBoardCharacter(characterArray) {
    const pickContainer = document.getElementById("pick_item_container_" + nowRoundCount + "_" + pickNumber);
    pickContainer.innerHTML = "";

    characterArray.map(el => {
        // const namecardImage = namecardRoot + el + ".png";
        const namecardImage = assetRoot + el + ".png";
        let namecardImageElement = document.createElement('img');
        namecardImageElement.className = 'pick_character_namecard'
        namecardImageElement.src = namecardImage;

        pickContainer.append(namecardImageElement);
    })

}

// change character input text box (filter uma)
function onChangeCharacterFindBox (event) {
    let newValue = event.target.value;
    const inputBox = document.getElementById('character_find_input')
    inputBox.value = newValue;
    
    if (newValue === '') {
        displayCharacterArray = cloneDeep(initCharacterArray)
        displayCharacters(displayCharacterArray)
    } else {
        // let tempArray = [];
        // tempArray = cloneDeep(displayCharacterArray.filter(el => el.e_name.includes(newValue) || el.h_name.includes(newValue)));
        // displayCharacterArray = cloneDeep(tempArray)
        filteredCharacterArray = cloneDeep(displayCharacterArray.filter(el => el.e_name.includes(newValue) || el.h_name.includes(newValue)));
        
        displayCharacters(filteredCharacterArray);
    }
}

// Click LockOn Button, disable now round.
function onClickLockOnButton (event) {
    if (nowRoundCount + 1 === totalRoundCount) return;
    
    initDatas();

    // displayBanPickBoard();
    displayCharacters(initCharacterArray);
}

function initDatas() {
    pickSelectedCharacter = new Array();
    roundPickedCharacter[0] = new Array();
    roundPickedCharacter[1] = new Array();
    roundPickedCharacter[2] = new Array();
    roundBannedCharacter = new Array();

    isRoundBanReady = false;
    isRoundPickReady = false;
    pickNumber = 0;
    nowRoundCount += 1;

    changeBanPickStatus();
}

// Click Ban / Pick Ready
function onClickBanReady (event) {
    if (isRoundBanReady || roundBannedCharacter.length === 0) {
        alert("이미 밴이 완료되었거나, 최대 2마리까지 밴이 가능합니다.")
        return;
    }
    isRoundBanReady = true;

    changeBanPickStatus();
}

function onClickPickReady (event) {
    if (pickNumber === 2 || pickSelectedCharacter.length !== 3) {
        alert("마지막 픽 이거나, 3마리가 선택되지 않았습니다.")
        return;
    }
    pickNumber = (pickNumber + 1) % 3;
    pickSelectedCharacter = roundPickedCharacter[pickNumber]
    
    displayCharacters(displayCharacterArray)
    displayPickBoardCharacter(pickSelectedCharacter)

    changeBanPickStatus();
}

// Click Random Button (Ban / Pick Randomly)
function onClickRandomSelect (event) {
    let characterIndex = 0;

    console.log("전체 인원: ", displayCharacterArray.length)
    // 지금 선택 가능한 캐릭터의 수
    const tempCharacterArray = displayCharacterArray.filter(character => {
        return !roundBannedCharacter.includes(character.id)
    }).filter(character => {
        return !roundPickedCharacter[pickNumber].includes(character.id)
    })
    console.log(tempCharacterArray.length)
    
    // setTimeout(selectRandomCharacter(), 5000);
}

function selectRandomCharacter () {
    // setInterval(intervalSelectRandomCharacter(), 100);
}

function intervalSelectRandomCharacter () {
    // let index = Math.floor(Math.random() * max);
}

// <<<<<<< inner private function

function changeBanPickStatus () {
    if (isStart) return;
    const statusSpanElement = document.getElementById("ban_pick_status");
    statusSpanElement.innerText = "";
    
    if (isRoundBanReady) {
        statusSpanElement.innerText = (nowRoundCount+1) + " 라운드 "+ (pickNumber+1) + "번 유저 선택시간"
    } else {
        statusSpanElement.innerText = (nowRoundCount+1) + " 라운드 밴 캐릭터 선택 중"
    }
}

/**
 * Array DeepCopy
 * @param {Array} targetObject 
 * @returns copied array
 */
function cloneDeep (targetObject) {
    const clone = [];

    targetObject.forEach(el => {
        clone.push(el);
    });

    return clone;
}

// display character board
function displayCharacters(charactersArray) {
    const container = document.getElementById('character_container');
    container.innerHTML = '';

    charactersArray.forEach(el => {
        const characterId = el.id;
        const characterHName = el.h_name;
        const characterImage = assetRoot + characterId + '.png';

        // make character area element
        let characterItemWrapper = document.createElement('div');

        if (roundBannedCharacter.includes(el.id)) {
            characterItemWrapper.className = 'character_item_wrapper banned'; 
        } else if (pickSelectedCharacter.includes(el.id)) {
            characterItemWrapper.className = 'character_item_wrapper picked';
        } else {
            characterItemWrapper.className = 'character_item_wrapper'; 
        }

        // if (!isRoundBanReady && typeof roundBannedCharacter === "object") {
        //     if (roundBannedCharacter.includes(el.id)) {
        //         characterItemWrapper.className = 'character_item_wrapper banned'; 
        //     } else {
        //         characterItemWrapper.className = 'character_item_wrapper'; 
        //     }

        // } else if (!isRoundPickReady && pickSelectedCharacter === "object") {
        //     console.log(pickSelectedCharacter)
        //     if (pickSelectedCharacter.includes(el.id)) {
        //         characterItemWrapper.className = 'character_item_wrapper picked';
        //     } else {
        //         characterItemWrapper.className = 'character_item_wrapper'; 
        //     }
        // } else {
        //     characterItemWrapper.className = 'character_item_wrapper';
        // }
    
        // characterItemWrapper.id = characterId;
        characterItemWrapper.style.borderStyle = 'solid';

        // make character image element
        let characterImageElement = document.createElement('img');
        characterImageElement.className = 'character_image'
        characterImageElement.src = characterImage;
        
        // make character h_name element
        let characterHNameElement = document.createElement('div');
        characterHNameElement.className = 'character_h_name';
        characterHNameElement.textContent = characterHName;

        // make character e_name element
        let characterENameElement = document.createElement('div');
        characterENameElement.className = 'character_e_name';
        // characterENameElement.textContent = characterEName;

        let characterItemWrapperCover = document.createElement('div');
        characterItemWrapperCover.className = 'character_item_wrapper_cover';
        characterItemWrapperCover.id = characterId

        // append character elements to character_area
        characterItemWrapper.appendChild(characterItemWrapperCover);
        characterItemWrapper.appendChild(characterImageElement);
        characterItemWrapper.appendChild(characterHNameElement);
        characterItemWrapper.appendChild(characterENameElement);

        // append character_area to character_wrapper
        container.appendChild(characterItemWrapper);

        characterItemWrapperCover.addEventListener('click', selectCharacter);
    })
}

function displayBanPickBoard (initCase = false) {
    const container = document.getElementById('banpick_container');
    
    if (initCase) container.innerHTML = '';

    for (let i = 0; i < totalRoundCount; i++) {
        const banPickItemContainer = document.createElement('div');
        banPickItemContainer.className = "banpick_item_container";
        banPickItemContainer.id = "banpick_item_container_" + i;

        const textNode = document.createTextNode('RACE ' + (i + 1));
        const textContainer = document.createElement('span');
        textContainer.className = "banpick_round_text_container";
        textContainer.id = "banpick_round_text_container_" + i;
        textContainer.appendChild(textNode);
        banPickItemContainer.appendChild(textContainer);

        const banItemContainer = document.createElement('div');
    
        banItemContainer.className = "ban_item_container";
        banItemContainer.id = "ban_item_container_" + i;
    
        banPickItemContainer.appendChild(banItemContainer);
        
        for (let j = 0; j < 3; j++) {
            const pickItemContainer = document.createElement('div');
    
            pickItemContainer.className = "pick_item_container";
            pickItemContainer.id = "pick_item_container_" + i + "_" + j;
            banPickItemContainer.appendChild(pickItemContainer);    
        }
        

        container.appendChild(banPickItemContainer);
    }
}

// <<<<<<< init function after window onloaded
/**
 * Initialize character display area
 */
function initContainer(characterArray) {
    initCharacterArray = cloneDeep(characterArray);
    displayCharacterArray = cloneDeep(characterArray);
    
    changeBanPickStatus();
    displayCharacters(displayCharacterArray)
}

/**
 * Initialize total round count
 */
function initTotalRound () {
    const inputTotalRound = prompt("최대 라운드 입력 (미입력시 3라운드, 숫자만 입력)")
    totalRoundCount = inputTotalRound ? parseInt(inputTotalRound) : parseInt(DEFAULT_ROUND_COUNT);
}

/**
 * Initialize ban pick board
 */
function initBanPickBoard () {
    displayBanPickBoard(true);
    // initBanSelectedList();

}

// <<<<<<<< window/document event
window.onload = (event) => {
    // initialize total round
    // initTotalRound();

    // initialize ban/pick board
    initBanPickBoard();
    initDatas();
};

/**
 * File read event
 */
document.getElementById("input_file").onchange = () => {
    event.preventDefault(); //submit 할때 새로고침 되는것을 방지
    let fileObject = document.getElementById("input_file");
    let fileName = fileObject.files[0];

    let fr = new FileReader();
    fr.readAsText(fileName, "utf-8");

    // after file loaded
    fr.onload = () => {
        const targetArray = JSON.parse(fr.result)["characters"];
        isStart = false;
        initContainer(targetArray);
    }
}

/**
 * Character find input box event
 */
document.getElementById('character_find_input').oninput = (event) => {
    onChangeCharacterFindBox(event)
}