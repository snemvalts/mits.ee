const sass = require('node-sass');
const sectionSCSSWrappers = require('./sectionSCSSWrappers.js');

const cmsFieldsParser = {
  get(cmsFields) {
    let scss = '';
    const newCmsFields = {};

    Object.keys(cmsFields).forEach((key) => {
      scss = scss.concat(sectionSCSSWrappers.values[key], cmsFields[key].css, '\n', '}');
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
