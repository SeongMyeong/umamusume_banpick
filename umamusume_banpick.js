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
    
}

function makeCharacterArea(target) {

}