export const isParamEmpty = (req, param, inBody = false) => {
  inBody ? req.checkBody(param).exists() : req.checkParams(param).exists();
  return req.validationErrors();
}

export const errors = {
  userId: 'UserId was not sent with request.'
}