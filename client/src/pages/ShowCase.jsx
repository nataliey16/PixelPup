import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import { fadeAnimation, slideAnimation } from "../config/motion";

import { Card, FormField, Loader } from "../components";

//global - for reusability
const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const ShowCase = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPost] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      } else {
        const errorData = await response.json();
        console.error("Error fetching posts:", errorData.message);
        alert("Error fetching posts: " + errorData.message);
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AnimatePresence>
      {!snap.intro &&
        !snap.customize &&
        snap.showcase && ( // if not in home, show ShowCase page
          <>
            <motion.div
              key="custom"
              className="absolute top-0 left-0 z-10"
              {...slideAnimation("left")}
            >
              <section className="max-w-7xl mx-auto">
                <div>
                  <h1 className="font-extrabold text-[#222328] text-[32px]">
                    Your AI generated images showcase:{" "}
                  </h1>
                  <p className="mt-2 text-[#66e75] text-[16px] max-w-[500px]">
                    Browse through a collection of imaginative and visually
                    stunning images generates by DALL-E AI
                  </p>
                </div>
                <div className="mt-16">
                  <FormField />
                </div>
                <div className="mt-10">
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <Loader />
                      {/* <h1>hello</h1> */}
                    </div>
                  ) : (
                    <>
                      {searchText && (
                        <h2 className="font-medium text-[#666e75] text-xl mb-3">
                          Showing results for{" "}
                          <span className="text-[#222328]"> {searchText}</span>
                        </h2>
                      )}
                      <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-col2 grid-cols-1 gap-3">
                        {searchText ? (
                          <RenderCards
                            data={[]}
                            title="No search results found"
                          />
                        ) : (
                          <RenderCards data={allPosts} title="No posts found" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
};

export default ShowCase;
