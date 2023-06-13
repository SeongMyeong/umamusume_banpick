let DEFAULT_ROUND_COUNT = 7;        // 라운드 미입력 시 초기 라운드

let initCharacterArray = [];        // Character.json 으로 읽어 온 캐릭터 목록
let displayCharacterArray = [];     // Input 을 이용한 search 등을 사용하기 위한 캐릭터 목록
let filteredCharacterArray = [];    // -> initCharacterArray.filter 로 처리하며, 라운드 완료  후 initCharacterArray 로 초기화

let roundSelectedCharacter = [DEFAULT_ROUND_COUNT - 1];    // 라운드 별 선택 한 캐릭터 배열
let banSelectedCharacter = [];      // 특정 라운드에 선택 한 캐릭터 배열

let nowRoundCount = 0;
let totalRoundCount = DEFAULT_ROUND_COUNT;

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
    checkCharacterOnBan(selectedCharacterId, checked);
}

// Check Character
function checkCharacterOnBan(selectedCharacterId, checked) {
    // if (roundSelectedCharacter[nowRoundCount]?.length === 4) return;

    const temp = [];
    // already include character
    if (banSelectedCharacter.includes(selectedCharacterId)) {
        banSelectedCharacter = banSelectedCharacter.filter(el => el !== selectedCharacterId);
    } else {
        banSelectedCharacter.push(selectedCharacterId);
    }
    
    roundSelectedCharacter[nowRoundCount] = banSelectedCharacter;
    console.log(roundSelectedCharacter);
    
    displayCharacters(displayCharacterArray)
    displayBanPickBoardCharacter(banSelectedCharacter)
}

function displayBanPickBoardCharacter(characterArray) {
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

// change character input text box (filter uma)
function onChangeCharacterFindBox (event) {
    let newValue = event.target.value;
    const inputBox = document.getElementById('character_find_input')
    inputBox.value = newValue;
    
    if (newValue === '') {
        displayCharacters(displayCharacterArray)
    } else {
        // filteredCharacterArray = cloneDeep(displayCharacterArray.filter(el => el.e_name.includes(newValue) || el.h_name.includes(newValue)));
        filteredCharacterArray = cloneDeep(displayCharacterArray.filter(el => el.e_name.includes(newValue) || el.h_name.includes(newValue)));
        displayCharacters(filteredCharacterArray);
    }
}

// Click LockOn Button, disable now round.
function onClickLockOnButton (event) {
    if (nowRoundCount + 1 === totalRoundCount) return;
    
    nowRoundCount += 1;
    banSelectedCharacter = [];

    // displayBanPickBoard();
    displayCharacters(initCharacterArray);
}

// Click Ban / Pick Ready
function onClickBanPickReady (event) {
    
}

// <<<<<<< inner private function

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
        const characterEName = el.e_name;
        const characterImage = assetRoot + characterId + '.png';

        // make character area element
        let characterItemWrapper = document.createElement('div');
        if (typeof roundSelectedCharacter[nowRoundCount] === "object") {
            if (roundSelectedCharacter[nowRoundCount].includes(el.id)) {
                characterItemWrapper.className = 'character_item_wrapper banned'; 
            } else {
                characterItemWrapper.className = 'character_item_wrapper'; 
            }
        } else {
            characterItemWrapper.className = 'character_item_wrapper';
        }
    
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

        const textNode = document.createTextNode((i + 1) + '라운드');
        const textContainer = document.createElement('span');
        textContainer.appendChild(textNode);
        banPickItemContainer.appendChild(textContainer);

        const banItemContainer = document.createElement('div');
    
        banItemContainer.className = "ban_item_container";
        banItemContainer.id = "ban_item_container_" + i;
    
        banPickItemContainer.appendChild(banItemContainer);
        
        const pickItemContainer = document.createElement('div');
    
        pickItemContainer.className = "pick_item_container";
        pickItemContainer.id = "pick_item_container_" + i;
    
        banPickItemContainer.appendChild(pickItemContainer);

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
        initContainer(targetArray);
    }
}

/**
 * Character find input box event
 */
document.getElementById('character_find_input').oninput = (event) => {
    onChangeCharacterFindBox(event)
}