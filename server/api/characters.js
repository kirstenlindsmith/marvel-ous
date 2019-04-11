const AuthKeys = require('../../secrets')
const marvelURL = 'https://gateway.marvel.com/v1/public/'
const apiKey = AuthKeys.MarvelAPIKey
const pubKey = AuthKeys.MarvelPubKey
import axios from 'axios'
import md5 from 'md5'
const time = (new Date()).getTime()
const hash = md5(time+apiKey+pubKey)

const getMarvelCharacters = async (options) => {
  const {
    offset,
    name,
    exactMatch,
    sortName,
    limit,
  } = Object.assign({ //default values
    offset: 0,
    name: '',
    exactMatch: false,
    sortName: '',
    limit: 20,
  }, options); //override defaults with supplied options


  //format: http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150

  let url =
    `${marvelURL}characters?ts=${time}&apikey=${pubKey}&hash=${hash}&offset=${offset}&orderBy=${sortName}name&limit=${limit}`

  if (name) {
    if (exactMatch) { url += `&name=${name}`; }
    else { url += `&nameStartsWith=${name}`; }
  }

  try {
    const response = await axios.get(url)
    const responseBody = response.data
    if (response.status === 200) {
      if (offset > responseBody.data.total) {
        throw new Error('Sorry! Page does not exist!')
      } else {
        const pages = Math.floor(responseBody.data.total / limit)
        return {
          characters: responseBody.data.results,
          maxPage: responseBody.data.total % limit > 0 ? pages+1 : pages
        }
      }
    } else {
      throw new Error(`The Marvel API sent a bad response! Status code ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    return {
      characters: [],
      maxPage: 0
    }
  }
}

const getFavoriteCharacter = async (options) => {
  const {
    offset,
    name,
    exactMatch,
    sortName,
    limit,
  } = Object.assign({
    offset: 0,
    name: '',
    exactMatch: false,
    sortName: '',
    limit: 1,
  }, options);


  //format: http://gateway.marvel.com/v1/public/comics?ts=TIMESTAMP&apikey=MARVELPUBLICKEY&hash=GENHASH

  let url =
    `${marvelURL}characters?ts=${time}&apikey=${pubKey}&hash=${hash}&offset=${offset}&orderBy=${sortName}name&limit=${limit}`

  if (name) {
    if (exactMatch) { url += `&name=${name}`; }
    else { url += `&nameStartsWith=${name}`; }
  }

  try {
    const response = await axios.get(url)
    const responseBody = response.data
    if (response.status === 200) {
      return responseBody.data.results[0]
    } else {
      throw new Error(`The Marvel API sent a bad response! Status code ${response.status}`)
    }
  } catch (error) {
    console.error('Error pulling favorite from Marvel db:', error)
    return {}
  }
}

export {
  getMarvelCharacters,
  getFavoriteCharacter
}
