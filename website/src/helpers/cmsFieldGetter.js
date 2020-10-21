import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8080/cms/values' : '/cms/values';

const fetchCMSKeys = (keys) => axios.get(endpoint, {
  params: {
    keys: JSON.stringify(keys),
  },
}).then((fieldsResponse) => fieldsResponse.data);

const cmsFieldsGetter = {
  index: fetchCMSKeys(['cta_text', 'people_container', 'sponsors', 'partners']),
  about: fetchCMSKeys(['aboutus_intro', 'aboutus_mission_vision', 'aboutus_leadership', 'aboutus_history', 'aboutus_workgroups']),

  get(request) {
    switch (request.path) {
      case '/':
        return this.index;
      case '/meist':
        return this.about;
      default:
        return Promise.reject(new Error('cannot find CMS fields'));
    }
  },
};

export default cmsFieldsGetter;
