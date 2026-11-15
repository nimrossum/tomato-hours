import { combineReducers } from 'redux'
import settings from './settings'
import sessions from './sessions'
import calendar from './calendar'

export default combineReducers({ sessions, settings, calendar })
