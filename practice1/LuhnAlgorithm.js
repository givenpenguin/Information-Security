let button = document.querySelector(".button");
let text = document.querySelector(".text");

button.addEventListener("click", () => {
    let input = document.querySelector(".input").value;
    let array = [];

    for(let i = 0; i < input.length; i++) {
        array[i] = Number(input[i]);
    }

    for(let i = array.length - 2; i > -1; i = i - 2) {
        array[i] *= 2;
        if(array[i] > 9) {
            array[i] -= 9;
        }
    }

    if(array.reduce((sum, val) => sum + val, 0) % 10 === 0) {
        text.textContent = "Номер карты валиден";
    } else {
        text.textContent = "Номер карты введен неверно";
    }
})

