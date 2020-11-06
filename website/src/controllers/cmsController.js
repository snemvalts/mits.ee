import CMSField from '../models/cmsfield';

/* GET cms fields based on keys */
export default (req, res, next) => {
  const cmsKeys = JSON.parse(req.query.keys);
  CMSField.find().where('key').in(cmsKeys)
    .exec((err, fields) => {
      if (err) return next(err);
      const mappedFields = fields
        .map((field) => ({ key: field.key, value: field.value, css: field.css }))
        .reduce((acc, field) => ({
          ...acc,
          [field.key]: { value: field.value, css: field.css || '' },
        }), {});

      return res.json(mappedFields);
    });
};
