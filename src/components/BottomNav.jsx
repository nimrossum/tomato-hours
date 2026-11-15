import React from "react"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import ListIcon from "@material-ui/icons/List"
import SettingsIcon from "@material-ui/icons/Settings"
import CodeIcon from "@material-ui/icons/Code"
import EventIcon from "@material-ui/icons/Event"

const actions = [
  <BottomNavigationAction
    key="timer"
    label="Timer"
    icon={<AccessTimeIcon />}
    style={{ minWidth: 0, flex: 1 }}
  />,
  <BottomNavigationAction
    key="calendar"
    label="Week"
    icon={<EventIcon />}
    style={{ minWidth: 0, flex: 1 }}
  />,
  <BottomNavigationAction
    key="sessions"
    label="Sessions"
    icon={<ListIcon />}
    style={{ minWidth: 0, flex: 1 }}
  />,
  <BottomNavigationAction
    key="settings"
    label="Settings"
    icon={<SettingsIcon />}
    style={{ minWidth: 0, flex: 1 }}
  />,
]

if (process.env.NODE_ENV === "development") {
  actions.push(
    <BottomNavigationAction
      key="debug"
      label="Debug"
      icon={<CodeIcon />}
      style={{ minWidth: 0, flex: 1 }}
    />
  )
}

const BottomNav = ({ view, onNavChange }) => (
  <BottomNavigation
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
    }}
    value={view}
    onChange={onNavChange}>
    {actions}
  </BottomNavigation>
)
export default BottomNav
