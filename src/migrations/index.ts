import * as migration_20261020_143128_initial from './20261020_143128_initial';

export const migrations = [
  {
    up: migration_20261020_143128_initial.up,
    down: migration_20261020_143128_initial.down,
    name: '20261020_143128_initial'
  },
];
