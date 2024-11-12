document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById('fetch-btn');
    const content = document.getElementById('content');

    async function getFactOrJoke() {
        const apiURL = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single'; // Change this to your desired API endpoint if needed

        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayRes(data.joke || "No joke found."); // Display data based on API structure
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error fetching data. Please try again later.');
        }
    }

    function displayRes(text) {
        content.textContent = text;
    }

    button.addEventListener('click', getFactOrJoke);

    getFactOrJoke();
});
