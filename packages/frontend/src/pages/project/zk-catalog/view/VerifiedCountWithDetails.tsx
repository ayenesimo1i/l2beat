import { assert } from '@l2beat/shared-pure'
import React from 'react'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  verifiers: ZkCatalogProjectDetails['verifiers']
}

export function VerifiedCountWithDetails(props: Props) {
  const successfullyVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'yes',
  ).length
  const unsuccessfullyVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'failed',
  ).length
  const notVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'no',
  ).length

  const groupedByStatus = [
    { Icon: VerifiedIcon, count: successfullyVerifiedCount },
    { Icon: CircleQuestionMark, count: notVerifiedCount },
    { Icon: UnverifiedIcon, count: unsuccessfullyVerifiedCount },
  ].filter((item) => item.count > 0)

  const isOnlyOneStatus = groupedByStatus.length === 1

  if (isOnlyOneStatus) {
    const status = groupedByStatus[0]
    assert(status, 'status should be defined')
    const { count, Icon } = status
    return (
      <div className="flex items-center">
        <span>{count}</span>
        {<Icon />}
      </div>
    )
  }

  return (
    <div className="flex gap-1.5 items-center leading-none">
      <span>{props.verifiers.length}</span>
      <div className="text-zinc-500 dark:text-gray-50 font-medium text-base select-none">
        (
        <div className="inline-flex items-center gap-1">
          {successfullyVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{successfullyVerifiedCount}</span>
              <VerifiedIcon className="size-4 inline" />
            </div>
          ) : null}
          {notVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{notVerifiedCount}</span>
              <CircleQuestionMark className="size-4 inline" />
            </div>
          ) : null}
          {unsuccessfullyVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{unsuccessfullyVerifiedCount}</span>
              <UnverifiedIcon className="size-4 inline fill-red-700 dark:fill-red-300" />
            </div>
          ) : null}
        </div>
        )
      </div>
    </div>
  )
}
