import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
  MenuItem,
  Box,
  makeStyles
} from "@material-ui/core"
import { ArrowDropDown, Person } from "@material-ui/icons"
import FeedPresence from "./FeedPresence"

import { feedType } from "types/feedType"
import { storeCurrentFeed, getCurrentFeed } from "utils/feedStorage"
import { LIST_FEEDS } from "../queries/feeds"

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    maxWidth: "none",
    flexShrink: 1,
    height: "3rem",
    zIndex: 0
  },
  button: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
    height: "3rem",
    padding: "0 0 0 0",
    zIndex: 0
  },
  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.common.black,
    "& a": {
      color: theme.palette.common.black
    }
  }
}))

const FeedList = React.forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef(null)
  const classes = useStyles()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const currentFeed = props.currentFeed || getCurrentFeed() || {}
  storeCurrentFeed(currentFeed)

  return (
    <Query query={LIST_FEEDS}>
      {({ data, loading, error }) => {
        if (loading || error) {
          return (
            <ul>
              <li>
                <div>LOADING</div>
              </li>
            </ul>
          )
        }

        const { feeds } = data

        return (
          <Paper className={classes.paper} elevation={0} square>
            <ClickAwayListener onClickAway={handleClose}>
              <div>
                <Button
                  className={classes.button}
                  ref={anchorRef}
                  aria-controls="menu-list-grow"
                  aria-haspopup="true"
                  variant="text"
                  onClick={handleToggle}
                >
                  <Box letterSpacing="0.03572em">Listen Live</Box>
                  <ArrowDropDown />
                </Button>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  keepMounted
                  transition
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom"
                      }}
                    >
                      <Paper>
                        <MenuList>
                          {feeds
                            .slice()
                            .reverse()
                            .map((feed, i) => {
                              return (
                                <MenuItem className={classes.menuItem} key={i}>
                                  <Link to={`/${feed.slug}`}>
                                    <span>{feed.name}</span>
                                    <div>
                                      <FeedPresence feed={currentFeed} />
                                    </div>
                                  </Link>
                                </MenuItem>
                              )
                            })}
                        </MenuList>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </ClickAwayListener>
          </Paper>
        )
      }}
    </Query>
  )
})

export default FeedList
