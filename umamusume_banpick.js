let charactersArray = [];
let filteredArray = [];
/**
 * Read Characters Information
 */
function readFile(event) {
    event.preventDefault(); //submit 할때 새로고침 되는것을 방지
    let fileObject = document.getElementById("input_file");
    let fileName = fileObject.files[0];

    let fr = new FileReader();
    fr.readAsText(fileName, "utf-8");

    // after file loaded
    fr.onload = () => {
        initContainer(fr.result);
    }
}

/**
 * Container container display
 */
function initContainer(target) {
    const targetArray = JSON.parse(target)["characters"];
    charactersArray = cloneDeep(targetArray);

    displayCharacters(charactersArray)
    
}

/**
 * select character wrapper div, turn origin -> banned, banned -> origin 
 * @param {*} event
 * should to refactoring
 */
function selectCharacter (event) {
    let targetDiv = event.target;
    let targetDivContainer = $(targetDiv).parent()[0];
    let targetClassName = targetDivContainer.className;

    // click wrapper itself
    if (targetClassName.includes('wrapper')) {
        if (targetClassName.includes('banned')) {
            targetDivContainer.className = 'character_item_wrapper'
        } else {
            targetDivContainer.className = 'character_item_wrapper banned'
        }
    }
}

function onChangeCharacterFindBox (event) {
    console.log(event.target)
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

function displayCharacters(charactersArray) {
    const container = document.getElementById('character_container');
    container.innerHTML = '';
    const assetRoot = './assets/icon_face/';
    // const assetRoot = './assets/namecard/'

    charactersArray.forEach(el => {
        const characterId = el.id;
        const characterHName = el.h_name;
        const characterEName = el.e_name;
        const characterImage = assetRoot + el.image + '.png';

        // make character area element
        let characterItemWrapper = document.createElement('div');
        characterItemWrapper.className = 'character_item_wrapper';
        characterItemWrapper.id = characterId;
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
        characterENameElement.textContent = characterEName;

        let characterItemWrapperCover = document.createElement('div');
        characterItemWrapperCover.className = 'character_item_wrapper_cover';

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

// <<<<<<< init function after window onloaded
function initInputBox() {
    const inputBox = document.getElementById('character_find_input')
    inputBox.addEventListener('input', (input) => {
        let newValue = input.target.value;
        inputBox.value = newValue;
        
        if (newValue === '') {
            displayCharacters(charactersArray)
        } else {
            filteredArray = cloneDeep(charactersArray.filter(el => el.e_name.includes(newValue) || el.h_name.includes(newValue)));
            displayCharacters(filteredArray);
        }
    })
}

window.onload = (event) => {
    initInputBox();
};