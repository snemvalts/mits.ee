const cmsFieldsParser = {
  get(cmsFields) {
    let style = ""
    let newCmsFields = {}
    
    // TODO: Separate SCSS to sections and compile SCSS to CSS
    Object.keys(cmsFields).map((key, index) => {
      style = style.concat(cmsFields[key].css + '\n')
    })

    Object.keys(cmsFields).map((key, index) => {
      newCmsFields[key] = cmsFields[key].value
    })
    return [newCmsFields, style]
  },
};

export default cmsFieldsParser;