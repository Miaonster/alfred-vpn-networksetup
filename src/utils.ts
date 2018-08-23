import { spawnSync as spawn } from 'child_process';

const regex = /(\*?)\s(\(.*\))\s.*-.*-.*-.*\s(".*")\s\[\w*\]?/g;

type ConnectedStatus = '(Connected)' | '(Connecting)' | '(Disconnected)';

class Connection {
  constructor(
    public enabled: boolean,
    public readonly status: ConnectedStatus,
    public name: string
  ) {}

  isConnected() {
    return this.status === '(Connected)';
  }
  isConnecting() {
    return this.status === '(Connecting)';
  }
  isDisconnected() {
    return this.status === '(Disconnected)';
  }
}

export function list() {
  let connections: Connection[] = [];
  let result = spawn('scutil', ['--nc', 'list']);
  let lines = result.stdout.toString().split('\n');
  lines.forEach((line, index, arr) => {
    if (index === arr.length - 1 && line === '') {
      return;
    }
    if (line.indexOf('Available') > -1) {
      return;
    }

    let data = regex.exec(line.replace(/\s+/g, ' '));
    if (data) {
      connections.push(
        new Connection(
          data[1] === '*',
          data[2] as ConnectedStatus,
          data[3].replace(/"/g, '')
        )
      );
    }
  });

  return connections;
}

const findByName = (name: string) => {
  return list().find(c => {
    return c.name === name;
  });
};

export const connect = (name: string) =>
  spawn('scutil', ['--nc', 'start', name]);

export const disconnect = (name: string) =>
  spawn('scutil', ['--nc', 'stop', name]);

export const isConnected = (name: string) => {
  let found = findByName(name);
  return found !== undefined && found.isConnected();
};

export const isConnecting = (name: string) => {
  let found = findByName(name);
  return found !== undefined && found.isConnecting();
};
