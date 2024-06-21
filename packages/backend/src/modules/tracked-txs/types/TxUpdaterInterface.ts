import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxId } from '../utils/createTrackedTxConfigId'
import { TrackedTxResult } from './model'

export interface TxUpdaterInterface {
  update: (txs: TrackedTxResult[], knexTx?: Knex.Transaction) => Promise<void>
  deleteFromById: (
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) => Promise<void>
}
