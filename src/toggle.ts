import { isConnected, isConnecting, connect, disconnect } from './utils';

const name = process.argv.slice(-1)[0];

if (isConnected(name) || isConnecting(name)) {
  disconnect(name);
} else {
  connect(name);
}
