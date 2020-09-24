window.onload = () => {
  const collapsibles = document.getElementsByClassName('collapsible');
  // for (const collapsible of collapsibles) {
  //   collapsible.children[0].onclick = () => {
  //     collapsible.classList.toggle('collapsed');
  //   };
  // }
  Object.keys(collapsibles).forEach((collapsible) => {
    // eslint-disable-next-line no-param-reassign
    collapsible.children[0].onclick = () => {
      collapsible.classList.toggle('collapsed');
    };
  });
};
