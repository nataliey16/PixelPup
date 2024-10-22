import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download, logoShirt, stylishShirt } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  FilePicker,
  CustomButton,
  Tab,
} from "../components";

const Customizer = () => {
  //check if we are not in the home page. We snapshot to keep track of our state
  const snap = useSnapshot(state);

  //file uploader
  const [file, setFile] = useState("");
  //the AI prompt
  const [prompt, setPrompt] = useState("");
  //loading state if img is generating
  const [generatingImg, setGeneratingImg] = useState(false);
  //which are we changing - file, ai or shirt design
  const [activeEditorTab, setActiveEditorTab] = useState("");
  //trigger show logo or full shirt
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  //show tab content depending on the one thats active

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return null;
    }
  };

  //type - logo or full texture
  const handleSubmit = async (type) => {
    if (!prompt) {
      return alert("Please enter a prompt");
    }

    try {
      //call backend to generate an ai image
      setGeneratingImg(true);
      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data); // Log the response

      if (!data.photo) {
        throw new Error("Photo data is missing in the response");
      }
      //update the logo or full shirt
      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  //type - fullTexture or logo
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    //updates the store state in index.js
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;

      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    //once state is set, set active filter tab to update UI

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  //Takes type of file, pass it to this function to get file data

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro &&
        !snap.showcase &&
        snap.customize && ( // If not in the home, show customizer page
          <>
            <motion.div
              key="custom"
              className="absolute top-0 left-0 z-10"
              {...slideAnimation("left")}
            >
              <div className="flex items-center min-h-screen">
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => setActiveEditorTab(tab.name)}
                    />
                  ))}
                  {generateTabContent()}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute z-10 top-5 right-5"
              {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Go back"
                handleClick={() => {
                  state.intro = true;
                  state.customize = false;
                  state.showcase = false;
                }}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
              <CustomButton
                type="filled"
                title="Show Case"
                handleClick={() => {
                  state.intro = false;
                  state.customize = false;
                  state.showcase = true;
                }}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            <motion.div
              className="filtertabs-container"
              {...slideAnimation("up")}
            >
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => {
                    handleActiveFilterTab(tab.name);
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
};

export default Customizer;
