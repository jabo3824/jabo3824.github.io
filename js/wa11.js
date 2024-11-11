
const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');



const images = ['Bart-Allen.jpg', `Jay-Garrick.png`, `Wally-West.jpg`, `Sleeping-Roommate.jpg`, `chris.jpg`];
const alts = {
  'Bart-Allen.jpg' : 'Bart Allen',
  'Jay-Garrick.png' : 'Jay Garrick',
  'Wally-West.jpg' : 'Wally West',
  'Sleeping-Roommate.jpg' : 'Sleeping Roommate',
  'chris.jpg' : 'Chris'
}

for (const image of images) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `/img/${image}`);
    newImage.setAttribute('alt', alts[image]);
    thumbBar.appendChild(newImage);
  
    newImage.addEventListener('click', e => {
    
      const tempSrc = displayedImage.src;
      const tempAlt = displayedImage.alt;
  
      displayedImage.src = e.target.src;
      displayedImage.alt = e.target.alt;
  
      e.target.src = tempSrc;
      e.target.alt = tempAlt;
    });
  }
  
 
  btn.addEventListener('click', () => {
    const btnClass = btn.getAttribute('class');
    if (btnClass === 'dark') {
      btn.setAttribute('class', 'light');
      btn.textContent = 'Lighten';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    } else {
      btn.setAttribute('class', 'dark');
      btn.textContent = 'Darken';
      overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  });