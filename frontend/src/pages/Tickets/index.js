import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { alpha, makeStyles, styled } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";
import Hidden from "@material-ui/core/Hidden";
import { Button, CircularProgress, InputBase } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from "@material-ui/icons/Search";
import api from "../../services/api";
import { green } from "@material-ui/core/colors";

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
    flexDirection: "column",
    borderWidth: "0 0 2px 0",
    borderStyle : "solid",
    borderColor: "rgb(0,0,0,0.4)",
    padding: "5px 16px",
    cursor: "pointer",
    justifyContent: "center",
  },
  
  circleLoading: {
    color: green[500],
    position: "absolute",
    opacity: "70%",
    top: 0,
    left: "50%",
    marginTop: 12,
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
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadMoreMessages, setLoadMoreMessages] = useState(false);
  const messageRefs = useRef({});
  
  const handleScrollToMessageSelected = (id) => {
    console.log('chegou aqui')
    console.log('id', id)
    if (messageRefs.current[id]) {
    console.log('chegou aqui')
      messageRefs.current[id].scrollIntoView({ behavior: "smooth" });
    } else {
      setLoadMoreMessages(true);
      setTimeout(() => {
        handleScrollToMessageSelected(id);
      }, 1500)
    }
  }

  const handleScrollMessages = (e) => {
    if (!hasMore) return;
    const { scrollTop, scrollHeight } = e.currentTarget;

    if (loading) {
      return;
    }

    if (scrollHeight - scrollTop < 1000) {
      setLoading(true);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      if (searchTerm === "") {
        setMessagesSearched([])
      } else {
        console.log(searchTerm)
        console.log(ticketId)
        api.get(`/messages/${ticketId}/search?q=${searchTerm}&pageNumber=${pageNumber}`).then((response) => {
          setMessagesSearched([...messagesSearched, ...response.data.messages])
          setHasMore(response.data.hasMore)
        });
      }
      setLoading(false);
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, pageNumber, ticketId])
  console.log(pageNumber);
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
                <Ticket setLoadMoreMessages={setLoadMoreMessages} loadMoreMessages={loadMoreMessages} messageRefs={messageRefs} isSearching={isSearching} setIsSearching={setIsSearching} />
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
            <div style={{ overflowY: "scroll"}} onScroll={handleScrollMessages}>
            {messagesSearched.length > 0 && messagesSearched.map((message) => {
              return (
                <div key={message.id} className={classes.messageWrapper} onClick={() => handleScrollToMessageSelected(message.id)}>
                  <p>{message.date}</p>
                  <p>{message.name}:{message.body}</p>
                </div>
              )} 
            )}
            </div>
          { loading && <div>
          <CircularProgress className={classes.circleLoading} />
        </div>}
          </Grid>)}
        </Grid>
      </div>
    </div>
  );
};

export default Chat;
