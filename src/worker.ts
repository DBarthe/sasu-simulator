
import { expose } from 'comlink'
import { runSimulation } from './core'


const workerApi = {
  run: runSimulation
}

export type WorkerApi = typeof workerApi

expose(workerApi)
