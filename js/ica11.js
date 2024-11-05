
function tellFortune(children, partnerName, location, job) {
  const fortune = `You will be a ${job} in ${location}, and married to ${partnerName} with ${children} kids.`;
  document.getElementById('fortuneOutput').innerHTML += `<p>${fortune}</p>`;
}

tellFortune(2, 'Alex', 'New York', 'Engineer');
tellFortune(3, 'Taylor', 'London', 'Designer');
tellFortune(1, 'Jordan', 'Tokyo', 'Chef');

function calculateDogAge(age) {
  const dogAge = age * 7;
  const result = `Your doggie is ${dogAge} years old in dog years!`;
  document.getElementById('dogAgeOutput').innerHTML += `<p>${result}</p>`;
}

calculateDogAge(2);
calculateDogAge(5);
calculateDogAge(1);

function userDogAge() {
  const userAge = document.getElementById('dogAge').value;
  if (userAge) {
      calculateDogAge(userAge);
  } else {
      alert("Please enter your dog's age!");
  }
}

function reverseNumber(num) {
  const reversed = num.toString().split('').reverse().join('');
  document.getElementById('reverseNumberOutput').innerHTML += `<p>Reversed Number: ${reversed}</p>`;
}

reverseNumber(32243);
reverseNumber(12345);

function alphabeticalOrder(str) {
  const sorted = str.split('').sort().join('');
  document.getElementById('alphabeticalOutput').innerHTML += `<p>Alphabetical Order: ${sorted}</p>`;
}

alphabeticalOrder('webmaster');
alphabeticalOrder('javascript');

function capitalizeWords(sentence) {
  const capitalized = sentence.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  document.getElementById('capitalizeOutput').innerHTML += `<p>Capitalized Sentence: ${capitalized}</p>`;
}

capitalizeWords('the quick brown fox');
capitalizeWords('hello world from javascript');