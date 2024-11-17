function fetchRandomComic() {
    const randomComicNum = Math.floor(Math.random() * 3000) + 1;
    const proxyUrl = 'https://corsproxy.io/?https://xkcd.com/';
    const apiUrl = `${proxyUrl}${randomComicNum}/info.0.json`;
 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('comic-title').innerText = data.title;
            const comicImg = document.getElementById('comic-img');
            comicImg.src = data.img;
            comicImg.alt = data.alt;
            document.getElementById('comic-date').innerText = `Published on: ${data.year}-${data.month}-${data.day}`;
        })
        .catch(error => console.error('Error fetching comic:', error));
 }