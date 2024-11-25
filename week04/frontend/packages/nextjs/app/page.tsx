"use client";

import type { NextPage } from "next";
import BallotContract from "~~/components/BallotContract";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8 text-4xl">Contract ballot dApp Week 4 homework</h1>
          <BallotContract></BallotContract>
        </div>
      </div>
    </>
  );
};
export default Home;
