import Head from "next/head";
import React from "react";
import MainGui from "../components/Gui";
import { calculateAllSalaires } from "../core";
import { SalairesDict } from "../models";

interface HomeProps {
  salairesDict: SalairesDict
}

export default function Home({salairesDict}: HomeProps) {
  return (
    <>
      <Head>
        <title>Simulateur de SASU</title>
      </Head>
      <MainGui salairesDict={salairesDict}/>
    </>
  );
}

function getCachedSalairesDict() {
  const fs = require('fs')
  const file = './salaires.json';

  if (fs.existsSync(file)) {
    const salaireDictJson = fs.readFileSync(file);
    const salaireDict = JSON.parse(salaireDictJson);
    return salaireDict;
  }

  const salaireDict = calculateAllSalaires()
  const salaireDictJson = JSON.stringify(salaireDict)
  fs.writeFileSync(file, salaireDictJson)
  return salaireDict;
}

export async function getStaticProps(): Promise<{ props: HomeProps }> {

  return {
    props: {
      salairesDict: getCachedSalairesDict()
    }
  }
}