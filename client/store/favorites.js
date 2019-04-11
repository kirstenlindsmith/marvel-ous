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
const defaultFavorites = []

/**
 * ACTION CREATORS
 */
const getFavorites = favorites => ({type: GET_FAVORITES, favorites})
const addToFavorites = newFavorite => ({type: ADD_TO_FAVORITES, newFavorite})
const removeFromFavorites = name => ({type: REMOVE_FROM_FAVORITES, name})

/**
 * THUNK CREATORS
 */
export const fetchFavorites = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/favorites')
      const favorites = data.map(fave=> {
        return fave.name
      })
      dispatch(getFavorites(favorites))
    } catch (error) {
      console.error('Error fetching favorites from the database:', error)
    }
  }
}

export const addFavorite = (name) => {
  return async dispatch => {
    try {
      await axios.post('/api/favorites', {name})

      dispatch(addToFavorites(name))
    } catch (error) {
      console.error('Error adding new favorite:', error)
    }
  }
}

export const deleteFavorite = (name) => {
  return async dispatch => {
    try {
      await axios.delete(`/api/favorites/${name}`)

      dispatch(removeFromFavorites(name))
    } catch (error) {
      console.error('Error deleting favorite:', error)
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
      return [...state, action.newFavorite]
    }
    case REMOVE_FROM_FAVORITES: {
      const favorites = state.filter(
        item => item !== action.name
      )
      return favorites
    }
    default:
      return state
  }
}
