// Diffie-Hellman
const primeNum = 83;
const genOfP = 13;
is_prime(primeNum);

let privateKeyAlice = random_key(0, 100);
let privateKeyBob =  random_key(0, 100);

let publicKeyAlice =  diffie_hellman(genOfP, privateKeyAlice, primeNum);
let publicKeyBob = diffie_hellman(genOfP, privateKeyBob, primeNum);

const sharedSecretAlice = diffie_hellman(publicKeyBob, privateKeyAlice, primeNum);
const sharedSecretBob = diffie_hellman(publicKeyAlice, privateKeyBob, primeNum);
const sharedSecret = is_shared_secret(sharedSecretAlice, sharedSecretBob);


// Caesar Encryption
const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ,.-!?".split("");

const button = document.querySelector(".button");
const encryptMessage = document.querySelector(".encrypt");
const decryptMessage = document.querySelector(".decrypt");

button.addEventListener("click", () => {
    const message = document.querySelector(".textarea").value.toLowerCase().split("");

    encryptMessage.textContent = caesar_encrypt(message, sharedSecret, alphabet);
    decryptMessage.textContent = caesar_decrypt(encryptMessage.textContent.split(""), sharedSecret, alphabet);
})


// functions
function is_prime(primeNum) {
    for(let i = 2; i < Math.sqrt(primeNum) ; i++) {
        if(primeNum % i === 0) {
            throw new Error("P must be a prime number")
        }
    }
}

function random_key(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function diffie_hellman(publicKey, privateKey, primeNum) {
    if(genOfP > primeNum){
        throw new Error("G cannot be greater than P");
    }

    let result = 1;
    publicKey = publicKey % primeNum;
    
    while (privateKey > 0) {
        if (privateKey % 2 === 1) {
            result = (result * publicKey) % primeNum;
        }

        privateKey = Math.floor(privateKey / 2);
        publicKey = (publicKey ** 2) % primeNum;
    }
    return result;
}

function is_shared_secret(firstKey, secondKey) {
    if(firstKey !== secondKey) {
        throw new Error("Shared Secret does not match");
    }
    return firstKey;
}

function caesar_encrypt(message, key, alphabet) {
    if(key === alphabet.length) {
        alert("Общий ключ равен длине алфавита. Сообщение не зашифруется!");
    }
    
    if(key > alphabet.length) {
        key = key % alphabet.length;
    }

    for(let i = 0; i < message.length; i++) {
        for(let j = 0; j < alphabet.length; j++) {
            if(message[i] === alphabet[j]) {
                for(let k = 0; k < key; k++) {
                    if(j < alphabet.length - 1) {
                        j++;
                    } else {
                        j = 0;
                    }
                }
                message[i] = alphabet[j];
                break;
            }
        }
    }
    return message.join("");
}

function caesar_decrypt(message, key, alphabet) {
    for(let i = 0; i < message.length; i++) {
        for(let j = 0; j < alphabet.length; j++) {
            if(message[i] === alphabet[j]) {
                for(let k = 0; k < key; k++) {
                    if(j > 0) {
                        j--;
                    } else {
                        j = alphabet.length - 1;
                    }
                }
                message[i] = alphabet[j];
                break;
            }
        }
    }
    return message.join("");
}


// DOM
document.querySelector(".prime-num").textContent = primeNum;
document.querySelector(".generator-p").textContent = genOfP;

document.querySelector(".private-alice").textContent = privateKeyAlice;
document.querySelector(".private-bob").textContent = privateKeyBob;

document.querySelector(".public-alice").textContent = publicKeyAlice;
document.querySelector(".public-bob").textContent = publicKeyBob;

document.querySelector(".shared-alice").textContent = sharedSecretAlice;
document.querySelector(".shared-bob").textContent = sharedSecretBob;