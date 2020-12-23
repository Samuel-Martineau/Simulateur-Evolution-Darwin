import SimulatorWorker from 'worker-loader!./simulator/worker.ts';
import * as sapper from '@sapper/app';

sapper.start({
  target: document.querySelector('body'),
});

const simulatorWorker = new SimulatorWorker() as DedicatedWorkerGlobalScope;
