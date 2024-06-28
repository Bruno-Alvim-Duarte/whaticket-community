import { useRef, useState } from "react";

const useSearch = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchSmallOpen, setSearchSmallOpen] = useState(false);
    const [loadMoreMessages, setLoadMoreMessages] = useState(false);
    const messageRefs = useRef({});

    return { searchSmallOpen, setSearchSmallOpen, loadMoreMessages, setLoadMoreMessages, messageRefs, isSearching, setIsSearching}
}

export default useSearch