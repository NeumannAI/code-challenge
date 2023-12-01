"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-tailwindcss-select";

function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Home() {
  const [breeds, setBreeds] = useState({});
  const [breedList, setBreedList] = useState([]);
  const [subBreeds, setSubBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState();
  const [breedImage, setBreedImage] = useState(null);

  const getBreedList: any = async () => {
    return axios
      .get("https://dog.ceo/api/breeds/list/all")
      .then((response: { data: any; status: Number }) => response.data.message)
      .catch((_err: any) => {});
  };

  const getImageByBreed: any = async (breed: string) => {
    return axios
      .get(`https://dog.ceo/api/breed/${breed}/images/random`)
      .then((response: { data: any; status: Number }) => response.data.message)
      .catch((_err: any) => {});
  };

  const onBreedSelected = (breed: any) => {
    if (breeds && breeds[breed.value]) {
      setSubBreeds(breeds[breed.value].map((x) => capitalizeFirstLetter(x)));
    }
    getImageByBreed(breed.value).then((image: string) => {
      setBreedImage(image);
    });
    setSelectedBreed(breed);
  };
  useEffect(() => {
    if (breedList.length == 0) {
      getBreedList().then((data: any) => {
        const breedListData: Array<object> = [];

        Object.keys(data).forEach((breed) => {
          breedListData.push({
            label: capitalizeFirstLetter(breed),
            value: breed,
          });
        });

        setBreedList(breedListData);
        setBreeds(data);
      });
    }
  }, [breedList]);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Dog API&nbsp;
        </p>
      </div>
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex mt-5">
        {breedList.length ? (
          <Select
            classNames={{
              menuButton: ({ isDisabled }) =>
                "flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              menu: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              searchBox:
                "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            }}
            value={selectedBreed}
            onChange={onBreedSelected}
            options={breedList}
            isSearchable={true}
          />
        ) : (
          ""
        )}
      </div>
      {subBreeds.length > 0 ? (
        <>
          <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex mt-5">
            <select
              id="sub_breeds"
              defaultValue=""
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {subBreeds.map((subBreed) => (
                <option key={subBreed} value={subBreed}>
                  {subBreed}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex mt-10">
        {breedImage ? (
          <img className="object-fill h-100 w-full" src={breedImage} />
        ) : (
          ""
        )}
      </div>
    </main>
  );
}
