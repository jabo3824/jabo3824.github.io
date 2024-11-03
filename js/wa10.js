const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

const storyText = "It was a cold, foggy night, and :insertx: decided to wander through :inserty:. Just as the clock struck midnight, a chilling wind swept through, and suddenly :insertx: :insertz:. Witnesses swore they saw it happen, but nobody could believe their eyes — after all, :insertx: has been dead for centuries.";

const insertX = ["Skully the Skeleton", "The Grim Reaper", "Phantom Bones"];
const insertY = ["the abandoned graveyard", "the haunted forest", "the old mansion"];
const insertZ = ["let out an eerie cackle", "vanished into thin air", "slowly turned to dust", "glowed with a ghostly blue light"];

randomize.addEventListener('click', result);

function result() {
  let newStory = storyText;

  const xItem = randomValueFromArray(insertX);
  const yItem = randomValueFromArray(insertY);
  const zItem = randomValueFromArray(insertZ);

  newStory = newStory.replace(/:insertx:/g, xItem);
  newStory = newStory.replace(":inserty:", yItem);
  newStory = newStory.replace(":insertz:", zItem);

  if (customName.value !== '') {
    const name = customName.value;
    newStory = newStory.replace("Bob", name);
  }

  if (document.getElementById("uk").checked) {
    const weight = Math.round(300 * 0.0714286) + ' stone';
    const temperature = Math.round((94 - 32) * 5 / 9) + ' centigrade';
    newStory = newStory.replace("94 fahrenheit", temperature);
    newStory = newStory.replace("300 pounds", weight);
  }

  story.textContent = newStory;
  story.style.visibility = 'visible';
}