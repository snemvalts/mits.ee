window.onload = () => {
    const collapsibles = document.getElementsByClassName("collapsible");
    for (let collapsible of collapsibles) {
        collapsible.children[0].onclick = () => {
            collapsible.classList.toggle("collapsed");
        }
    }
};