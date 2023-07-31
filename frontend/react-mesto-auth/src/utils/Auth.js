class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl
    this.headers = headers;
  }

  _checkRes(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Error ${res.status}`)
  }

  register(data) {
    return fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(this._checkRes)
  }

  login(data) {
    return fetch(`${this.baseUrl}/signin`, {
      method: "POST",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(data)
    })
      .then(this._checkRes)
  }

  checkToken(jwt) {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(this._checkRes)
  }
}

export const auth = new Auth({
  baseUrl: 'https://api.killa.students.nomoredomains.xyz',
  headers: {
    'Content-Type': 'application/json'
  }
})