import React, { createContext } from "react";

import useSearch from "../../hooks/useSearch";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
	const { isSearching, loadMoreMessages, messageRefs, searchSmallOpen, setIsSearching, setLoadMoreMessages, setSearchSmallOpen } = useSearch();

	return (
		<SearchContext.Provider
			value={{ isSearching, loadMoreMessages, messageRefs, searchSmallOpen, setIsSearching, setLoadMoreMessages, setSearchSmallOpen }}
		>
			{children}
		</SearchContext.Provider>
	);
};

export { SearchContext, SearchProvider };
