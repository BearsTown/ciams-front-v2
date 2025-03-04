let storage

const getTokenByName = function (type) {
  storage = window.localStorage
  return storage.getItem(type)
}

export default {
  getAccessToken: function () {
    return getTokenByName('access_token')
  },
  getRefreshToken: function () {
    return getTokenByName('refresh_token')
  },
  saveToken: function (token) {
    ;['access_token', 'refresh_token'].forEach((key) => {
      storage.setItem(key, token[key])
    })
  },
  removeToken: function () {
    ;['access_token', 'refresh_token'].forEach((key) => {
      storage.removeItem(key)
    })
  },
}
