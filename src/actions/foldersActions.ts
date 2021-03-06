// import { _getFolders } from '../utils/_DATA'
import { _fetch } from '../utils/api'

import type * as type from '../types/Gmail'

// Define action constants
export const GET_FOLDERS = 'GET_FOLDERS'
export const GET_FOLDERS_SUCCESS = 'GET_FOLDERS_SUCCESS'
export const GET_FOLDERS_FAILURE = 'GET_FOLDERS_FAILURE'

// Create Redux action creators that return an action
export const getFolders = () => ({
  type: GET_FOLDERS,
})

export const getFoldersSuccess = (folders: type.Folders) => ({
  type: GET_FOLDERS_SUCCESS,
  payload: folders,
})

export const getFoldersFailure = () => ({
  type: GET_FOLDERS_FAILURE,
})

// Combine them all in an asynchronous thunk
export function fetchFolders() {
  return async (dispatch: any) => {
    dispatch(getFolders())

    try {
      const response = await _fetch('/folders')
      const data: type.Folders = await response.json()

      dispatch(getFoldersSuccess(data))
    } catch (error) {
      console.error(error)
      dispatch(getFoldersFailure())
    }
  }
}
