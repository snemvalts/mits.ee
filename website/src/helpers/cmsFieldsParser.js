const sass = require('node-sass');

const cmsFieldsParser = {
  get(cmsFields) {
    let scss = '';
    const newCmsFields = {};

    const sectionSCSSWrappers = {
      index_cta_text: 'header#landing {',
      index_people_container: 'section#description {',
      index_sponsors: 'section#sponsors {',
      index_partners: 'section#sponsors {',
      aboutus_intro: 'section#aboutlanding {',
      aboutus_mission_vision: 'section#description {',
      aboutus_leadership: 'section#juhatus {',
      aboutus_history: 'section#history {',
      aboutus_workgroups: 'section#teams {',
      mentor_intro: 'section#mentorlanding {',
      mentor_description: 'section#mentor2 {',
      mentor_benefits: 'section#mentor3 {',
      mentor_administration: 'section#mentor4 {',
    };

    Object.keys(cmsFields).forEach((key) => {
      scss = scss.concat(sectionSCSSWrappers[key], cmsFields[key].css, '\n', '}');
    });

    const style = sass.renderSync({
      data: scss,
    });

    Object.keys(cmsFields).forEach((key) => {
      newCmsFields[key] = cmsFields[key].value;
    });

    return [newCmsFields, style.css];
  },
};

export default cmsFieldsParser;
