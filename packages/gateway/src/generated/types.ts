import type {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Address: { input: any; output: any };
  AssetId: { input: any; output: any };
  BlockId: { input: any; output: any };
  Bytes32: { input: any; output: any };
  ContractId: { input: any; output: any };
  HexString: { input: any; output: any };
  Nonce: { input: any; output: any };
  RelayedTransactionId: { input: any; output: any };
  Salt: { input: any; output: any };
  Signature: { input: any; output: any };
  Tai64Timestamp: { input: any; output: any };
  TransactionId: { input: any; output: any };
  TxPointer: { input: any; output: any };
  U16: { input: any; output: any };
  U32: { input: any; output: any };
  U64: { input: any; output: any };
  UtxoId: { input: any; output: any };
};

export type Balance = {
  __typename?: 'Balance';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  owner: Scalars['Address']['output'];
};

export type BalanceConnection = {
  __typename?: 'BalanceConnection';
  /** A list of edges. */
  edges: Array<BalanceEdge>;
  /** A list of nodes. */
  nodes: Array<Balance>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BalanceEdge = {
  __typename?: 'BalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Balance;
};

export type BalanceFilterInput = {
  /** Filter coins based on the `owner` field */
  owner: Scalars['Address']['input'];
};

export type Block = {
  __typename?: 'Block';
  consensus: Consensus;
  header: Header;
  height: Scalars['U32']['output'];
  id: Scalars['BlockId']['output'];
  transactionIds: Array<Scalars['TransactionId']['output']>;
  transactions: Array<Transaction>;
  version: BlockVersion;
};

export type BlockConnection = {
  __typename?: 'BlockConnection';
  /** A list of edges. */
  edges: Array<BlockEdge>;
  /** A list of nodes. */
  nodes: Array<Block>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BlockEdge = {
  __typename?: 'BlockEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Block;
};

export enum BlockVersion {
  V1 = 'V1',
}

/** Breakpoint, defined as a tuple of contract ID and relative PC offset inside it */
export type Breakpoint = {
  contract: Scalars['ContractId']['input'];
  pc: Scalars['U64']['input'];
};

export type ChainInfo = {
  __typename?: 'ChainInfo';
  consensusParameters: ConsensusParameters;
  daHeight: Scalars['U64']['output'];
  gasCosts: GasCosts;
  latestBlock: Block;
  name: Scalars['String']['output'];
};

export type ChangeOutput = {
  __typename?: 'ChangeOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

export type Coin = {
  __typename?: 'Coin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  /** TxPointer - the height of the block this coin was created in */
  blockCreated: Scalars['U32']['output'];
  owner: Scalars['Address']['output'];
  /** TxPointer - the index of the transaction that created this coin */
  txCreatedIdx: Scalars['U16']['output'];
  utxoId: Scalars['UtxoId']['output'];
};

export type CoinConnection = {
  __typename?: 'CoinConnection';
  /** A list of edges. */
  edges: Array<CoinEdge>;
  /** A list of nodes. */
  nodes: Array<Coin>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CoinEdge = {
  __typename?: 'CoinEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Coin;
};

export type CoinFilterInput = {
  /** Returns coins only with `asset_id`. */
  assetId?: InputMaybe<Scalars['AssetId']['input']>;
  /** Returns coins owned by the `owner`. */
  owner: Scalars['Address']['input'];
};

export type CoinOutput = {
  __typename?: 'CoinOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

/** The schema analog of the [`coins::CoinType`]. */
export type CoinType = Coin | MessageCoin;

export type Consensus = Genesis | PoAConsensus;

export type ConsensusParameters = {
  __typename?: 'ConsensusParameters';
  baseAssetId: Scalars['AssetId']['output'];
  blockGasLimit: Scalars['U64']['output'];
  chainId: Scalars['U64']['output'];
  contractParams: ContractParameters;
  feeParams: FeeParameters;
  gasCosts: GasCosts;
  predicateParams: PredicateParameters;
  privilegedAddress: Scalars['Address']['output'];
  scriptParams: ScriptParameters;
  txParams: TxParameters;
  version: ConsensusParametersVersion;
};

export type ConsensusParametersPurpose = {
  __typename?: 'ConsensusParametersPurpose';
  checksum: Scalars['Bytes32']['output'];
  witnessIndex: Scalars['U16']['output'];
};

export enum ConsensusParametersVersion {
  V1 = 'V1',
}

export type Contract = {
  __typename?: 'Contract';
  bytecode: Scalars['HexString']['output'];
  id: Scalars['ContractId']['output'];
  salt: Scalars['Salt']['output'];
};

export type ContractBalance = {
  __typename?: 'ContractBalance';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  contract: Scalars['ContractId']['output'];
};

export type ContractBalanceConnection = {
  __typename?: 'ContractBalanceConnection';
  /** A list of edges. */
  edges: Array<ContractBalanceEdge>;
  /** A list of nodes. */
  nodes: Array<ContractBalance>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ContractBalanceEdge = {
  __typename?: 'ContractBalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: ContractBalance;
};

export type ContractBalanceFilterInput = {
  /** Filter assets based on the `contractId` field */
  contract: Scalars['ContractId']['input'];
};

export type ContractCreated = {
  __typename?: 'ContractCreated';
  contract: Scalars['ContractId']['output'];
  stateRoot: Scalars['Bytes32']['output'];
};

export type ContractOutput = {
  __typename?: 'ContractOutput';
  balanceRoot: Scalars['Bytes32']['output'];
  inputIndex: Scalars['U16']['output'];
  stateRoot: Scalars['Bytes32']['output'];
};

export type ContractParameters = {
  __typename?: 'ContractParameters';
  contractMaxSize: Scalars['U64']['output'];
  maxStorageSlots: Scalars['U64']['output'];
  version: ContractParametersVersion;
};

export enum ContractParametersVersion {
  V1 = 'V1',
}

export type DependentCost = HeavyOperation | LightOperation;

export type DryRunFailureStatus = {
  __typename?: 'DryRunFailureStatus';
  programState?: Maybe<ProgramState>;
  reason: Scalars['String']['output'];
  receipts: Array<Receipt>;
  totalFee: Scalars['U64']['output'];
  totalGas: Scalars['U64']['output'];
};

export type DryRunSuccessStatus = {
  __typename?: 'DryRunSuccessStatus';
  programState?: Maybe<ProgramState>;
  receipts: Array<Receipt>;
  totalFee: Scalars['U64']['output'];
  totalGas: Scalars['U64']['output'];
};

export type DryRunTransactionExecutionStatus = {
  __typename?: 'DryRunTransactionExecutionStatus';
  id: Scalars['TransactionId']['output'];
  receipts: Array<Receipt>;
  status: DryRunTransactionStatus;
};

export type DryRunTransactionStatus = DryRunFailureStatus | DryRunSuccessStatus;

export type EstimateGasPrice = {
  __typename?: 'EstimateGasPrice';
  gasPrice: Scalars['U64']['output'];
};

export type ExcludeInput = {
  /** Messages to exclude from the selection. */
  messages: Array<Scalars['Nonce']['input']>;
  /** Utxos to exclude from the selection. */
  utxos: Array<Scalars['UtxoId']['input']>;
};

export type FailureStatus = {
  __typename?: 'FailureStatus';
  block: Block;
  blockHeight: Scalars['U32']['output'];
  programState?: Maybe<ProgramState>;
  reason: Scalars['String']['output'];
  receipts: Array<Receipt>;
  time: Scalars['Tai64Timestamp']['output'];
  totalFee: Scalars['U64']['output'];
  totalGas: Scalars['U64']['output'];
  transactionId: Scalars['TransactionId']['output'];
};

export type FeeParameters = {
  __typename?: 'FeeParameters';
  gasPerByte: Scalars['U64']['output'];
  gasPriceFactor: Scalars['U64']['output'];
  version: FeeParametersVersion;
};

export enum FeeParametersVersion {
  V1 = 'V1',
}

export type GasCosts = {
  __typename?: 'GasCosts';
  add: Scalars['U64']['output'];
  addi: Scalars['U64']['output'];
  aloc: Scalars['U64']['output'];
  alocDependentCost: DependentCost;
  and: Scalars['U64']['output'];
  andi: Scalars['U64']['output'];
  bal: Scalars['U64']['output'];
  bhei: Scalars['U64']['output'];
  bhsh: Scalars['U64']['output'];
  burn: Scalars['U64']['output'];
  call: DependentCost;
  cb: Scalars['U64']['output'];
  ccp: DependentCost;
  cfe: DependentCost;
  cfei: Scalars['U64']['output'];
  cfeiDependentCost: DependentCost;
  cfsi: Scalars['U64']['output'];
  contractRoot: DependentCost;
  croo: DependentCost;
  csiz: DependentCost;
  div: Scalars['U64']['output'];
  divi: Scalars['U64']['output'];
  eck1: Scalars['U64']['output'];
  ecr1: Scalars['U64']['output'];
  ed19: Scalars['U64']['output'];
  eq: Scalars['U64']['output'];
  exp: Scalars['U64']['output'];
  expi: Scalars['U64']['output'];
  flag: Scalars['U64']['output'];
  gm: Scalars['U64']['output'];
  gt: Scalars['U64']['output'];
  gtf: Scalars['U64']['output'];
  ji: Scalars['U64']['output'];
  jmp: Scalars['U64']['output'];
  jmpb: Scalars['U64']['output'];
  jmpf: Scalars['U64']['output'];
  jne: Scalars['U64']['output'];
  jneb: Scalars['U64']['output'];
  jnef: Scalars['U64']['output'];
  jnei: Scalars['U64']['output'];
  jnzb: Scalars['U64']['output'];
  jnzf: Scalars['U64']['output'];
  jnzi: Scalars['U64']['output'];
  k256: DependentCost;
  lb: Scalars['U64']['output'];
  ldc: DependentCost;
  log: Scalars['U64']['output'];
  logd: DependentCost;
  lt: Scalars['U64']['output'];
  lw: Scalars['U64']['output'];
  mcl: DependentCost;
  mcli: DependentCost;
  mcp: DependentCost;
  mcpi: DependentCost;
  meq: DependentCost;
  mint: Scalars['U64']['output'];
  mldv: Scalars['U64']['output'];
  mlog: Scalars['U64']['output'];
  modOp: Scalars['U64']['output'];
  modi: Scalars['U64']['output'];
  moveOp: Scalars['U64']['output'];
  movi: Scalars['U64']['output'];
  mroo: Scalars['U64']['output'];
  mul: Scalars['U64']['output'];
  muli: Scalars['U64']['output'];
  newStoragePerByte: Scalars['U64']['output'];
  noop: Scalars['U64']['output'];
  not: Scalars['U64']['output'];
  or: Scalars['U64']['output'];
  ori: Scalars['U64']['output'];
  poph: Scalars['U64']['output'];
  popl: Scalars['U64']['output'];
  pshh: Scalars['U64']['output'];
  pshl: Scalars['U64']['output'];
  ret: Scalars['U64']['output'];
  retd: DependentCost;
  rvrt: Scalars['U64']['output'];
  s256: DependentCost;
  sb: Scalars['U64']['output'];
  scwq: DependentCost;
  sll: Scalars['U64']['output'];
  slli: Scalars['U64']['output'];
  smo: DependentCost;
  srl: Scalars['U64']['output'];
  srli: Scalars['U64']['output'];
  srw: Scalars['U64']['output'];
  srwq: DependentCost;
  stateRoot: DependentCost;
  sub: Scalars['U64']['output'];
  subi: Scalars['U64']['output'];
  sw: Scalars['U64']['output'];
  sww: Scalars['U64']['output'];
  swwq: DependentCost;
  time: Scalars['U64']['output'];
  tr: Scalars['U64']['output'];
  tro: Scalars['U64']['output'];
  version: GasCostsVersion;
  vmInitialization: DependentCost;
  wdam: Scalars['U64']['output'];
  wdcm: Scalars['U64']['output'];
  wddv: Scalars['U64']['output'];
  wdmd: Scalars['U64']['output'];
  wdml: Scalars['U64']['output'];
  wdmm: Scalars['U64']['output'];
  wdop: Scalars['U64']['output'];
  wqam: Scalars['U64']['output'];
  wqcm: Scalars['U64']['output'];
  wqdv: Scalars['U64']['output'];
  wqmd: Scalars['U64']['output'];
  wqml: Scalars['U64']['output'];
  wqmm: Scalars['U64']['output'];
  wqop: Scalars['U64']['output'];
  xor: Scalars['U64']['output'];
  xori: Scalars['U64']['output'];
};

export enum GasCostsVersion {
  V1 = 'V1',
}

export type Genesis = {
  __typename?: 'Genesis';
  /**
   * The chain configs define what consensus type to use, what settlement layer to use,
   * rules of block validity, etc.
   */
  chainConfigHash: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of all genesis coins. */
  coinsRoot: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of state, balances, contracts code hash of each contract. */
  contractsRoot: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of all genesis messages. */
  messagesRoot: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of all processed transaction ids. */
  transactionsRoot: Scalars['Bytes32']['output'];
};

export type Header = {
  __typename?: 'Header';
  /** Hash of the application header. */
  applicationHash: Scalars['Bytes32']['output'];
  /** The version of the consensus parameters used to create this block. */
  consensusParametersVersion: Scalars['U32']['output'];
  /** The layer 1 height of messages and events to include since the last layer 1 block number. */
  daHeight: Scalars['U64']['output'];
  /** Merkle root of inbox events in this block. */
  eventInboxRoot: Scalars['Bytes32']['output'];
  /** Fuel block height. */
  height: Scalars['U32']['output'];
  /** Hash of the header */
  id: Scalars['BlockId']['output'];
  /** Merkle root of message receipts in this block. */
  messageOutboxRoot: Scalars['Bytes32']['output'];
  /** Number of message receipts in this block. */
  messageReceiptCount: Scalars['U32']['output'];
  /** Merkle root of all previous block header hashes. */
  prevRoot: Scalars['Bytes32']['output'];
  /** The version of the state transition bytecode used to create this block. */
  stateTransitionBytecodeVersion: Scalars['U32']['output'];
  /** The block producer time. */
  time: Scalars['Tai64Timestamp']['output'];
  /** Number of transactions in this block. */
  transactionsCount: Scalars['U16']['output'];
  /** Merkle root of transactions. */
  transactionsRoot: Scalars['Bytes32']['output'];
  /** Version of the header */
  version: HeaderVersion;
};

export enum HeaderVersion {
  V1 = 'V1',
}

export type HeavyOperation = {
  __typename?: 'HeavyOperation';
  base: Scalars['U64']['output'];
  gasPerUnit: Scalars['U64']['output'];
};

export type Input = InputCoin | InputContract | InputMessage;

export type InputCoin = {
  __typename?: 'InputCoin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  owner: Scalars['Address']['output'];
  predicate: Scalars['HexString']['output'];
  predicateData: Scalars['HexString']['output'];
  predicateGasUsed: Scalars['U64']['output'];
  txPointer: Scalars['TxPointer']['output'];
  utxoId: Scalars['UtxoId']['output'];
  witnessIndex: Scalars['Int']['output'];
};

export type InputContract = {
  __typename?: 'InputContract';
  balanceRoot: Scalars['Bytes32']['output'];
  contractId: Scalars['ContractId']['output'];
  stateRoot: Scalars['Bytes32']['output'];
  txPointer: Scalars['TxPointer']['output'];
  utxoId: Scalars['UtxoId']['output'];
};

export type InputMessage = {
  __typename?: 'InputMessage';
  amount: Scalars['U64']['output'];
  data: Scalars['HexString']['output'];
  nonce: Scalars['Nonce']['output'];
  predicate: Scalars['HexString']['output'];
  predicateData: Scalars['HexString']['output'];
  predicateGasUsed: Scalars['U64']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
  witnessIndex: Scalars['U16']['output'];
};

export type LatestGasPrice = {
  __typename?: 'LatestGasPrice';
  blockHeight: Scalars['U32']['output'];
  gasPrice: Scalars['U64']['output'];
};

export type LightOperation = {
  __typename?: 'LightOperation';
  base: Scalars['U64']['output'];
  unitsPerGas: Scalars['U64']['output'];
};

export type MerkleProof = {
  __typename?: 'MerkleProof';
  proofIndex: Scalars['U64']['output'];
  proofSet: Array<Scalars['Bytes32']['output']>;
};

export type Message = {
  __typename?: 'Message';
  amount: Scalars['U64']['output'];
  daHeight: Scalars['U64']['output'];
  data: Scalars['HexString']['output'];
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
};

export type MessageCoin = {
  __typename?: 'MessageCoin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  daHeight: Scalars['U64']['output'];
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  /** A list of edges. */
  edges: Array<MessageEdge>;
  /** A list of nodes. */
  nodes: Array<Message>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessageEdge = {
  __typename?: 'MessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Message;
};

export type MessageProof = {
  __typename?: 'MessageProof';
  amount: Scalars['U64']['output'];
  blockProof: MerkleProof;
  commitBlockHeader: Header;
  data: Scalars['HexString']['output'];
  messageBlockHeader: Header;
  messageProof: MerkleProof;
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
};

export enum MessageState {
  NotFound = 'NOT_FOUND',
  Spent = 'SPENT',
  Unspent = 'UNSPENT',
}

export type MessageStatus = {
  __typename?: 'MessageStatus';
  state: MessageState;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Resume execution of the VM instance after a breakpoint.
   * Runs until the next breakpoint or until the transaction completes.
   */
  continueTx: RunResult;
  /** Execute a dry-run of multiple transactions using a fork of current state, no changes are committed. */
  dryRun: Array<DryRunTransactionExecutionStatus>;
  /** End debugger session. */
  endSession: Scalars['Boolean']['output'];
  /** Execute a single fuel-asm instruction. */
  execute: Scalars['Boolean']['output'];
  /**
   * Sequentially produces `blocks_to_produce` blocks. The first block starts with
   * `start_timestamp`. If the block production in the [`crate::service::Config`] is
   * `Trigger::Interval { block_time }`, produces blocks with `block_time ` intervals between
   * them. The `start_timestamp` is the timestamp in seconds.
   */
  produceBlocks: Scalars['U32']['output'];
  /** Reset the VM instance to the initial state. */
  reset: Scalars['Boolean']['output'];
  /** Set a breakpoint for a VM instance. */
  setBreakpoint: Scalars['Boolean']['output'];
  /** Set single-stepping mode for the VM instance. */
  setSingleStepping: Scalars['Boolean']['output'];
  /**
   * Initialize a new debugger session, returning its ID.
   * A new VM instance is spawned for each session.
   * The session is run in a separate database transaction,
   * on top of the most recent node state.
   */
  startSession: Scalars['ID']['output'];
  /**
   * Run a single transaction in given session until it
   * hits a breakpoint or completes.
   */
  startTx: RunResult;
  /**
   * Submits transaction to the `TxPool`.
   *
   * Returns submitted transaction if the transaction is included in the `TxPool` without problems.
   */
  submit: Transaction;
};

export type MutationContinueTxArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDryRunArgs = {
  gasPrice?: InputMaybe<Scalars['U64']['input']>;
  txs: Array<Scalars['HexString']['input']>;
  utxoValidation?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationEndSessionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationExecuteArgs = {
  id: Scalars['ID']['input'];
  op: Scalars['String']['input'];
};

export type MutationProduceBlocksArgs = {
  blocksToProduce: Scalars['U32']['input'];
  startTimestamp?: InputMaybe<Scalars['Tai64Timestamp']['input']>;
};

export type MutationResetArgs = {
  id: Scalars['ID']['input'];
};

export type MutationSetBreakpointArgs = {
  breakpoint: Breakpoint;
  id: Scalars['ID']['input'];
};

export type MutationSetSingleSteppingArgs = {
  enable: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};

export type MutationStartTxArgs = {
  id: Scalars['ID']['input'];
  txJson: Scalars['String']['input'];
};

export type MutationSubmitArgs = {
  tx: Scalars['HexString']['input'];
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  maxDepth: Scalars['U64']['output'];
  maxTx: Scalars['U64']['output'];
  nodeVersion: Scalars['String']['output'];
  peers: Array<PeerInfo>;
  utxoValidation: Scalars['Boolean']['output'];
  vmBacktrace: Scalars['Boolean']['output'];
};

export type Output =
  | ChangeOutput
  | CoinOutput
  | ContractCreated
  | ContractOutput
  | VariableOutput;

/**
 * A separate `Breakpoint` type to be used as an output, as a single
 * type cannot act as both input and output type in async-graphql
 */
export type OutputBreakpoint = {
  __typename?: 'OutputBreakpoint';
  contract: Scalars['ContractId']['output'];
  pc: Scalars['U64']['output'];
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PeerInfo = {
  __typename?: 'PeerInfo';
  /** The advertised multi-addrs that can be used to connect to this peer */
  addresses: Array<Scalars['String']['output']>;
  /** The internal fuel p2p reputation of this peer */
  appScore: Scalars['Float']['output'];
  /** The last reported height of the peer */
  blockHeight?: Maybe<Scalars['U32']['output']>;
  /** The self-reported version of the client the peer is using */
  clientVersion?: Maybe<Scalars['String']['output']>;
  /** The libp2p peer id */
  id: Scalars['String']['output'];
  /** The last heartbeat from this peer in unix epoch time ms */
  lastHeartbeatMs: Scalars['U64']['output'];
};

export type PoAConsensus = {
  __typename?: 'PoAConsensus';
  /** Gets the signature of the block produced by `PoA` consensus. */
  signature: Scalars['Signature']['output'];
};

export type Policies = {
  __typename?: 'Policies';
  maturity?: Maybe<Scalars['U32']['output']>;
  maxFee?: Maybe<Scalars['U64']['output']>;
  tip?: Maybe<Scalars['U64']['output']>;
  witnessLimit?: Maybe<Scalars['U64']['output']>;
};

export type PredicateParameters = {
  __typename?: 'PredicateParameters';
  maxGasPerPredicate: Scalars['U64']['output'];
  maxMessageDataLength: Scalars['U64']['output'];
  maxPredicateDataLength: Scalars['U64']['output'];
  maxPredicateLength: Scalars['U64']['output'];
  version: PredicateParametersVersion;
};

export enum PredicateParametersVersion {
  V1 = 'V1',
}

export type ProgramState = {
  __typename?: 'ProgramState';
  data: Scalars['HexString']['output'];
  returnType: ReturnType;
};

export type Query = {
  __typename?: 'Query';
  balance: Balance;
  balances: BalanceConnection;
  block?: Maybe<Block>;
  blocks: BlockConnection;
  chain: ChainInfo;
  /** Gets the coin by `utxo_id`. */
  coin?: Maybe<Coin>;
  /** Gets all unspent coins of some `owner` maybe filtered with by `asset_id` per page. */
  coins: CoinConnection;
  /**
   * For each `query_per_asset`, get some spendable coins(of asset specified by the query) owned by
   * `owner` that add up at least the query amount. The returned coins can be spent.
   * The number of coins is optimized to prevent dust accumulation.
   *
   * The query supports excluding and maximum the number of coins.
   *
   * Returns:
   * The list of spendable coins per asset from the query. The length of the result is
   * the same as the length of `query_per_asset`. The ordering of assets and `query_per_asset`
   * is the same.
   */
  coinsToSpend: Array<Array<CoinType>>;
  contract?: Maybe<Contract>;
  contractBalance: ContractBalance;
  contractBalances: ContractBalanceConnection;
  estimateGasPrice: EstimateGasPrice;
  /** Estimate the predicate gas for the provided transaction */
  estimatePredicates: Transaction;
  /** Returns true when the GraphQL API is serving requests. */
  health: Scalars['Boolean']['output'];
  latestGasPrice: LatestGasPrice;
  /** Read read a range of memory bytes. */
  memory: Scalars['String']['output'];
  message?: Maybe<Message>;
  messageProof?: Maybe<MessageProof>;
  messageStatus: MessageStatus;
  messages: MessageConnection;
  nodeInfo: NodeInfo;
  /** Read register value by index. */
  register: Scalars['U64']['output'];
  relayedTransactionStatus?: Maybe<RelayedTransactionStatus>;
  transaction?: Maybe<Transaction>;
  transactions: TransactionConnection;
  transactionsByOwner: TransactionConnection;
};

export type QueryBalanceArgs = {
  assetId: Scalars['AssetId']['input'];
  owner: Scalars['Address']['input'];
};

export type QueryBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: BalanceFilterInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryBlockArgs = {
  height?: InputMaybe<Scalars['U32']['input']>;
  id?: InputMaybe<Scalars['BlockId']['input']>;
};

export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCoinArgs = {
  utxoId: Scalars['UtxoId']['input'];
};

export type QueryCoinsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: CoinFilterInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCoinsToSpendArgs = {
  excludedIds?: InputMaybe<ExcludeInput>;
  owner: Scalars['Address']['input'];
  queryPerAsset: Array<SpendQueryElementInput>;
};

export type QueryContractArgs = {
  id: Scalars['ContractId']['input'];
};

export type QueryContractBalanceArgs = {
  asset: Scalars['AssetId']['input'];
  contract: Scalars['ContractId']['input'];
};

export type QueryContractBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: ContractBalanceFilterInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryEstimateGasPriceArgs = {
  blockHorizon?: InputMaybe<Scalars['U32']['input']>;
};

export type QueryEstimatePredicatesArgs = {
  tx: Scalars['HexString']['input'];
};

export type QueryMemoryArgs = {
  id: Scalars['ID']['input'];
  size: Scalars['U32']['input'];
  start: Scalars['U32']['input'];
};

export type QueryMessageArgs = {
  nonce: Scalars['Nonce']['input'];
};

export type QueryMessageProofArgs = {
  commitBlockHeight?: InputMaybe<Scalars['U32']['input']>;
  commitBlockId?: InputMaybe<Scalars['BlockId']['input']>;
  nonce: Scalars['Nonce']['input'];
  transactionId: Scalars['TransactionId']['input'];
};

export type QueryMessageStatusArgs = {
  nonce: Scalars['Nonce']['input'];
};

export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  owner?: InputMaybe<Scalars['Address']['input']>;
};

export type QueryRegisterArgs = {
  id: Scalars['ID']['input'];
  register: Scalars['U32']['input'];
};

export type QueryRelayedTransactionStatusArgs = {
  id: Scalars['RelayedTransactionId']['input'];
};

export type QueryTransactionArgs = {
  id: Scalars['TransactionId']['input'];
};

export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTransactionsByOwnerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  owner: Scalars['Address']['input'];
};

export type Receipt = {
  __typename?: 'Receipt';
  amount?: Maybe<Scalars['U64']['output']>;
  assetId?: Maybe<Scalars['AssetId']['output']>;
  /** Set in the case of a Panic receipt to indicate a missing contract input id */
  contractId?: Maybe<Scalars['ContractId']['output']>;
  data?: Maybe<Scalars['HexString']['output']>;
  digest?: Maybe<Scalars['Bytes32']['output']>;
  gas?: Maybe<Scalars['U64']['output']>;
  gasUsed?: Maybe<Scalars['U64']['output']>;
  id?: Maybe<Scalars['ContractId']['output']>;
  is?: Maybe<Scalars['U64']['output']>;
  len?: Maybe<Scalars['U64']['output']>;
  nonce?: Maybe<Scalars['Nonce']['output']>;
  param1?: Maybe<Scalars['U64']['output']>;
  param2?: Maybe<Scalars['U64']['output']>;
  pc?: Maybe<Scalars['U64']['output']>;
  ptr?: Maybe<Scalars['U64']['output']>;
  ra?: Maybe<Scalars['U64']['output']>;
  rb?: Maybe<Scalars['U64']['output']>;
  rc?: Maybe<Scalars['U64']['output']>;
  rd?: Maybe<Scalars['U64']['output']>;
  reason?: Maybe<Scalars['U64']['output']>;
  receiptType: ReceiptType;
  recipient?: Maybe<Scalars['Address']['output']>;
  result?: Maybe<Scalars['U64']['output']>;
  sender?: Maybe<Scalars['Address']['output']>;
  subId?: Maybe<Scalars['Bytes32']['output']>;
  to?: Maybe<Scalars['ContractId']['output']>;
  toAddress?: Maybe<Scalars['Address']['output']>;
  val?: Maybe<Scalars['U64']['output']>;
};

export enum ReceiptType {
  Burn = 'BURN',
  Call = 'CALL',
  Log = 'LOG',
  LogData = 'LOG_DATA',
  MessageOut = 'MESSAGE_OUT',
  Mint = 'MINT',
  Panic = 'PANIC',
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
  ScriptResult = 'SCRIPT_RESULT',
  Transfer = 'TRANSFER',
  TransferOut = 'TRANSFER_OUT',
}

export type RelayedTransactionFailed = {
  __typename?: 'RelayedTransactionFailed';
  blockHeight: Scalars['U32']['output'];
  failure: Scalars['String']['output'];
};

export type RelayedTransactionStatus = RelayedTransactionFailed;

export enum ReturnType {
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
}

export type RunResult = {
  __typename?: 'RunResult';
  breakpoint?: Maybe<OutputBreakpoint>;
  jsonReceipts: Array<Scalars['String']['output']>;
  state: RunState;
};

export enum RunState {
  /** Stopped on a breakpoint */
  Breakpoint = 'BREAKPOINT',
  /** All breakpoints have been processed, and the program has terminated */
  Completed = 'COMPLETED',
}

export type ScriptParameters = {
  __typename?: 'ScriptParameters';
  maxScriptDataLength: Scalars['U64']['output'];
  maxScriptLength: Scalars['U64']['output'];
  version: ScriptParametersVersion;
};

export enum ScriptParametersVersion {
  V1 = 'V1',
}

export type SpendQueryElementInput = {
  /** Target amount for the query. */
  amount: Scalars['U64']['input'];
  /** Identifier of the asset to spend. */
  assetId: Scalars['AssetId']['input'];
  /** The maximum number of currencies for selection. */
  max?: InputMaybe<Scalars['U32']['input']>;
};

export type SqueezedOutStatus = {
  __typename?: 'SqueezedOutStatus';
  reason: Scalars['String']['output'];
};

export type StateTransitionPurpose = {
  __typename?: 'StateTransitionPurpose';
  root: Scalars['Bytes32']['output'];
};

export type SubmittedStatus = {
  __typename?: 'SubmittedStatus';
  time: Scalars['Tai64Timestamp']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /**
   * Returns a stream of status updates for the given transaction id.
   * If the current status is [`TransactionStatus::Success`], [`TransactionStatus::SqueezedOut`]
   * or [`TransactionStatus::Failed`] the stream will return that and end immediately.
   * If the current status is [`TransactionStatus::Submitted`] this will be returned
   * and the stream will wait for a future update.
   *
   * This stream will wait forever so it's advised to use within a timeout.
   *
   * It is possible for the stream to miss an update if it is polled slower
   * then the updates arrive. In such a case the stream will close without
   * a status. If this occurs the stream can simply be restarted to return
   * the latest status.
   */
  statusChange: TransactionStatus;
  /** Submits transaction to the `TxPool` and await either confirmation or failure. */
  submitAndAwait: TransactionStatus;
};

export type SubscriptionStatusChangeArgs = {
  id: Scalars['TransactionId']['input'];
};

export type SubscriptionSubmitAndAwaitArgs = {
  tx: Scalars['HexString']['input'];
};

export type SuccessStatus = {
  __typename?: 'SuccessStatus';
  block: Block;
  blockHeight: Scalars['U32']['output'];
  programState?: Maybe<ProgramState>;
  receipts: Array<Receipt>;
  time: Scalars['Tai64Timestamp']['output'];
  totalFee: Scalars['U64']['output'];
  totalGas: Scalars['U64']['output'];
  transactionId: Scalars['TransactionId']['output'];
};

export type Transaction = {
  __typename?: 'Transaction';
  bytecodeRoot?: Maybe<Scalars['Bytes32']['output']>;
  bytecodeWitnessIndex?: Maybe<Scalars['U16']['output']>;
  id: Scalars['TransactionId']['output'];
  inputAssetIds?: Maybe<Array<Scalars['AssetId']['output']>>;
  inputContract?: Maybe<InputContract>;
  inputContracts?: Maybe<Array<Scalars['ContractId']['output']>>;
  inputs?: Maybe<Array<Input>>;
  isCreate: Scalars['Boolean']['output'];
  isMint: Scalars['Boolean']['output'];
  isScript: Scalars['Boolean']['output'];
  isUpgrade: Scalars['Boolean']['output'];
  isUpload: Scalars['Boolean']['output'];
  maturity?: Maybe<Scalars['U32']['output']>;
  mintAmount?: Maybe<Scalars['U64']['output']>;
  mintAssetId?: Maybe<Scalars['AssetId']['output']>;
  mintGasPrice?: Maybe<Scalars['U64']['output']>;
  outputContract?: Maybe<ContractOutput>;
  outputs: Array<Output>;
  policies?: Maybe<Policies>;
  proofSet?: Maybe<Array<Scalars['Bytes32']['output']>>;
  /** Return the transaction bytes using canonical encoding */
  rawPayload: Scalars['HexString']['output'];
  receiptsRoot?: Maybe<Scalars['Bytes32']['output']>;
  salt?: Maybe<Scalars['Salt']['output']>;
  script?: Maybe<Scalars['HexString']['output']>;
  scriptData?: Maybe<Scalars['HexString']['output']>;
  scriptGasLimit?: Maybe<Scalars['U64']['output']>;
  status?: Maybe<TransactionStatus>;
  storageSlots?: Maybe<Array<Scalars['HexString']['output']>>;
  subsectionIndex?: Maybe<Scalars['U16']['output']>;
  subsectionsNumber?: Maybe<Scalars['U16']['output']>;
  txPointer?: Maybe<Scalars['TxPointer']['output']>;
  upgradePurpose?: Maybe<UpgradePurpose>;
  witnesses?: Maybe<Array<Scalars['HexString']['output']>>;
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  /** A list of edges. */
  edges: Array<TransactionEdge>;
  /** A list of nodes. */
  nodes: Array<Transaction>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Transaction;
};

export type TransactionStatus =
  | FailureStatus
  | SqueezedOutStatus
  | SubmittedStatus
  | SuccessStatus;

export type TxParameters = {
  __typename?: 'TxParameters';
  maxBytecodeSubsections: Scalars['U16']['output'];
  maxGasPerTx: Scalars['U64']['output'];
  maxInputs: Scalars['U16']['output'];
  maxOutputs: Scalars['U16']['output'];
  maxSize: Scalars['U64']['output'];
  maxWitnesses: Scalars['U32']['output'];
  version: TxParametersVersion;
};

export enum TxParametersVersion {
  V1 = 'V1',
}

export type UpgradePurpose =
  | ConsensusParametersPurpose
  | StateTransitionPurpose;

export type VariableOutput = {
  __typename?: 'VariableOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> =
  ResolversObject<{
    CoinType: Coin | MessageCoin;
    Consensus: Genesis | PoAConsensus;
    DependentCost: HeavyOperation | LightOperation;
    DryRunTransactionStatus: DryRunFailureStatus | DryRunSuccessStatus;
    Input: InputCoin | InputContract | InputMessage;
    Output:
      | ChangeOutput
      | CoinOutput
      | ContractCreated
      | ContractOutput
      | VariableOutput;
    RelayedTransactionStatus: RelayedTransactionFailed;
    TransactionStatus:
      | FailureStatus
      | SqueezedOutStatus
      | SubmittedStatus
      | SuccessStatus;
    UpgradePurpose: ConsensusParametersPurpose | StateTransitionPurpose;
  }>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<Scalars['Address']['output']>;
  AssetId: ResolverTypeWrapper<Scalars['AssetId']['output']>;
  Balance: ResolverTypeWrapper<Balance>;
  BalanceConnection: ResolverTypeWrapper<BalanceConnection>;
  BalanceEdge: ResolverTypeWrapper<BalanceEdge>;
  BalanceFilterInput: BalanceFilterInput;
  Block: ResolverTypeWrapper<
    Omit<Block, 'consensus'> & { consensus: ResolversTypes['Consensus'] }
  >;
  BlockConnection: ResolverTypeWrapper<BlockConnection>;
  BlockEdge: ResolverTypeWrapper<BlockEdge>;
  BlockId: ResolverTypeWrapper<Scalars['BlockId']['output']>;
  BlockVersion: BlockVersion;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Breakpoint: Breakpoint;
  Bytes32: ResolverTypeWrapper<Scalars['Bytes32']['output']>;
  ChainInfo: ResolverTypeWrapper<ChainInfo>;
  ChangeOutput: ResolverTypeWrapper<ChangeOutput>;
  Coin: ResolverTypeWrapper<Coin>;
  CoinConnection: ResolverTypeWrapper<CoinConnection>;
  CoinEdge: ResolverTypeWrapper<CoinEdge>;
  CoinFilterInput: CoinFilterInput;
  CoinOutput: ResolverTypeWrapper<CoinOutput>;
  CoinType: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['CoinType']
  >;
  Consensus: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['Consensus']
  >;
  ConsensusParameters: ResolverTypeWrapper<ConsensusParameters>;
  ConsensusParametersPurpose: ResolverTypeWrapper<ConsensusParametersPurpose>;
  ConsensusParametersVersion: ConsensusParametersVersion;
  Contract: ResolverTypeWrapper<Contract>;
  ContractBalance: ResolverTypeWrapper<ContractBalance>;
  ContractBalanceConnection: ResolverTypeWrapper<ContractBalanceConnection>;
  ContractBalanceEdge: ResolverTypeWrapper<ContractBalanceEdge>;
  ContractBalanceFilterInput: ContractBalanceFilterInput;
  ContractCreated: ResolverTypeWrapper<ContractCreated>;
  ContractId: ResolverTypeWrapper<Scalars['ContractId']['output']>;
  ContractOutput: ResolverTypeWrapper<ContractOutput>;
  ContractParameters: ResolverTypeWrapper<ContractParameters>;
  ContractParametersVersion: ContractParametersVersion;
  DependentCost: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['DependentCost']
  >;
  DryRunFailureStatus: ResolverTypeWrapper<DryRunFailureStatus>;
  DryRunSuccessStatus: ResolverTypeWrapper<DryRunSuccessStatus>;
  DryRunTransactionExecutionStatus: ResolverTypeWrapper<
    Omit<DryRunTransactionExecutionStatus, 'status'> & {
      status: ResolversTypes['DryRunTransactionStatus'];
    }
  >;
  DryRunTransactionStatus: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['DryRunTransactionStatus']
  >;
  EstimateGasPrice: ResolverTypeWrapper<EstimateGasPrice>;
  ExcludeInput: ExcludeInput;
  FailureStatus: ResolverTypeWrapper<FailureStatus>;
  FeeParameters: ResolverTypeWrapper<FeeParameters>;
  FeeParametersVersion: FeeParametersVersion;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GasCosts: ResolverTypeWrapper<
    Omit<
      GasCosts,
      | 'alocDependentCost'
      | 'call'
      | 'ccp'
      | 'cfe'
      | 'cfeiDependentCost'
      | 'contractRoot'
      | 'croo'
      | 'csiz'
      | 'k256'
      | 'ldc'
      | 'logd'
      | 'mcl'
      | 'mcli'
      | 'mcp'
      | 'mcpi'
      | 'meq'
      | 'retd'
      | 's256'
      | 'scwq'
      | 'smo'
      | 'srwq'
      | 'stateRoot'
      | 'swwq'
      | 'vmInitialization'
    > & {
      alocDependentCost: ResolversTypes['DependentCost'];
      call: ResolversTypes['DependentCost'];
      ccp: ResolversTypes['DependentCost'];
      cfe: ResolversTypes['DependentCost'];
      cfeiDependentCost: ResolversTypes['DependentCost'];
      contractRoot: ResolversTypes['DependentCost'];
      croo: ResolversTypes['DependentCost'];
      csiz: ResolversTypes['DependentCost'];
      k256: ResolversTypes['DependentCost'];
      ldc: ResolversTypes['DependentCost'];
      logd: ResolversTypes['DependentCost'];
      mcl: ResolversTypes['DependentCost'];
      mcli: ResolversTypes['DependentCost'];
      mcp: ResolversTypes['DependentCost'];
      mcpi: ResolversTypes['DependentCost'];
      meq: ResolversTypes['DependentCost'];
      retd: ResolversTypes['DependentCost'];
      s256: ResolversTypes['DependentCost'];
      scwq: ResolversTypes['DependentCost'];
      smo: ResolversTypes['DependentCost'];
      srwq: ResolversTypes['DependentCost'];
      stateRoot: ResolversTypes['DependentCost'];
      swwq: ResolversTypes['DependentCost'];
      vmInitialization: ResolversTypes['DependentCost'];
    }
  >;
  GasCostsVersion: GasCostsVersion;
  Genesis: ResolverTypeWrapper<Genesis>;
  Header: ResolverTypeWrapper<Header>;
  HeaderVersion: HeaderVersion;
  HeavyOperation: ResolverTypeWrapper<HeavyOperation>;
  HexString: ResolverTypeWrapper<Scalars['HexString']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Input: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Input']>;
  InputCoin: ResolverTypeWrapper<InputCoin>;
  InputContract: ResolverTypeWrapper<InputContract>;
  InputMessage: ResolverTypeWrapper<InputMessage>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LatestGasPrice: ResolverTypeWrapper<LatestGasPrice>;
  LightOperation: ResolverTypeWrapper<LightOperation>;
  MerkleProof: ResolverTypeWrapper<MerkleProof>;
  Message: ResolverTypeWrapper<Message>;
  MessageCoin: ResolverTypeWrapper<MessageCoin>;
  MessageConnection: ResolverTypeWrapper<MessageConnection>;
  MessageEdge: ResolverTypeWrapper<MessageEdge>;
  MessageProof: ResolverTypeWrapper<MessageProof>;
  MessageState: MessageState;
  MessageStatus: ResolverTypeWrapper<MessageStatus>;
  Mutation: ResolverTypeWrapper<{}>;
  NodeInfo: ResolverTypeWrapper<NodeInfo>;
  Nonce: ResolverTypeWrapper<Scalars['Nonce']['output']>;
  Output: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Output']>;
  OutputBreakpoint: ResolverTypeWrapper<OutputBreakpoint>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PeerInfo: ResolverTypeWrapper<PeerInfo>;
  PoAConsensus: ResolverTypeWrapper<PoAConsensus>;
  Policies: ResolverTypeWrapper<Policies>;
  PredicateParameters: ResolverTypeWrapper<PredicateParameters>;
  PredicateParametersVersion: PredicateParametersVersion;
  ProgramState: ResolverTypeWrapper<ProgramState>;
  Query: ResolverTypeWrapper<{}>;
  Receipt: ResolverTypeWrapper<Receipt>;
  ReceiptType: ReceiptType;
  RelayedTransactionFailed: ResolverTypeWrapper<RelayedTransactionFailed>;
  RelayedTransactionId: ResolverTypeWrapper<
    Scalars['RelayedTransactionId']['output']
  >;
  RelayedTransactionStatus: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['RelayedTransactionStatus']
  >;
  ReturnType: ReturnType;
  RunResult: ResolverTypeWrapper<RunResult>;
  RunState: RunState;
  Salt: ResolverTypeWrapper<Scalars['Salt']['output']>;
  ScriptParameters: ResolverTypeWrapper<ScriptParameters>;
  ScriptParametersVersion: ScriptParametersVersion;
  Signature: ResolverTypeWrapper<Scalars['Signature']['output']>;
  SpendQueryElementInput: SpendQueryElementInput;
  SqueezedOutStatus: ResolverTypeWrapper<SqueezedOutStatus>;
  StateTransitionPurpose: ResolverTypeWrapper<StateTransitionPurpose>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmittedStatus: ResolverTypeWrapper<SubmittedStatus>;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessStatus: ResolverTypeWrapper<SuccessStatus>;
  Tai64Timestamp: ResolverTypeWrapper<Scalars['Tai64Timestamp']['output']>;
  Transaction: ResolverTypeWrapper<
    Omit<Transaction, 'inputs' | 'outputs' | 'status' | 'upgradePurpose'> & {
      inputs?: Maybe<Array<ResolversTypes['Input']>>;
      outputs: Array<ResolversTypes['Output']>;
      status?: Maybe<ResolversTypes['TransactionStatus']>;
      upgradePurpose?: Maybe<ResolversTypes['UpgradePurpose']>;
    }
  >;
  TransactionConnection: ResolverTypeWrapper<TransactionConnection>;
  TransactionEdge: ResolverTypeWrapper<TransactionEdge>;
  TransactionId: ResolverTypeWrapper<Scalars['TransactionId']['output']>;
  TransactionStatus: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['TransactionStatus']
  >;
  TxParameters: ResolverTypeWrapper<TxParameters>;
  TxParametersVersion: TxParametersVersion;
  TxPointer: ResolverTypeWrapper<Scalars['TxPointer']['output']>;
  U16: ResolverTypeWrapper<Scalars['U16']['output']>;
  U32: ResolverTypeWrapper<Scalars['U32']['output']>;
  U64: ResolverTypeWrapper<Scalars['U64']['output']>;
  UpgradePurpose: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['UpgradePurpose']
  >;
  UtxoId: ResolverTypeWrapper<Scalars['UtxoId']['output']>;
  VariableOutput: ResolverTypeWrapper<VariableOutput>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: Scalars['Address']['output'];
  AssetId: Scalars['AssetId']['output'];
  Balance: Balance;
  BalanceConnection: BalanceConnection;
  BalanceEdge: BalanceEdge;
  BalanceFilterInput: BalanceFilterInput;
  Block: Omit<Block, 'consensus'> & {
    consensus: ResolversParentTypes['Consensus'];
  };
  BlockConnection: BlockConnection;
  BlockEdge: BlockEdge;
  BlockId: Scalars['BlockId']['output'];
  Boolean: Scalars['Boolean']['output'];
  Breakpoint: Breakpoint;
  Bytes32: Scalars['Bytes32']['output'];
  ChainInfo: ChainInfo;
  ChangeOutput: ChangeOutput;
  Coin: Coin;
  CoinConnection: CoinConnection;
  CoinEdge: CoinEdge;
  CoinFilterInput: CoinFilterInput;
  CoinOutput: CoinOutput;
  CoinType: ResolversUnionTypes<ResolversParentTypes>['CoinType'];
  Consensus: ResolversUnionTypes<ResolversParentTypes>['Consensus'];
  ConsensusParameters: ConsensusParameters;
  ConsensusParametersPurpose: ConsensusParametersPurpose;
  Contract: Contract;
  ContractBalance: ContractBalance;
  ContractBalanceConnection: ContractBalanceConnection;
  ContractBalanceEdge: ContractBalanceEdge;
  ContractBalanceFilterInput: ContractBalanceFilterInput;
  ContractCreated: ContractCreated;
  ContractId: Scalars['ContractId']['output'];
  ContractOutput: ContractOutput;
  ContractParameters: ContractParameters;
  DependentCost: ResolversUnionTypes<ResolversParentTypes>['DependentCost'];
  DryRunFailureStatus: DryRunFailureStatus;
  DryRunSuccessStatus: DryRunSuccessStatus;
  DryRunTransactionExecutionStatus: Omit<
    DryRunTransactionExecutionStatus,
    'status'
  > & { status: ResolversParentTypes['DryRunTransactionStatus'] };
  DryRunTransactionStatus: ResolversUnionTypes<ResolversParentTypes>['DryRunTransactionStatus'];
  EstimateGasPrice: EstimateGasPrice;
  ExcludeInput: ExcludeInput;
  FailureStatus: FailureStatus;
  FeeParameters: FeeParameters;
  Float: Scalars['Float']['output'];
  GasCosts: Omit<
    GasCosts,
    | 'alocDependentCost'
    | 'call'
    | 'ccp'
    | 'cfe'
    | 'cfeiDependentCost'
    | 'contractRoot'
    | 'croo'
    | 'csiz'
    | 'k256'
    | 'ldc'
    | 'logd'
    | 'mcl'
    | 'mcli'
    | 'mcp'
    | 'mcpi'
    | 'meq'
    | 'retd'
    | 's256'
    | 'scwq'
    | 'smo'
    | 'srwq'
    | 'stateRoot'
    | 'swwq'
    | 'vmInitialization'
  > & {
    alocDependentCost: ResolversParentTypes['DependentCost'];
    call: ResolversParentTypes['DependentCost'];
    ccp: ResolversParentTypes['DependentCost'];
    cfe: ResolversParentTypes['DependentCost'];
    cfeiDependentCost: ResolversParentTypes['DependentCost'];
    contractRoot: ResolversParentTypes['DependentCost'];
    croo: ResolversParentTypes['DependentCost'];
    csiz: ResolversParentTypes['DependentCost'];
    k256: ResolversParentTypes['DependentCost'];
    ldc: ResolversParentTypes['DependentCost'];
    logd: ResolversParentTypes['DependentCost'];
    mcl: ResolversParentTypes['DependentCost'];
    mcli: ResolversParentTypes['DependentCost'];
    mcp: ResolversParentTypes['DependentCost'];
    mcpi: ResolversParentTypes['DependentCost'];
    meq: ResolversParentTypes['DependentCost'];
    retd: ResolversParentTypes['DependentCost'];
    s256: ResolversParentTypes['DependentCost'];
    scwq: ResolversParentTypes['DependentCost'];
    smo: ResolversParentTypes['DependentCost'];
    srwq: ResolversParentTypes['DependentCost'];
    stateRoot: ResolversParentTypes['DependentCost'];
    swwq: ResolversParentTypes['DependentCost'];
    vmInitialization: ResolversParentTypes['DependentCost'];
  };
  Genesis: Genesis;
  Header: Header;
  HeavyOperation: HeavyOperation;
  HexString: Scalars['HexString']['output'];
  ID: Scalars['ID']['output'];
  Input: ResolversUnionTypes<ResolversParentTypes>['Input'];
  InputCoin: InputCoin;
  InputContract: InputContract;
  InputMessage: InputMessage;
  Int: Scalars['Int']['output'];
  LatestGasPrice: LatestGasPrice;
  LightOperation: LightOperation;
  MerkleProof: MerkleProof;
  Message: Message;
  MessageCoin: MessageCoin;
  MessageConnection: MessageConnection;
  MessageEdge: MessageEdge;
  MessageProof: MessageProof;
  MessageStatus: MessageStatus;
  Mutation: {};
  NodeInfo: NodeInfo;
  Nonce: Scalars['Nonce']['output'];
  Output: ResolversUnionTypes<ResolversParentTypes>['Output'];
  OutputBreakpoint: OutputBreakpoint;
  PageInfo: PageInfo;
  PeerInfo: PeerInfo;
  PoAConsensus: PoAConsensus;
  Policies: Policies;
  PredicateParameters: PredicateParameters;
  ProgramState: ProgramState;
  Query: {};
  Receipt: Receipt;
  RelayedTransactionFailed: RelayedTransactionFailed;
  RelayedTransactionId: Scalars['RelayedTransactionId']['output'];
  RelayedTransactionStatus: ResolversUnionTypes<ResolversParentTypes>['RelayedTransactionStatus'];
  RunResult: RunResult;
  Salt: Scalars['Salt']['output'];
  ScriptParameters: ScriptParameters;
  Signature: Scalars['Signature']['output'];
  SpendQueryElementInput: SpendQueryElementInput;
  SqueezedOutStatus: SqueezedOutStatus;
  StateTransitionPurpose: StateTransitionPurpose;
  String: Scalars['String']['output'];
  SubmittedStatus: SubmittedStatus;
  Subscription: {};
  SuccessStatus: SuccessStatus;
  Tai64Timestamp: Scalars['Tai64Timestamp']['output'];
  Transaction: Omit<
    Transaction,
    'inputs' | 'outputs' | 'status' | 'upgradePurpose'
  > & {
    inputs?: Maybe<Array<ResolversParentTypes['Input']>>;
    outputs: Array<ResolversParentTypes['Output']>;
    status?: Maybe<ResolversParentTypes['TransactionStatus']>;
    upgradePurpose?: Maybe<ResolversParentTypes['UpgradePurpose']>;
  };
  TransactionConnection: TransactionConnection;
  TransactionEdge: TransactionEdge;
  TransactionId: Scalars['TransactionId']['output'];
  TransactionStatus: ResolversUnionTypes<ResolversParentTypes>['TransactionStatus'];
  TxParameters: TxParameters;
  TxPointer: Scalars['TxPointer']['output'];
  U16: Scalars['U16']['output'];
  U32: Scalars['U32']['output'];
  U64: Scalars['U64']['output'];
  UpgradePurpose: ResolversUnionTypes<ResolversParentTypes>['UpgradePurpose'];
  UtxoId: Scalars['UtxoId']['output'];
  VariableOutput: VariableOutput;
}>;

export interface AddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Address'], any> {
  name: 'Address';
}

export interface AssetIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['AssetId'], any> {
  name: 'AssetId';
}

export type BalanceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Balance'] = ResolversParentTypes['Balance'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BalanceConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BalanceConnection'] = ResolversParentTypes['BalanceConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['BalanceEdge']>,
    ParentType,
    ContextType
  >;
  nodes?: Resolver<Array<ResolversTypes['Balance']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BalanceEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BalanceEdge'] = ResolversParentTypes['BalanceEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Balance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlockResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Block'] = ResolversParentTypes['Block'],
> = ResolversObject<{
  consensus?: Resolver<ResolversTypes['Consensus'], ParentType, ContextType>;
  header?: Resolver<ResolversTypes['Header'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BlockId'], ParentType, ContextType>;
  transactionIds?: Resolver<
    Array<ResolversTypes['TransactionId']>,
    ParentType,
    ContextType
  >;
  transactions?: Resolver<
    Array<ResolversTypes['Transaction']>,
    ParentType,
    ContextType
  >;
  version?: Resolver<ResolversTypes['BlockVersion'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlockConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockConnection'] = ResolversParentTypes['BlockConnection'],
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['BlockEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Block']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlockEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockEdge'] = ResolversParentTypes['BlockEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BlockIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BlockId'], any> {
  name: 'BlockId';
}

export interface Bytes32ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Bytes32'], any> {
  name: 'Bytes32';
}

export type ChainInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ChainInfo'] = ResolversParentTypes['ChainInfo'],
> = ResolversObject<{
  consensusParameters?: Resolver<
    ResolversTypes['ConsensusParameters'],
    ParentType,
    ContextType
  >;
  daHeight?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gasCosts?: Resolver<ResolversTypes['GasCosts'], ParentType, ContextType>;
  latestBlock?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ChangeOutput'] = ResolversParentTypes['ChangeOutput'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Coin'] = ResolversParentTypes['Coin'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  blockCreated?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  txCreatedIdx?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  utxoId?: Resolver<ResolversTypes['UtxoId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CoinConnection'] = ResolversParentTypes['CoinConnection'],
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['CoinEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Coin']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CoinEdge'] = ResolversParentTypes['CoinEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Coin'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CoinOutput'] = ResolversParentTypes['CoinOutput'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoinTypeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CoinType'] = ResolversParentTypes['CoinType'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<'Coin' | 'MessageCoin', ParentType, ContextType>;
}>;

export type ConsensusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Consensus'] = ResolversParentTypes['Consensus'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Genesis' | 'PoAConsensus',
    ParentType,
    ContextType
  >;
}>;

export type ConsensusParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ConsensusParameters'] = ResolversParentTypes['ConsensusParameters'],
> = ResolversObject<{
  baseAssetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  blockGasLimit?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  contractParams?: Resolver<
    ResolversTypes['ContractParameters'],
    ParentType,
    ContextType
  >;
  feeParams?: Resolver<
    ResolversTypes['FeeParameters'],
    ParentType,
    ContextType
  >;
  gasCosts?: Resolver<ResolversTypes['GasCosts'], ParentType, ContextType>;
  predicateParams?: Resolver<
    ResolversTypes['PredicateParameters'],
    ParentType,
    ContextType
  >;
  privilegedAddress?: Resolver<
    ResolversTypes['Address'],
    ParentType,
    ContextType
  >;
  scriptParams?: Resolver<
    ResolversTypes['ScriptParameters'],
    ParentType,
    ContextType
  >;
  txParams?: Resolver<ResolversTypes['TxParameters'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['ConsensusParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConsensusParametersPurposeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ConsensusParametersPurpose'] = ResolversParentTypes['ConsensusParametersPurpose'],
> = ResolversObject<{
  checksum?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  witnessIndex?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Contract'] = ResolversParentTypes['Contract'],
> = ResolversObject<{
  bytecode?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ContractId'], ParentType, ContextType>;
  salt?: Resolver<ResolversTypes['Salt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractBalanceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractBalance'] = ResolversParentTypes['ContractBalance'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  contract?: Resolver<ResolversTypes['ContractId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractBalanceConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractBalanceConnection'] = ResolversParentTypes['ContractBalanceConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['ContractBalanceEdge']>,
    ParentType,
    ContextType
  >;
  nodes?: Resolver<
    Array<ResolversTypes['ContractBalance']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractBalanceEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractBalanceEdge'] = ResolversParentTypes['ContractBalanceEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ContractBalance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractCreated'] = ResolversParentTypes['ContractCreated'],
> = ResolversObject<{
  contract?: Resolver<ResolversTypes['ContractId'], ParentType, ContextType>;
  stateRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ContractIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['ContractId'], any> {
  name: 'ContractId';
}

export type ContractOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractOutput'] = ResolversParentTypes['ContractOutput'],
> = ResolversObject<{
  balanceRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  inputIndex?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  stateRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContractParameters'] = ResolversParentTypes['ContractParameters'],
> = ResolversObject<{
  contractMaxSize?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  maxStorageSlots?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['ContractParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DependentCostResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DependentCost'] = ResolversParentTypes['DependentCost'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'HeavyOperation' | 'LightOperation',
    ParentType,
    ContextType
  >;
}>;

export type DryRunFailureStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DryRunFailureStatus'] = ResolversParentTypes['DryRunFailureStatus'],
> = ResolversObject<{
  programState?: Resolver<
    Maybe<ResolversTypes['ProgramState']>,
    ParentType,
    ContextType
  >;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  receipts?: Resolver<
    Array<ResolversTypes['Receipt']>,
    ParentType,
    ContextType
  >;
  totalFee?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  totalGas?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DryRunSuccessStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DryRunSuccessStatus'] = ResolversParentTypes['DryRunSuccessStatus'],
> = ResolversObject<{
  programState?: Resolver<
    Maybe<ResolversTypes['ProgramState']>,
    ParentType,
    ContextType
  >;
  receipts?: Resolver<
    Array<ResolversTypes['Receipt']>,
    ParentType,
    ContextType
  >;
  totalFee?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  totalGas?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DryRunTransactionExecutionStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DryRunTransactionExecutionStatus'] = ResolversParentTypes['DryRunTransactionExecutionStatus'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['TransactionId'], ParentType, ContextType>;
  receipts?: Resolver<
    Array<ResolversTypes['Receipt']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<
    ResolversTypes['DryRunTransactionStatus'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DryRunTransactionStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DryRunTransactionStatus'] = ResolversParentTypes['DryRunTransactionStatus'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'DryRunFailureStatus' | 'DryRunSuccessStatus',
    ParentType,
    ContextType
  >;
}>;

export type EstimateGasPriceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['EstimateGasPrice'] = ResolversParentTypes['EstimateGasPrice'],
> = ResolversObject<{
  gasPrice?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FailureStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FailureStatus'] = ResolversParentTypes['FailureStatus'],
> = ResolversObject<{
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  blockHeight?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  programState?: Resolver<
    Maybe<ResolversTypes['ProgramState']>,
    ParentType,
    ContextType
  >;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  receipts?: Resolver<
    Array<ResolversTypes['Receipt']>,
    ParentType,
    ContextType
  >;
  time?: Resolver<ResolversTypes['Tai64Timestamp'], ParentType, ContextType>;
  totalFee?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  totalGas?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  transactionId?: Resolver<
    ResolversTypes['TransactionId'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FeeParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FeeParameters'] = ResolversParentTypes['FeeParameters'],
> = ResolversObject<{
  gasPerByte?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gasPriceFactor?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['FeeParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GasCostsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['GasCosts'] = ResolversParentTypes['GasCosts'],
> = ResolversObject<{
  add?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  addi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  aloc?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  alocDependentCost?: Resolver<
    ResolversTypes['DependentCost'],
    ParentType,
    ContextType
  >;
  and?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  andi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  bal?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  bhei?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  bhsh?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  burn?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  call?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  cb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ccp?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  cfe?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  cfei?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  cfeiDependentCost?: Resolver<
    ResolversTypes['DependentCost'],
    ParentType,
    ContextType
  >;
  cfsi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  contractRoot?: Resolver<
    ResolversTypes['DependentCost'],
    ParentType,
    ContextType
  >;
  croo?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  csiz?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  div?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  divi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  eck1?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ecr1?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ed19?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  eq?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  exp?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  expi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  flag?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gm?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gt?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gtf?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ji?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jmp?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jmpb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jmpf?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jne?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jneb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jnef?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jnei?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jnzb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jnzf?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  jnzi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  k256?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  lb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ldc?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  log?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  logd?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  lt?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  lw?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  mcl?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  mcli?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  mcp?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  mcpi?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  meq?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  mint?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  mldv?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  mlog?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  modOp?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  modi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  moveOp?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  movi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  mroo?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  mul?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  muli?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  newStoragePerByte?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  noop?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  not?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  or?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ori?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  poph?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  popl?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  pshh?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  pshl?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  ret?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  retd?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  rvrt?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  s256?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  sb?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  scwq?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  sll?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  slli?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  smo?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  srl?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  srli?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  srw?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  srwq?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  stateRoot?: Resolver<
    ResolversTypes['DependentCost'],
    ParentType,
    ContextType
  >;
  sub?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  subi?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  sw?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  sww?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  swwq?: Resolver<ResolversTypes['DependentCost'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  tr?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  tro?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['GasCostsVersion'],
    ParentType,
    ContextType
  >;
  vmInitialization?: Resolver<
    ResolversTypes['DependentCost'],
    ParentType,
    ContextType
  >;
  wdam?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wdcm?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wddv?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wdmd?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wdml?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wdmm?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wdop?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqam?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqcm?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqdv?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqmd?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqml?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqmm?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  wqop?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  xor?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  xori?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenesisResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Genesis'] = ResolversParentTypes['Genesis'],
> = ResolversObject<{
  chainConfigHash?: Resolver<
    ResolversTypes['Bytes32'],
    ParentType,
    ContextType
  >;
  coinsRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  contractsRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  messagesRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  transactionsRoot?: Resolver<
    ResolversTypes['Bytes32'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HeaderResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Header'] = ResolversParentTypes['Header'],
> = ResolversObject<{
  applicationHash?: Resolver<
    ResolversTypes['Bytes32'],
    ParentType,
    ContextType
  >;
  consensusParametersVersion?: Resolver<
    ResolversTypes['U32'],
    ParentType,
    ContextType
  >;
  daHeight?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  eventInboxRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BlockId'], ParentType, ContextType>;
  messageOutboxRoot?: Resolver<
    ResolversTypes['Bytes32'],
    ParentType,
    ContextType
  >;
  messageReceiptCount?: Resolver<
    ResolversTypes['U32'],
    ParentType,
    ContextType
  >;
  prevRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  stateTransitionBytecodeVersion?: Resolver<
    ResolversTypes['U32'],
    ParentType,
    ContextType
  >;
  time?: Resolver<ResolversTypes['Tai64Timestamp'], ParentType, ContextType>;
  transactionsCount?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  transactionsRoot?: Resolver<
    ResolversTypes['Bytes32'],
    ParentType,
    ContextType
  >;
  version?: Resolver<ResolversTypes['HeaderVersion'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HeavyOperationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['HeavyOperation'] = ResolversParentTypes['HeavyOperation'],
> = ResolversObject<{
  base?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  gasPerUnit?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface HexStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['HexString'], any> {
  name: 'HexString';
}

export type InputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Input'] = ResolversParentTypes['Input'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'InputCoin' | 'InputContract' | 'InputMessage',
    ParentType,
    ContextType
  >;
}>;

export type InputCoinResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InputCoin'] = ResolversParentTypes['InputCoin'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  predicateData?: Resolver<
    ResolversTypes['HexString'],
    ParentType,
    ContextType
  >;
  predicateGasUsed?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  txPointer?: Resolver<ResolversTypes['TxPointer'], ParentType, ContextType>;
  utxoId?: Resolver<ResolversTypes['UtxoId'], ParentType, ContextType>;
  witnessIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InputContractResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InputContract'] = ResolversParentTypes['InputContract'],
> = ResolversObject<{
  balanceRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  contractId?: Resolver<ResolversTypes['ContractId'], ParentType, ContextType>;
  stateRoot?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  txPointer?: Resolver<ResolversTypes['TxPointer'], ParentType, ContextType>;
  utxoId?: Resolver<ResolversTypes['UtxoId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InputMessageResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InputMessage'] = ResolversParentTypes['InputMessage'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Nonce'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  predicateData?: Resolver<
    ResolversTypes['HexString'],
    ParentType,
    ContextType
  >;
  predicateGasUsed?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  witnessIndex?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LatestGasPriceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LatestGasPrice'] = ResolversParentTypes['LatestGasPrice'],
> = ResolversObject<{
  blockHeight?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LightOperationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LightOperation'] = ResolversParentTypes['LightOperation'],
> = ResolversObject<{
  base?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  unitsPerGas?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MerkleProofResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MerkleProof'] = ResolversParentTypes['MerkleProof'],
> = ResolversObject<{
  proofIndex?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  proofSet?: Resolver<
    Array<ResolversTypes['Bytes32']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Message'] = ResolversParentTypes['Message'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  daHeight?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Nonce'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageCoinResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageCoin'] = ResolversParentTypes['MessageCoin'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  daHeight?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Nonce'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageConnection'] = ResolversParentTypes['MessageConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['MessageEdge']>,
    ParentType,
    ContextType
  >;
  nodes?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageEdge'] = ResolversParentTypes['MessageEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageProofResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageProof'] = ResolversParentTypes['MessageProof'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  blockProof?: Resolver<ResolversTypes['MerkleProof'], ParentType, ContextType>;
  commitBlockHeader?: Resolver<
    ResolversTypes['Header'],
    ParentType,
    ContextType
  >;
  data?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  messageBlockHeader?: Resolver<
    ResolversTypes['Header'],
    ParentType,
    ContextType
  >;
  messageProof?: Resolver<
    ResolversTypes['MerkleProof'],
    ParentType,
    ContextType
  >;
  nonce?: Resolver<ResolversTypes['Nonce'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageStatus'] = ResolversParentTypes['MessageStatus'],
> = ResolversObject<{
  state?: Resolver<ResolversTypes['MessageState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  continueTx?: Resolver<
    ResolversTypes['RunResult'],
    ParentType,
    ContextType,
    RequireFields<MutationContinueTxArgs, 'id'>
  >;
  dryRun?: Resolver<
    Array<ResolversTypes['DryRunTransactionExecutionStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDryRunArgs, 'txs'>
  >;
  endSession?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationEndSessionArgs, 'id'>
  >;
  execute?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationExecuteArgs, 'id' | 'op'>
  >;
  produceBlocks?: Resolver<
    ResolversTypes['U32'],
    ParentType,
    ContextType,
    RequireFields<MutationProduceBlocksArgs, 'blocksToProduce'>
  >;
  reset?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationResetArgs, 'id'>
  >;
  setBreakpoint?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationSetBreakpointArgs, 'breakpoint' | 'id'>
  >;
  setSingleStepping?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationSetSingleSteppingArgs, 'enable' | 'id'>
  >;
  startSession?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startTx?: Resolver<
    ResolversTypes['RunResult'],
    ParentType,
    ContextType,
    RequireFields<MutationStartTxArgs, 'id' | 'txJson'>
  >;
  submit?: Resolver<
    ResolversTypes['Transaction'],
    ParentType,
    ContextType,
    RequireFields<MutationSubmitArgs, 'tx'>
  >;
}>;

export type NodeInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NodeInfo'] = ResolversParentTypes['NodeInfo'],
> = ResolversObject<{
  maxDepth?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  maxTx?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  nodeVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  peers?: Resolver<Array<ResolversTypes['PeerInfo']>, ParentType, ContextType>;
  utxoValidation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  vmBacktrace?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface NonceScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Nonce'], any> {
  name: 'Nonce';
}

export type OutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Output'] = ResolversParentTypes['Output'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | 'ChangeOutput'
    | 'CoinOutput'
    | 'ContractCreated'
    | 'ContractOutput'
    | 'VariableOutput',
    ParentType,
    ContextType
  >;
}>;

export type OutputBreakpointResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OutputBreakpoint'] = ResolversParentTypes['OutputBreakpoint'],
> = ResolversObject<{
  contract?: Resolver<ResolversTypes['ContractId'], ParentType, ContextType>;
  pc?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = ResolversObject<{
  endCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PeerInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PeerInfo'] = ResolversParentTypes['PeerInfo'],
> = ResolversObject<{
  addresses?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  appScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  blockHeight?: Resolver<Maybe<ResolversTypes['U32']>, ParentType, ContextType>;
  clientVersion?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastHeartbeatMs?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoAConsensusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PoAConsensus'] = ResolversParentTypes['PoAConsensus'],
> = ResolversObject<{
  signature?: Resolver<ResolversTypes['Signature'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoliciesResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Policies'] = ResolversParentTypes['Policies'],
> = ResolversObject<{
  maturity?: Resolver<Maybe<ResolversTypes['U32']>, ParentType, ContextType>;
  maxFee?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  tip?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  witnessLimit?: Resolver<
    Maybe<ResolversTypes['U64']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PredicateParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PredicateParameters'] = ResolversParentTypes['PredicateParameters'],
> = ResolversObject<{
  maxGasPerPredicate?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  maxMessageDataLength?: Resolver<
    ResolversTypes['U64'],
    ParentType,
    ContextType
  >;
  maxPredicateDataLength?: Resolver<
    ResolversTypes['U64'],
    ParentType,
    ContextType
  >;
  maxPredicateLength?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['PredicateParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProgramStateResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ProgramState'] = ResolversParentTypes['ProgramState'],
> = ResolversObject<{
  data?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  returnType?: Resolver<ResolversTypes['ReturnType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  balance?: Resolver<
    ResolversTypes['Balance'],
    ParentType,
    ContextType,
    RequireFields<QueryBalanceArgs, 'assetId' | 'owner'>
  >;
  balances?: Resolver<
    ResolversTypes['BalanceConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryBalancesArgs, 'filter'>
  >;
  block?: Resolver<
    Maybe<ResolversTypes['Block']>,
    ParentType,
    ContextType,
    Partial<QueryBlockArgs>
  >;
  blocks?: Resolver<
    ResolversTypes['BlockConnection'],
    ParentType,
    ContextType,
    Partial<QueryBlocksArgs>
  >;
  chain?: Resolver<ResolversTypes['ChainInfo'], ParentType, ContextType>;
  coin?: Resolver<
    Maybe<ResolversTypes['Coin']>,
    ParentType,
    ContextType,
    RequireFields<QueryCoinArgs, 'utxoId'>
  >;
  coins?: Resolver<
    ResolversTypes['CoinConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryCoinsArgs, 'filter'>
  >;
  coinsToSpend?: Resolver<
    Array<Array<ResolversTypes['CoinType']>>,
    ParentType,
    ContextType,
    RequireFields<QueryCoinsToSpendArgs, 'owner' | 'queryPerAsset'>
  >;
  contract?: Resolver<
    Maybe<ResolversTypes['Contract']>,
    ParentType,
    ContextType,
    RequireFields<QueryContractArgs, 'id'>
  >;
  contractBalance?: Resolver<
    ResolversTypes['ContractBalance'],
    ParentType,
    ContextType,
    RequireFields<QueryContractBalanceArgs, 'asset' | 'contract'>
  >;
  contractBalances?: Resolver<
    ResolversTypes['ContractBalanceConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryContractBalancesArgs, 'filter'>
  >;
  estimateGasPrice?: Resolver<
    ResolversTypes['EstimateGasPrice'],
    ParentType,
    ContextType,
    Partial<QueryEstimateGasPriceArgs>
  >;
  estimatePredicates?: Resolver<
    ResolversTypes['Transaction'],
    ParentType,
    ContextType,
    RequireFields<QueryEstimatePredicatesArgs, 'tx'>
  >;
  health?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  latestGasPrice?: Resolver<
    ResolversTypes['LatestGasPrice'],
    ParentType,
    ContextType
  >;
  memory?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<QueryMemoryArgs, 'id' | 'size' | 'start'>
  >;
  message?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<QueryMessageArgs, 'nonce'>
  >;
  messageProof?: Resolver<
    Maybe<ResolversTypes['MessageProof']>,
    ParentType,
    ContextType,
    RequireFields<QueryMessageProofArgs, 'nonce' | 'transactionId'>
  >;
  messageStatus?: Resolver<
    ResolversTypes['MessageStatus'],
    ParentType,
    ContextType,
    RequireFields<QueryMessageStatusArgs, 'nonce'>
  >;
  messages?: Resolver<
    ResolversTypes['MessageConnection'],
    ParentType,
    ContextType,
    Partial<QueryMessagesArgs>
  >;
  nodeInfo?: Resolver<ResolversTypes['NodeInfo'], ParentType, ContextType>;
  register?: Resolver<
    ResolversTypes['U64'],
    ParentType,
    ContextType,
    RequireFields<QueryRegisterArgs, 'id' | 'register'>
  >;
  relayedTransactionStatus?: Resolver<
    Maybe<ResolversTypes['RelayedTransactionStatus']>,
    ParentType,
    ContextType,
    RequireFields<QueryRelayedTransactionStatusArgs, 'id'>
  >;
  transaction?: Resolver<
    Maybe<ResolversTypes['Transaction']>,
    ParentType,
    ContextType,
    RequireFields<QueryTransactionArgs, 'id'>
  >;
  transactions?: Resolver<
    ResolversTypes['TransactionConnection'],
    ParentType,
    ContextType,
    Partial<QueryTransactionsArgs>
  >;
  transactionsByOwner?: Resolver<
    ResolversTypes['TransactionConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryTransactionsByOwnerArgs, 'owner'>
  >;
}>;

export type ReceiptResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Receipt'] = ResolversParentTypes['Receipt'],
> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  assetId?: Resolver<Maybe<ResolversTypes['AssetId']>, ParentType, ContextType>;
  contractId?: Resolver<
    Maybe<ResolversTypes['ContractId']>,
    ParentType,
    ContextType
  >;
  data?: Resolver<Maybe<ResolversTypes['HexString']>, ParentType, ContextType>;
  digest?: Resolver<Maybe<ResolversTypes['Bytes32']>, ParentType, ContextType>;
  gas?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ContractId']>, ParentType, ContextType>;
  is?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  len?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  nonce?: Resolver<Maybe<ResolversTypes['Nonce']>, ParentType, ContextType>;
  param1?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  param2?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  pc?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  ptr?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  ra?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  rb?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  rc?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  rd?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  receiptType?: Resolver<
    ResolversTypes['ReceiptType'],
    ParentType,
    ContextType
  >;
  recipient?: Resolver<
    Maybe<ResolversTypes['Address']>,
    ParentType,
    ContextType
  >;
  result?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  subId?: Resolver<Maybe<ResolversTypes['Bytes32']>, ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['ContractId']>, ParentType, ContextType>;
  toAddress?: Resolver<
    Maybe<ResolversTypes['Address']>,
    ParentType,
    ContextType
  >;
  val?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RelayedTransactionFailedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RelayedTransactionFailed'] = ResolversParentTypes['RelayedTransactionFailed'],
> = ResolversObject<{
  blockHeight?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  failure?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface RelayedTransactionIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['RelayedTransactionId'], any> {
  name: 'RelayedTransactionId';
}

export type RelayedTransactionStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RelayedTransactionStatus'] = ResolversParentTypes['RelayedTransactionStatus'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'RelayedTransactionFailed',
    ParentType,
    ContextType
  >;
}>;

export type RunResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RunResult'] = ResolversParentTypes['RunResult'],
> = ResolversObject<{
  breakpoint?: Resolver<
    Maybe<ResolversTypes['OutputBreakpoint']>,
    ParentType,
    ContextType
  >;
  jsonReceipts?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['RunState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface SaltScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Salt'], any> {
  name: 'Salt';
}

export type ScriptParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ScriptParameters'] = ResolversParentTypes['ScriptParameters'],
> = ResolversObject<{
  maxScriptDataLength?: Resolver<
    ResolversTypes['U64'],
    ParentType,
    ContextType
  >;
  maxScriptLength?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['ScriptParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface SignatureScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Signature'], any> {
  name: 'Signature';
}

export type SqueezedOutStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SqueezedOutStatus'] = ResolversParentTypes['SqueezedOutStatus'],
> = ResolversObject<{
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StateTransitionPurposeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StateTransitionPurpose'] = ResolversParentTypes['StateTransitionPurpose'],
> = ResolversObject<{
  root?: Resolver<ResolversTypes['Bytes32'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmittedStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SubmittedStatus'] = ResolversParentTypes['SubmittedStatus'],
> = ResolversObject<{
  time?: Resolver<ResolversTypes['Tai64Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = ResolversObject<{
  statusChange?: SubscriptionResolver<
    ResolversTypes['TransactionStatus'],
    'statusChange',
    ParentType,
    ContextType,
    RequireFields<SubscriptionStatusChangeArgs, 'id'>
  >;
  submitAndAwait?: SubscriptionResolver<
    ResolversTypes['TransactionStatus'],
    'submitAndAwait',
    ParentType,
    ContextType,
    RequireFields<SubscriptionSubmitAndAwaitArgs, 'tx'>
  >;
}>;

export type SuccessStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SuccessStatus'] = ResolversParentTypes['SuccessStatus'],
> = ResolversObject<{
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  blockHeight?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  programState?: Resolver<
    Maybe<ResolversTypes['ProgramState']>,
    ParentType,
    ContextType
  >;
  receipts?: Resolver<
    Array<ResolversTypes['Receipt']>,
    ParentType,
    ContextType
  >;
  time?: Resolver<ResolversTypes['Tai64Timestamp'], ParentType, ContextType>;
  totalFee?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  totalGas?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  transactionId?: Resolver<
    ResolversTypes['TransactionId'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Tai64TimestampScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Tai64Timestamp'], any> {
  name: 'Tai64Timestamp';
}

export type TransactionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction'],
> = ResolversObject<{
  bytecodeRoot?: Resolver<
    Maybe<ResolversTypes['Bytes32']>,
    ParentType,
    ContextType
  >;
  bytecodeWitnessIndex?: Resolver<
    Maybe<ResolversTypes['U16']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['TransactionId'], ParentType, ContextType>;
  inputAssetIds?: Resolver<
    Maybe<Array<ResolversTypes['AssetId']>>,
    ParentType,
    ContextType
  >;
  inputContract?: Resolver<
    Maybe<ResolversTypes['InputContract']>,
    ParentType,
    ContextType
  >;
  inputContracts?: Resolver<
    Maybe<Array<ResolversTypes['ContractId']>>,
    ParentType,
    ContextType
  >;
  inputs?: Resolver<
    Maybe<Array<ResolversTypes['Input']>>,
    ParentType,
    ContextType
  >;
  isCreate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isMint?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isScript?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isUpgrade?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isUpload?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maturity?: Resolver<Maybe<ResolversTypes['U32']>, ParentType, ContextType>;
  mintAmount?: Resolver<Maybe<ResolversTypes['U64']>, ParentType, ContextType>;
  mintAssetId?: Resolver<
    Maybe<ResolversTypes['AssetId']>,
    ParentType,
    ContextType
  >;
  mintGasPrice?: Resolver<
    Maybe<ResolversTypes['U64']>,
    ParentType,
    ContextType
  >;
  outputContract?: Resolver<
    Maybe<ResolversTypes['ContractOutput']>,
    ParentType,
    ContextType
  >;
  outputs?: Resolver<Array<ResolversTypes['Output']>, ParentType, ContextType>;
  policies?: Resolver<
    Maybe<ResolversTypes['Policies']>,
    ParentType,
    ContextType
  >;
  proofSet?: Resolver<
    Maybe<Array<ResolversTypes['Bytes32']>>,
    ParentType,
    ContextType
  >;
  rawPayload?: Resolver<ResolversTypes['HexString'], ParentType, ContextType>;
  receiptsRoot?: Resolver<
    Maybe<ResolversTypes['Bytes32']>,
    ParentType,
    ContextType
  >;
  salt?: Resolver<Maybe<ResolversTypes['Salt']>, ParentType, ContextType>;
  script?: Resolver<
    Maybe<ResolversTypes['HexString']>,
    ParentType,
    ContextType
  >;
  scriptData?: Resolver<
    Maybe<ResolversTypes['HexString']>,
    ParentType,
    ContextType
  >;
  scriptGasLimit?: Resolver<
    Maybe<ResolversTypes['U64']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<
    Maybe<ResolversTypes['TransactionStatus']>,
    ParentType,
    ContextType
  >;
  storageSlots?: Resolver<
    Maybe<Array<ResolversTypes['HexString']>>,
    ParentType,
    ContextType
  >;
  subsectionIndex?: Resolver<
    Maybe<ResolversTypes['U16']>,
    ParentType,
    ContextType
  >;
  subsectionsNumber?: Resolver<
    Maybe<ResolversTypes['U16']>,
    ParentType,
    ContextType
  >;
  txPointer?: Resolver<
    Maybe<ResolversTypes['TxPointer']>,
    ParentType,
    ContextType
  >;
  upgradePurpose?: Resolver<
    Maybe<ResolversTypes['UpgradePurpose']>,
    ParentType,
    ContextType
  >;
  witnesses?: Resolver<
    Maybe<Array<ResolversTypes['HexString']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionConnection'] = ResolversParentTypes['TransactionConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['TransactionEdge']>,
    ParentType,
    ContextType
  >;
  nodes?: Resolver<
    Array<ResolversTypes['Transaction']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionEdge'] = ResolversParentTypes['TransactionEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TransactionIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['TransactionId'], any> {
  name: 'TransactionId';
}

export type TransactionStatusResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionStatus'] = ResolversParentTypes['TransactionStatus'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'FailureStatus' | 'SqueezedOutStatus' | 'SubmittedStatus' | 'SuccessStatus',
    ParentType,
    ContextType
  >;
}>;

export type TxParametersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TxParameters'] = ResolversParentTypes['TxParameters'],
> = ResolversObject<{
  maxBytecodeSubsections?: Resolver<
    ResolversTypes['U16'],
    ParentType,
    ContextType
  >;
  maxGasPerTx?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  maxInputs?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  maxOutputs?: Resolver<ResolversTypes['U16'], ParentType, ContextType>;
  maxSize?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  maxWitnesses?: Resolver<ResolversTypes['U32'], ParentType, ContextType>;
  version?: Resolver<
    ResolversTypes['TxParametersVersion'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TxPointerScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['TxPointer'], any> {
  name: 'TxPointer';
}

export interface U16ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['U16'], any> {
  name: 'U16';
}

export interface U32ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['U32'], any> {
  name: 'U32';
}

export interface U64ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['U64'], any> {
  name: 'U64';
}

export type UpgradePurposeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UpgradePurpose'] = ResolversParentTypes['UpgradePurpose'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ConsensusParametersPurpose' | 'StateTransitionPurpose',
    ParentType,
    ContextType
  >;
}>;

export interface UtxoIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['UtxoId'], any> {
  name: 'UtxoId';
}

export type VariableOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VariableOutput'] = ResolversParentTypes['VariableOutput'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['U64'], ParentType, ContextType>;
  assetId?: Resolver<ResolversTypes['AssetId'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Address?: GraphQLScalarType;
  AssetId?: GraphQLScalarType;
  Balance?: BalanceResolvers<ContextType>;
  BalanceConnection?: BalanceConnectionResolvers<ContextType>;
  BalanceEdge?: BalanceEdgeResolvers<ContextType>;
  Block?: BlockResolvers<ContextType>;
  BlockConnection?: BlockConnectionResolvers<ContextType>;
  BlockEdge?: BlockEdgeResolvers<ContextType>;
  BlockId?: GraphQLScalarType;
  Bytes32?: GraphQLScalarType;
  ChainInfo?: ChainInfoResolvers<ContextType>;
  ChangeOutput?: ChangeOutputResolvers<ContextType>;
  Coin?: CoinResolvers<ContextType>;
  CoinConnection?: CoinConnectionResolvers<ContextType>;
  CoinEdge?: CoinEdgeResolvers<ContextType>;
  CoinOutput?: CoinOutputResolvers<ContextType>;
  CoinType?: CoinTypeResolvers<ContextType>;
  Consensus?: ConsensusResolvers<ContextType>;
  ConsensusParameters?: ConsensusParametersResolvers<ContextType>;
  ConsensusParametersPurpose?: ConsensusParametersPurposeResolvers<ContextType>;
  Contract?: ContractResolvers<ContextType>;
  ContractBalance?: ContractBalanceResolvers<ContextType>;
  ContractBalanceConnection?: ContractBalanceConnectionResolvers<ContextType>;
  ContractBalanceEdge?: ContractBalanceEdgeResolvers<ContextType>;
  ContractCreated?: ContractCreatedResolvers<ContextType>;
  ContractId?: GraphQLScalarType;
  ContractOutput?: ContractOutputResolvers<ContextType>;
  ContractParameters?: ContractParametersResolvers<ContextType>;
  DependentCost?: DependentCostResolvers<ContextType>;
  DryRunFailureStatus?: DryRunFailureStatusResolvers<ContextType>;
  DryRunSuccessStatus?: DryRunSuccessStatusResolvers<ContextType>;
  DryRunTransactionExecutionStatus?: DryRunTransactionExecutionStatusResolvers<ContextType>;
  DryRunTransactionStatus?: DryRunTransactionStatusResolvers<ContextType>;
  EstimateGasPrice?: EstimateGasPriceResolvers<ContextType>;
  FailureStatus?: FailureStatusResolvers<ContextType>;
  FeeParameters?: FeeParametersResolvers<ContextType>;
  GasCosts?: GasCostsResolvers<ContextType>;
  Genesis?: GenesisResolvers<ContextType>;
  Header?: HeaderResolvers<ContextType>;
  HeavyOperation?: HeavyOperationResolvers<ContextType>;
  HexString?: GraphQLScalarType;
  Input?: InputResolvers<ContextType>;
  InputCoin?: InputCoinResolvers<ContextType>;
  InputContract?: InputContractResolvers<ContextType>;
  InputMessage?: InputMessageResolvers<ContextType>;
  LatestGasPrice?: LatestGasPriceResolvers<ContextType>;
  LightOperation?: LightOperationResolvers<ContextType>;
  MerkleProof?: MerkleProofResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageCoin?: MessageCoinResolvers<ContextType>;
  MessageConnection?: MessageConnectionResolvers<ContextType>;
  MessageEdge?: MessageEdgeResolvers<ContextType>;
  MessageProof?: MessageProofResolvers<ContextType>;
  MessageStatus?: MessageStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NodeInfo?: NodeInfoResolvers<ContextType>;
  Nonce?: GraphQLScalarType;
  Output?: OutputResolvers<ContextType>;
  OutputBreakpoint?: OutputBreakpointResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PeerInfo?: PeerInfoResolvers<ContextType>;
  PoAConsensus?: PoAConsensusResolvers<ContextType>;
  Policies?: PoliciesResolvers<ContextType>;
  PredicateParameters?: PredicateParametersResolvers<ContextType>;
  ProgramState?: ProgramStateResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Receipt?: ReceiptResolvers<ContextType>;
  RelayedTransactionFailed?: RelayedTransactionFailedResolvers<ContextType>;
  RelayedTransactionId?: GraphQLScalarType;
  RelayedTransactionStatus?: RelayedTransactionStatusResolvers<ContextType>;
  RunResult?: RunResultResolvers<ContextType>;
  Salt?: GraphQLScalarType;
  ScriptParameters?: ScriptParametersResolvers<ContextType>;
  Signature?: GraphQLScalarType;
  SqueezedOutStatus?: SqueezedOutStatusResolvers<ContextType>;
  StateTransitionPurpose?: StateTransitionPurposeResolvers<ContextType>;
  SubmittedStatus?: SubmittedStatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SuccessStatus?: SuccessStatusResolvers<ContextType>;
  Tai64Timestamp?: GraphQLScalarType;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionConnection?: TransactionConnectionResolvers<ContextType>;
  TransactionEdge?: TransactionEdgeResolvers<ContextType>;
  TransactionId?: GraphQLScalarType;
  TransactionStatus?: TransactionStatusResolvers<ContextType>;
  TxParameters?: TxParametersResolvers<ContextType>;
  TxPointer?: GraphQLScalarType;
  U16?: GraphQLScalarType;
  U32?: GraphQLScalarType;
  U64?: GraphQLScalarType;
  UpgradePurpose?: UpgradePurposeResolvers<ContextType>;
  UtxoId?: GraphQLScalarType;
  VariableOutput?: VariableOutputResolvers<ContextType>;
}>;
