import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { alpha, makeStyles, styled } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";
import Hidden from "@material-ui/core/Hidden";
import { Button, InputBase } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from "@material-ui/icons/Search";
import api from "../../services/api";
const useStyles = makeStyles((theme) => ({
  chatContainer: {
    flex: 1,
    // // backgroundColor: "#eee",
    // padding: theme.spacing(4),
    height: `calc(100% - 48px)`,
    overflowY: "hidden",
  },

  chatPapper: {
    // backgroundColor: "red",
    display: "flex",
    height: "100%",
  },

  messageWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },

  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },
  contactsWrapperSmall: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  messagessWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  welcomeMsg: {
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    borderRadius: 0,
  },
  ticketsManager: {},
  ticketsManagerClosed: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
  backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  margin: theme.spacing(0, 2, 0, 2),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 6),
    // vertical padding + font size from searchIcon
    width: '100%',
  },
  width: '100%',
}));

const SearchBar = (props) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon/>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        onChange={props.onChange}
        value={props.value}
      />
    </Search>
  )
}


const Chat = () => {
  const classes = useStyles();
  const { ticketId } = useParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm]  = useState("");
  const [messagesSearched, setMessagesSearched] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm === "") {
        setMessagesSearched([])
      } else {
        console.log(searchTerm)
        console.log(ticketId)
        api.get(`/messages/${ticketId}/search?q=${searchTerm}`).then((response) => setMessagesSearched(response.data));
      }
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])
  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          {/* <Grid item xs={4} className={classes.contactsWrapper}> */}
          {!isSearching && (<Grid
            item
            xs={12}
            md={4}
            className={
              ticketId ? classes.contactsWrapperSmall : classes.contactsWrapper
            }
          >
            <TicketsManager />
          </Grid>)}
          <Grid item xs={12} md={8} className={classes.messagessWrapper}>
            {/* <Grid item xs={8} className={classes.messagessWrapper}> */}
            {ticketId ? (
              <>
                <Ticket isSearching={isSearching} setIsSearching={setIsSearching} />
              </>
            ) : (
              <Hidden only={["sm", "xs"]}>
                <Paper className={classes.welcomeMsg}>
                  {/* <Paper square variant="outlined" className={classes.welcomeMsg}> */}
                  <span>{i18n.t("chat.noTicketMessage")}</span>
                </Paper>
              </Hidden>
            )}
          </Grid>
          {isSearching && (<Grid
            item
            xs={12}
            md={4}
            className={classes.contactsWrapper}
          >
            <div style={ {display: "flex"}}>
              <Button onClick={() => setIsSearching(false)}><CloseIcon/></Button>
              <h1>Pesquisar mensagens</h1>
            </div>
            <SearchBar onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
            {messagesSearched.length > 0 && messagesSearched.map((message) => {
              return (
                <div key={message.id} className={classes.messageWrapper}>
                  <p>{message.date}</p>
                  <p>{message.name}:{message.body}</p>
                </div>
              )} 
            )}
          </Grid>)}
        </Grid>
      </div>
    </div>
  );
};

export default Chat;
