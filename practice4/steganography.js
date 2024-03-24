//Привязка события
window.onload = function() {
    var input = document.getElementById('file');
    input.addEventListener('change', import_image);

    var encode_button = document.getElementById('encode');
    encode_button.addEventListener('click', encode);

    var decode_button = document.getElementById('decode');
    decode_button.addEventListener('click', decode);
};

//Отображение файла на canvas
var import_image = function(e) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();

        img.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
};

//Кодирование фото
var encode = function() {
    var message = document.getElementById('message').value;
    var image_encoded = document.getElementById('image_encoded');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var pixel_count = ctx.canvas.width * ctx.canvas.height;

    if ((message.length + 1) * 16 > pixel_count * 4 * 0.75) {
        alert('Слишком большой файл');
        return;
    }

    var img_data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    encode_message(img_data.data, message);
    ctx.putImageData(img_data, 0, 0);
    image_encoded.src = canvas.toDataURL();
};

//Декодирование фото
var decode = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var img_data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    var message = decode_message(img_data.data);
    document.getElementById('message_decoded').innerHTML = message;
};

//Преобразовать двоичный код в строку
var get_number_from_bits = function(bytes, history) {
    var number = 0;
    var pos = 0;

    while (pos < 16) {
        var loc = get_next_location(history, bytes.length);
        var bit = getBit(bytes[loc], 0);
        number = set_bit(number, pos, bit);
        pos++;
    }
    return number;
};
var get_next_location = function(history, total) {
    var pos = history.length;
    var loc = Math.abs(pos + 1) % total;

    while (true) {
        if (loc >= total) {
            loc = 0;
        } else if (history.indexOf(loc) >= 0) {
            loc++;
        } else if ((loc + 1) % 4 === 0) {
            loc++;
        } else {
            history.push(loc);
            return loc;
        }
    }
};
var set_bit = function(number, location, bit) {
    return (number & ~(1 << location)) | (bit << location);
};

//Преобразовать строку в двоичный код
var get_message_bits = function(message) {
    var message_bits = [];

    for (var i = 0; i < message.length; i++) {
        var code = message.charCodeAt(i);
        message_bits = message_bits.concat(get_bits_from_number(code));
    }
    return message_bits;
};
var get_bits_from_number = function(number) {
    var bits = [];

    for (var i = 0; i < 16; i++) {
        bits.push(getBit(number, i));
    }
    return bits;
};
var getBit = function(number, location) {
    return ((number >> location) & 1);
};

//Кодирование сообщения
var encode_message = function(colors, message) {
    var message_bits = get_bits_from_number(message.length);
    message_bits = message_bits.concat(get_message_bits(message));
    var history = [];
    var pos = 0;

    while (pos < message_bits.length) {
        var loc = get_next_location(history, colors.length);
        colors[loc] = set_bit(colors[loc], 0, message_bits[pos]);
        while ((loc + 1) % 4 !== 0) {
            loc++;
        }
        colors[loc] = 255;
        pos++;
    }
};

//Декодирование сообщения
var decode_message = function(colors) {
    var history = [];
    var message_size = get_number_from_bits(colors, history);
    
    if ((message_size + 1) * 16 > colors.length * 0.75) {
        return '';
    }
    var message = [];
    for(var i = 0; i < message_size; i++) {
        var code = get_number_from_bits(colors, history);
        message.push(String.fromCharCode(code));
    }
    return message.join('');
};