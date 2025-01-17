import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsFilterRight } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import ToggleTheme from "./ToggleTheme";
import ToggleNSFW from "./ToggleNSFW";
import ToggleAutoplay from "./ToggleAutoplay";
import Link from "next/link";
import { useMainContext } from "../MainContext";
import ToggleMediaOnly from "./ToggleMediaOnly";
import ToggleAudioOnHover from "./ToggleAudioOnHover";
import ToggleFilters from "./ToggleFilters";
import FilterModal from "./FilterModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FilterMenu = ({ hide = false }) => {
  const context: any = useMainContext();
  const [openFilter, setOpenFilter] = useState(0);
  const [active, setActive] = useState(false);
  const [deg, setDeg] = useState(0);
  const [degIntervalID, setDegIntervalID] = useState<any>();
  useEffect(() => {
    let {
      imgFilter,
      vidFilter,
      selfFilter,
      galFilter,
      linkFilter,
      imgPortraitFilter,
      imgLandscapeFilter,
    } = context;
    if (
      !imgFilter ||
      !vidFilter ||
      !selfFilter ||
      !galFilter ||
      !linkFilter ||
      !imgPortraitFilter ||
      !imgLandscapeFilter
    ) {
      //console.log("active");
      setActive(true);
    } else {
      setActive(false);
    }
    return () => {
      setActive(false);
    };
  }, [context]);

  useEffect(() => {
    if (active) {
      let updateDeg = () => {
        setDeg((d) => (d += 4));
      };

      setDegIntervalID((id) => {
        clearInterval(id);
        return setInterval(updateDeg, 10);
      });
    } else {
      clearInterval(degIntervalID);
    }
    return () => {
      clearInterval(degIntervalID);
    };
  }, [active]);

  return (
    <>
      <FilterModal toOpen={openFilter} />
      <button
        title={"filters"}
        className={
          "relative flex flex-col items-center flex-grow w-full h-full select-none"
        }
        onClick={(e) => {
          e.preventDefault();
          setOpenFilter((o) => o + 1);
        }}
      >
        <div
          className={
            "flex flex-row items-center justify-center w-full h-full bg-white  rounded-md  dark:bg-darkBG dark:border-darkBG focus:outline-none" +
            (active
              ? " z-10 scale-90"
              : " border border-white hover:border-lightBorder dark:hover:border-darkBorder")
          }
        >
          <FiFilter
            className={"flex-none " + (active ? " w-6 h-6 " : " w-5 h-5 ")}
          />
        </div>
        {active && (
          <div
            className="absolute z-0 w-full h-full rounded-md"
            style={{
              backgroundImage: `linear-gradient(${deg}deg, rgb(96, 165, 250), rgb(255, 255, 255))`,
            }}
          ></div>
        )}
      </button>
    </>
  );
};

export default FilterMenu;
