import { Button, CircularProgress, Grid, InputBase, alpha, makeStyles, styled } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { green } from '@material-ui/core/colors';
import SearchIcon from "@material-ui/icons/Search";
import api from "../../services/api";

const useStyle = makeStyles((theme) => ({
  searchWrapperSmallOpen: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
    position: "absolute",
    width: "320px",
    flexShrink: 0,
    right: 0,
    backgroundColor: "rgb(214, 214, 214)",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  
  searchWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },

  circleLoading: {
    color: green[500],
    marginTop: 20,
    borderWidth: 0,
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
}))

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

const SearchMessages = ({setIsSearching, setLoadMoreMessages,searchSmallOpen, setSearchSmallOpen, messageRefs, ticketId}) => {
  const classes = useStyle();
  const [searchTerm, setSearchTerm]  = useState("");
  const [messagesSearched, setMessagesSearched] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false)
  const [resetSearch, setResetSearch] = useState(false);


  const handleScrollToMessageSelected = (id) => {
    if (searchSmallOpen) {
      setIsSearching(false);
      setSearchSmallOpen(false);
    }
    if (messageRefs.current[id]) {
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
      if (resetSearch) {
        setMessagesSearched([])
        setResetSearch(false);
      } 
      if (searchTerm === "") {
        setLoading(false)
        return
      }
      api.get(`/messages/${ticketId}/search?q=${searchTerm}&pageNumber=${pageNumber}`).then((response) => {
        setMessagesSearched((prevMessagesSearched) => [...prevMessagesSearched, ...response.data.messages])
        setHasMore(response.data.hasMore)
      });
      setLoading(false);
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, pageNumber, ticketId])

  useEffect(() => {
    setResetSearch(true);
    setPageNumber(1);
  }, [searchTerm, ticketId])
  return (
    <Grid
            item
            xs={12}
            md={4}
            className={ searchSmallOpen ? classes.searchWrapperSmallOpen : classes.searchWrapper}
          >
            <div style={ {display: "flex"}}>
              <Button onClick={() => setIsSearching(false)}><CloseIcon/></Button>
              <h3>Pesquisar mensagens</h3>
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
            { loading && <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress className={classes.circleLoading} />
            </div>}
    </Grid>
  )
}

export default SearchMessages