import { spawnSync as spawn } from 'child_process';

type ConnectedStatus = 'Connected' | 'Connecting' | 'Disconnected';

class Connection {
  constructor(
    public enabled: boolean,
    public readonly status: ConnectedStatus,
    public name: string
  ) {}

  isConnected() {
    return this.status === 'Connected';
  }
  isConnecting() {
    return this.status === 'Connecting';
  }
  isDisconnected() {
    return this.status === 'Disconnected';
  }
}

const regex = /(\*?)\s+\((Connected|Connecting|Disconnected)\)\s+.*-.*-.*-.*\s+"(.*)"\s+\[[\w:]*\]?/;
export function list(): Connection[] {
  return (spawn('scutil', ['--nc', 'list'])
    .stdout.toString()
    .trim()
    .split(/\n/g)
    .slice(1)
    .map(line => {
      const parts = regex.exec(line);
      if (!parts) {
        return null;
      }
      return new Connection(
        parts[1] === '*',
        parts[2] as ConnectedStatus,
        parts[3]
      );
    })
    .filter(c => c != null) as Connection[]).sort(
    (c1: Connection, c2: Connection) => {
      const n1 = c1.name.toUpperCase();
      const n2 = c2.name.toUpperCase();
      return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    }
  );
}

const findByName = (name: string) => {
  return list().find(c => {
    return c.name === name;
  });
};

export const connect = (name: string) =>
  spawn('networksetup', ['-connectpppoeservice', name]);

export const disconnect = (name: string) =>
  spawn('networksetup', ['-disconnectpppoeservice', name]);

export const isConnected = (name: string) => {
  let found = findByName(name);
  return found !== undefined && found.isConnected();
};

export const isConnecting = (name: string) => {
  let found = findByName(name);
  return found !== undefined && found.isConnecting();
};
