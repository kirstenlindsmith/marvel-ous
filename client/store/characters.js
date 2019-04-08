import axios from 'axios'
import {exampleCharacter} from '../utils'

/**
 * ACTION TYPES
 */
const GET_CHARACTER = 'GET_CHARACTER'
const GET_ALL_CHARACTERS = 'GET_ALL_CHARACTERS'

/**
 * INITIAL STATE
 */
const defaultCharacters = {
  allCharacters: [],
  selectedCharacter: exampleCharacter
}

/**
 * ACTION CREATORS
 */
const getOneCharacter = character => ({type: GET_CHARACTER, character})
const getAllCharacters = characters => ({type: GET_ALL_CHARACTERS, characters})

/**
 * THUNK CREATORS
 */

export const fetchAllCharacters = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/characters')
      dispatch(getAllCharacters(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchOneCharacter = characterId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/characters/${characterId}`)
      dispatch(getOneCharacter(data))
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * REDUCER
 */
export default function(state = defaultCharacters, action) {
  switch (action.type) {
    case GET_CHARACTER:
      return {...state, selectedCharacter: action.character}
    case GET_ALL_CHARACTERS:
      return {...state, allCharacters: action.characters}
    default:
      return state
  }
}
