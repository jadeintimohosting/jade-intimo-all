export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15*24*60*60*1000,
    path:"/"
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  get: (req, name) => {
    return req.cookies[name];
  },
};
