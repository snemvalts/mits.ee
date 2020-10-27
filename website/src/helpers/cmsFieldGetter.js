import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8080/cms/values' : '/cms/values';

const fetchCMSKeys = (keys) => axios.get(endpoint, {
  params: {
    keys: JSON.stringify(keys),
  },
}).then((fieldsResponse) => fieldsResponse.data);

const cmsFieldsGetter = {
  index: () => fetchCMSKeys(['index_cta_text', 'index_people_container', 'index_sponsors', 'index_partners']),
  about: () => fetchCMSKeys(['aboutus_intro', 'aboutus_mission_vision', 'aboutus_leadership', 'aboutus_history', 'aboutus_workgroups']),
  mentor: () => fetchCMSKeys(['mentor_intro', 'mentor_description', 'mentor_benefits', 'mentor_administration']),
  get(request) {
    switch (request.path) {
      case '/':
        return this.index();
      case '/meist':
        return this.about();
      case '/mentor':
        return this.mentor();
      default:
        return Promise.reject(new Error('cannot find CMS fields'));
    }
  },
};

export default cmsFieldsGetter;
