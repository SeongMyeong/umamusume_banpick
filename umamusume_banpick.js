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
        parseText(fr.result);
    }
}

function parseText(text) {
    console.log(text);
    displayWrapper(text);
}

/**
 * Wrapper 에 내용 display
 */
function displayWrapper(target) {
    const wrapper = document.getElementById('character_wrapper');
    const assetRoot = './assets/images/icon_square/';

    const targetArray = JSON.parse(target)["characters"];
    targetArray.forEach(el => {
        const characterId = el.id;
        const characterHName = el.h_name;
        const characterEName = el.e_name;
        const characterImage = assetRoot + el.image;

        // make character area element
        let characterAreaElement = document.createElement('div');
        characterAreaElement.className = 'character_area';
        characterAreaElement.style.borderStyle = 'solid';

        // make character image element
        let characterImageElement = document.createElement('img');
        characterImageElement.src = characterImage;
        
        // make character h_name element
        let characterHNameElement = document.createElement('div');
        characterHNameElement.className = 'h_name';
        characterHNameElement.textContent = characterHName;

        // make character e_name element
        let characterENameElement = document.createElement('div');
        characterENameElement.className = 'e_name';
        characterENameElement.textContent = characterEName;

        // append character elements to character_area
        characterAreaElement.appendChild(characterImageElement);
        characterAreaElement.appendChild(characterHNameElement);
        characterAreaElement.appendChild(characterENameElement);

        // append character_area to character_wrapper
        wrapper.appendChild(characterAreaElement);
    })
    
    
}

function makeCharacterArea(target) {

}