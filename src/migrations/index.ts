import * as migration_20261012_041342_initial from './20261012_041342_initial';
import * as migration_20261012_181059_remove_home_variants from './20261012_181059_remove_home_variants';
import * as migration_20261013_114841_add_staff_username from './20261013_114841_add_staff_username';
import * as migration_20261013_133847_split_videos from './20261013_133847_split_videos';
import * as migration_20261013_135001_block_accounts from './20261013_135001_block_accounts';
import * as migration_20261013_181310_account_requests from './20261013_181310_account_requests';
import * as migration_20261015_072632_rate_label from './20261015_072632_rate_label';
import * as migration_20261019_183037_add_store_products from './20261019_183037_add_store_products';

export const migrations = [
  {
    up: migration_20261012_041342_initial.up,
    down: migration_20261012_041342_initial.down,
    name: '20261012_041342_initial',
  },
  {
    up: migration_20261012_181059_remove_home_variants.up,
    down: migration_20261012_181059_remove_home_variants.down,
    name: '20261012_181059_remove_home_variants',
  },
  {
    up: migration_20261013_114841_add_staff_username.up,
    down: migration_20261013_114841_add_staff_username.down,
    name: '20261013_114841_add_staff_username',
  },
  {
    up: migration_20261013_133847_split_videos.up,
    down: migration_20261013_133847_split_videos.down,
    name: '20261013_133847_split_videos',
  },
  {
    up: migration_20261013_135001_block_accounts.up,
    down: migration_20261013_135001_block_accounts.down,
    name: '20261013_135001_block_accounts',
  },
  {
    up: migration_20261013_181310_account_requests.up,
    down: migration_20261013_181310_account_requests.down,
    name: '20261013_181310_account_requests',
  },
  {
    up: migration_20261015_072632_rate_label.up,
    down: migration_20261015_072632_rate_label.down,
    name: '20261015_072632_rate_label',
  },
  {
    up: migration_20261019_183037_add_store_products.up,
    down: migration_20261019_183037_add_store_products.down,
    name: '20261019_183037_add_store_products'
  },
];
