window.onload = () => {
  const collapsibles = document.getElementsByClassName('collapsible');
  const ids = ['index_cta_text', 'index_people_container', 'index_sponsors', 'index_partners',
    'aboutus_intro', 'aboutus_mission_vision', 'aboutus_leadership', 'aboutus_history',
    'aboutus_workgroups', 'mentor_intro', 'mentor_description', 'mentor_benefits', 'mentor_administration'];
  const names = ['Cta_text', 'People_container', 'Sponsors', 'Partners',
    'Intro', 'Mission-vision', 'Leadership', 'History',
    'Workgroups', 'Intro', 'Description', 'Benefits', 'Administration'];
  // const buttons = document.getElementsByClassName('cmsbutton');
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
  /*
  function fillArea() {
    document.getElementById('currentpage').innerText = name;
    document.getElementById('currentsection').innerText = name;
    document.getElementById('cmshtml').value = value;
    document.getElementById('cmscss').value = css;
  }
  */
  for (let i = 0; i < ids.length; i += 1) {
    document.getElementById(ids[i]).innerHTML = names[i];
    document.getElementById(ids[i]).addEventListener('click', (e) => {
      document.getElementById('currentpage').innerText = e.target.parentNode.className;
      document.getElementById('currentsection').innerText = names[ids.indexOf(e.target.id)];
      const values = e.target.parentNode.id.split('@@@');
      // eslint-disable-next-line prefer-destructuring
      document.getElementById('cmshtml').innerText = values[0];
      // eslint-disable-next-line prefer-destructuring
      document.getElementById('cmscss').innerText = values[1];
      document.getElementById('postform').action = `/admin/cms/update-field/${values[2].toString()}/`;
    });
  }
};
