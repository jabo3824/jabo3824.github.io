document.getElementById('color-button').addEventListener('click', function () {
    const box = document.getElementById('color-box');
    const currentColor = box.style.backgroundColor;
    box.style.backgroundColor = currentColor === 'blue' ? 'green' : 'blue';
});

document.getElementById('text-button').addEventListener('click', function () {
    const textElement = document.getElementById('text');
    textElement.textContent = textElement.textContent === 'This text will change!'
        ? 'The text has changed!' : 'This text will change!';
});
