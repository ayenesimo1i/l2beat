import { Logger } from '@l2beat/backend-tools'
import {
  ChainId,
  EthereumAddress,
  Hash256,
  RateLimiter,
  UnixTime,
  getErrorMessage,
  stringAsInt,
} from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  parseEtherscanResponse,
} from './model'

export class EtherscanError extends Error {}
const MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP = 6

export class EtherscanClient implements BlockNumberProvider {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly apiKey: string,
    private readonly chainId: ChainId,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: {
      url: string
      apiKey: string
      chainId: ChainId
    },
  ) {
    return new EtherscanClient(
      services.httpClient,
      options.url,
      options.apiKey,
      options.chainId,
      services.logger,
    )
  }

  /**
   * Creates a client that can be used for discovery so does not need a minTimestamp.
   */
  static createForDiscovery(
    httpClient: HttpClient,
    url: string,
    apiKey: string,
    chainId: ChainId,
  ) {
    return new EtherscanClient(httpClient, url, apiKey, chainId)
  }

  getChainId(): ChainId {
    return this.chainId
  }

  // Etherscan API is not stable enough to trust it to return "closest" block.
  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than 10 minutes intervals,
  // e.g block 0 @ 22:45 and block 1 @ 23:15
  // if you query for 23:00 Etherscan API returns "No closes block found".
  //
  // To mitigate this, we need to go back in time by 10 minutes until we find a block
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = new UnixTime(timestamp.toNumber())

    let counter = 1
    while (counter <= MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        this.reportCalls(counter)
        return stringAsInt().parse(result)
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          this.reportCalls(counter)
          throw new Error(errorString)
        }

        const errorObject = error as EtherscanError
        if (!errorObject.message.includes('No closest block found')) {
          this.reportCalls(counter)
          throw new Error(errorObject.message)
        }

        current = current.add(-10, 'minutes')
      }
      counter++
    }

    this.reportCalls(counter)
    throw new Error('Could not fetch block number', {
      cause: {
        current,
        timestamp,
        calls: MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP,
      },
    })
  }

  async getContractSource(address: EthereumAddress) {
    const response = await this.call('contract', 'getsourcecode', {
      address: address.toString(),
    })
    return ContractSourceResult.parse(response)[0]
  }

  async getContractDeploymentTx(address: EthereumAddress): Promise<Hash256> {
    const response = await this.call('contract', 'getcontractcreation', {
      contractaddresses: address.toString(),
    })

    return ContractCreatorAndCreationTxHashResult.parse(response)[0].txHash
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: this.timeoutMs })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(module, action, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()
    const etherscanResponse = tryParseEtherscanResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    if (!etherscanResponse) {
      const message = `Invalid Etherscan response [${text}] for request [${url}].`
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (etherscanResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, etherscanResponse.result)
      throw new EtherscanError(etherscanResponse.result)
    }

    this.logger.debug({ type: 'success', timeMs, module, action })
    return etherscanResponse.result
  }

  private recordError(
    module: string,
    action: string,
    timeMs: number,
    message: string,
  ) {
    this.logger.debug({ type: 'error', message, timeMs, module, action })
  }

  private reportCalls(counter: number) {
    this.logger.info('Client calls report', {
      calls: counter,
    })
  }
}

function tryParseEtherscanResponse(text: string) {
  try {
    return parseEtherscanResponse(text)
  } catch {
    return undefined
  }
}
