import Article from '../models/article';
import Event from '../models/event';
import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8080/cms/values' : '/cms/values';

const fields = {
    index: [Article.find({}).sort({ date: -1 }).limit(3).populate('author'),
        Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }),
        axios.get(endpoint, {
            params: {
                keys: JSON.stringify(['cta_text', 'people_container', 'sponsors', 'partners']),
            },
        }).then((fieldsResponse) => {
            return(fieldsResponse.data)
        })
    ],
    events: [Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }),
        Event.find({ date: { $lte: new Date() } }).limit(9).sort({ date: -1 })
    ],
    get(template) {
        switch (template) {
            case '/':
                return this.index;
            case '/events':
                return this.events;
            default:
                return null;
        }
    }
}

module.exports = fields;