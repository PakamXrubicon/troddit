import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import Post from "./Post";
import Sort from "./Sort";
import axios from "axios";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { b2a } from "../accessToken";
import Snoowrap from "snoowrap";
import { getSession } from "next-auth/client";
import { getToken } from "next-auth/jwt";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/client";
//import { fetchFrontPage } from "../redditapi/frontpage";

const Feed = ({ subreddits, sort, range, isUser }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState("");
  const [subURL, setSubURL] = useState("");
  const BASE_URL = "https://www.reddit.com";

  let componentMounted = true;

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1280: 2,
    767: 1,
  };

  // let subUrl         = (sub == "" ) ? "" : "/r/"+sub;
  // let limitUrl     = "limit=" + limit;
  // let afterUrl     = (after == null) ? "" : "&after="+after;
  // let countUrl     = (count == 0) ? "" : "&count="+count;
  // let url = "https://www.reddit.com" + subUrl + "/" + sortType + "/.json?" + sortUrl + "&" + limitUrl + afterUrl + countUrl;
  useEffect(() => {
    initialize();
    return () => {
      setPosts([]);
      setAfter("");
      componentMounted = false;
    };
  }, [subreddits, sort, subURL]);

  const initialize = async () => {
    await configureURL();
    console.log(
      `${BASE_URL}/${subURL}/${sort}/.json?t=${range}&after=${after}&count=${posts.length}`
    );
    if (!subURL.includes("undefined")) {
      fetchPage();
    }
  };
  const configureURL = async () => {
    if (isUser) {
      console.log(">>>", `u/${subreddits}`);
      componentMounted ? setSubURL(`u/${subreddits}`) : "";
    } else {
      componentMounted ? setSubURL(`r/${subreddits}`) : "";
    }
  };

  const fetchPage = async () => {
    subreddits
      ? axios
          .get(
            `${BASE_URL}/${subURL}/${sort}/.json?t=${range}&after=${after}`,
            {
              params: {
                raw_json: 1,
              },
            }
          )
          .then((response) => {
            //console.log(response);
            const posts = [];
            response.data.data.children.forEach((post) => {
              posts.push(post.data);
            });
            console.log(response.data.data);
            if (componentMounted) {
              setAfter(response.data.data.after);
              setPosts(posts);
              setLoading(false);
            }
            //console.log(posts);
            //posts.map(post => (console.log(post[0].title)));
          })
          .catch((err) => console.log(err))
      : "";
  };

  const loadmore = () => {
    setLoadingMore(true);
    //console.log(after);
    axios
      .get(
        `${BASE_URL}/${subURL}/${sort}/.json?t=${range}&after=${after}&count=${posts.length}`,
        {
          params: { raw_json: 1 },
        }
      )
      .then((response) => {
        response.data.data.children.forEach((post) => {
          posts.push(post.data);
        });

        if (componentMounted) {
          setAfter(response.data.data.after);
          setPosts(posts);
          setLoadingMore(false);
        }
        //posts.map(post => (console.log(post[0].title)));
      });
  };

  if (loading) {
    return <section>Loading...</section>;
  }
  return (
    <section>
      <Sort />
      <h1>Posts</h1>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadmore}
        hasMore={after ? true : false}
        loader={<h1>Loading More..</h1>}
        endMessage={
          <p className="text-align-center">
            <b>You have reached the end</b>
          </p>
        }
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((post, i) => (
            <Post key={`${post.id}_${i}`} post={post} />
          ))}
        </Masonry>
      </InfiniteScroll>
      <button onClick={loadmore}>Load More</button>
    </section>
  );
};

export default Feed;