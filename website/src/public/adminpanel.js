// import cmsFieldsGetter from "../helpers/cmsFieldsGetter";

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
  // const buttons = document.getElementsByClassName('cmsbutton');
  // const cmsfields = cmsFieldsGetter.get();
  Object.keys(collapsibles).forEach((collapsible) => {
    // eslint-disable-next-line no-param-reassign
    collapsible.children[0].onclick = () => {
      collapsible.classList.toggle('collapsed');
    };
  });
  for (let i = 0; i < ids.length; i += 1) {
    document.getElementById(ids[i]).innerHTML = names[i];
  }
  /*
  for (let i = 0; i < buttons.length; i += 1) {
    buttons.item(i).innerHTML = buttons.item(i).innerHTML.replace('index_', '')
      .replace('aboutus_', '').replace('mentor_', '');
  }
  function fillArea(value, css) {
    document.getElementById('cmshtml').value = value;
    document.getElementById('cmscss').value = css;
  }
  document.getElementById('people_container').addEventListener('click', fillArea('0', '1'));
  document.getElementById('people_container').addEventListener('click', fillArea('0', '1'));
  */
};