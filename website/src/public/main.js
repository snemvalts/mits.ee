function resizeNavbar() {
  const navlogo = document.getElementById('navlogo');
  if (window.scrollY < 10) {
    navlogo.style.height = '5rem';
    navlogo.style.width = '9rem';
  } else {
    navlogo.style.height = '4rem';
    navlogo.style.width = '6rem';
  }
}

// https://css-tricks.com/restart-css-animation/
function restartLogoAnimation() {
  const element = document.getElementById('animatedlogo');
  const newElement = element.cloneNode(true);
  newElement.onclick = restartLogoAnimation;
  element.parentNode.replaceChild(newElement, element);
}

window.onload = () => {
  // const navbar = document.getElementById('navbar');
  const menuButton = document.getElementById('menubutton');
  const right = document.getElementById('right');

  /* Menu toggle with button */
  menuButton.onclick = () => {
    if (right.style.height === '0px' || !right.style.height) {
      right.style.height = '50vh';
    } else {
      right.style.height = '0px';
    }
  };

  /* Make navbar bigger if at top */
  resizeNavbar();
  window.onscroll = resizeNavbar;

  /* Restart logo animation by clicking it */
  const animatedLogo = document.getElementById('animatedlogo');
  animatedLogo.onclick = restartLogoAnimation;
};
