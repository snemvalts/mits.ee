import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8080/cms/values' : '/cms/values';

const cmsFieldsGetter = {
  index:
    axios.get(endpoint, {
      params: {
        keys: JSON.stringify(['cta_text', 'people_container', 'sponsors', 'partners']),
      },
    }).then((fieldsResponse) => fieldsResponse.data),
  get(template) {
    switch (template) {
      case '/':
        return this.index;
      default:
        return null;
    }
  },
};

module.exports = cmsFieldsGetter;
