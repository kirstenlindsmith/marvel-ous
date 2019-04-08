import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_FAVORITES = 'GET_FAVORITES'
const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES'
const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES'

/**
 * INITIAL STATE
 */
const defaultFavorites = {}

/**
 * ACTION CREATORS
 */
const getFavorites = favorites => ({type: GET_FAVORITES, favorites})
const addToFavorites = newFavorite => ({type: ADD_TO_FAVORITES, newFavorite})
const removeFromFavorites = characterId => ({type: REMOVE_FROM_FAVORITES, characterId})

/**
 * THUNK CREATORS
 */

export const fetchFavorites = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/favorites')

      dispatch(getFavorites(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const addFavorite = (characterId, character) => {
  return async dispatch => {
    try {
      await axios.post('/api/favorites', characterId)

      dispatch(addToFavorites(character))
    } catch (error) {
      console.error(error)
    }
  }
}

export const deleteFavorite = (characterId) => {
  return async dispatch => {
    try {
      await axios.delete(`/api/favorites/${characterId}`)

      dispatch(removeFromFavorites(characterId))
    } catch (error) {
      console.error(error)
    }
  }
}


/**
 * REDUCER
 */
export default function(state = defaultFavorites, action) {
  switch (action.type) {
    case GET_FAVORITES:
      return action.favorites
    case ADD_TO_FAVORITES: {
      return {...state, favorites: [...state.favorites, action.newFavorite]}
    }
    case REMOVE_FROM_FAVORITES: {
      const favorites = state.favorites.filter(
        item => item.id !== action.characterId
      )
      return {...state, favorites}
    }
    default:
      return state
  }
}
