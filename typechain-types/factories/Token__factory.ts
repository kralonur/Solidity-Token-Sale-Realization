/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Token, TokenInterface } from "../Token";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x9994c311",
        type: "bytes32",
      },
    ],
    name: "c_0x9994c311",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001e6c38038062001e6c8339818101604052810190620000379190620001ce565b8181816003908051906020019062000051929190620000ac565b5080600490805190602001906200006a929190620000ac565b505050620000a17f2762f22cfe0d9c17811fa1ab70435175959eeaeeb4797c9381643ec49af8391a60001b620000a960201b60201c565b5050620003b1565b50565b828054620000ba90620002d6565b90600052602060002090601f016020900481019282620000de57600085556200012a565b82601f10620000f957805160ff19168380011785556200012a565b828001600101855582156200012a579182015b82811115620001295782518255916020019190600101906200010c565b5b5090506200013991906200013d565b5090565b5b80821115620001585760008160009055506001016200013e565b5090565b6000620001736200016d846200026a565b62000241565b9050828152602081018484840111156200018c57600080fd5b62000199848285620002a0565b509392505050565b600082601f830112620001b357600080fd5b8151620001c58482602086016200015c565b91505092915050565b60008060408385031215620001e257600080fd5b600083015167ffffffffffffffff811115620001fd57600080fd5b6200020b85828601620001a1565b925050602083015167ffffffffffffffff8111156200022957600080fd5b6200023785828601620001a1565b9150509250929050565b60006200024d62000260565b90506200025b82826200030c565b919050565b6000604051905090565b600067ffffffffffffffff82111562000288576200028762000371565b5b6200029382620003a0565b9050602081019050919050565b60005b83811015620002c0578082015181840152602081019050620002a3565b83811115620002d0576000848401525b50505050565b60006002820490506001821680620002ef57607f821691505b6020821081141562000306576200030562000342565b5b50919050565b6200031782620003a0565b810181811067ffffffffffffffff8211171562000339576200033862000371565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b611aab80620003c16000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806340c10f191161008c5780639dc29fac116100665780639dc29fac1461025f578063a457c2d71461027b578063a9059cbb146102ab578063dd62ed3e146102db576100ea565b806340c10f19146101f557806370a082311461021157806395d89b4114610241576100ea565b806323b872dd116100c857806323b872dd1461015b5780632f5e546a1461018b578063313ce567146101a757806339509351146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f761030b565b60405161010491906113cf565b60405180910390f35b6101276004803603810190610122919061118b565b61039d565b60405161013491906113b4565b60405180910390f35b6101456103bb565b6040516101529190611531565b60405180910390f35b6101756004803603810190610170919061113c565b6103c5565b60405161018291906113b4565b60405180910390f35b6101a560048036038101906101a091906111c7565b6104bd565b005b6101af6104c0565b6040516101bc919061154c565b60405180910390f35b6101df60048036038101906101da919061118b565b6104c9565b6040516101ec91906113b4565b60405180910390f35b61020f600480360381019061020a919061118b565b610575565b005b61022b600480360381019061022691906110d7565b610607565b6040516102389190611531565b60405180910390f35b61024961064f565b60405161025691906113cf565b60405180910390f35b6102796004803603810190610274919061118b565b6106e1565b005b6102956004803603810190610290919061118b565b610773565b6040516102a291906113b4565b60405180910390f35b6102c560048036038101906102c0919061118b565b61085e565b6040516102d291906113b4565b60405180910390f35b6102f560048036038101906102f09190611100565b61087c565b6040516103029190611531565b60405180910390f35b60606003805461031a9061169f565b80601f01602080910402602001604051908101604052809291908181526020018280546103469061169f565b80156103935780601f1061036857610100808354040283529160200191610393565b820191906000526020600020905b81548152906001019060200180831161037657829003601f168201915b5050505050905090565b60006103b16103aa610903565b848461090b565b6001905092915050565b6000600254905090565b60006103d2848484610ad6565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061041d610903565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561049d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049490611471565b60405180910390fd5b6104b1856104a9610903565b85840361090b565b60019150509392505050565b50565b60006012905090565b600061056b6104d6610903565b8484600160006104e4610903565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546105669190611583565b61090b565b6001905092915050565b6105a17f4b5b6f029eb215447e77de96665a75a5b6fb4f55aca1d6670d3000bbfe0408b160001b6104bd565b6105cd7f2a04b3ab4fd1b24766614566591bb466f77b952caa84cf473e5a7ed08e78e19c60001b6104bd565b6105f97f169e0863783bcf2a71f92de7e5e6ba79bc4b68f26715e980fc2649d931647c9860001b6104bd565b6106038282610d57565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461065e9061169f565b80601f016020809104026020016040519081016040528092919081815260200182805461068a9061169f565b80156106d75780601f106106ac576101008083540402835291602001916106d7565b820191906000526020600020905b8154815290600101906020018083116106ba57829003601f168201915b5050505050905090565b61070d7fb311ebb510b9caba3c69ce79a21f187d881b4b2095d92034c7507afd72fa5b5e60001b6104bd565b6107397f16dd59826027583122565040666bc4a57b94db0a1092831174d1ca290bcd410360001b6104bd565b6107657feb5c35a72c4ffc83e6b704d2386276dd3033cfbac14608364ae76905e9a7ba1060001b6104bd565b61076f8282610eb7565b5050565b60008060016000610782610903565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561083f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610836906114f1565b60405180910390fd5b61085361084a610903565b8585840361090b565b600191505092915050565b600061087261086b610903565b8484610ad6565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561097b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610972906114d1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156109eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e290611431565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610ac99190611531565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610b46576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b3d906114b1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610bb6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bad906113f1565b60405180910390fd5b610bc183838361108e565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c47576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3e90611451565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610cda9190611583565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d3e9190611531565b60405180910390a3610d51848484611093565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610dc7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dbe90611511565b60405180910390fd5b610dd36000838361108e565b8060026000828254610de59190611583565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e3a9190611583565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e9f9190611531565b60405180910390a3610eb360008383611093565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610f27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1e90611491565b60405180910390fd5b610f338260008361108e565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610fb9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb090611411565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816002600082825461101091906115d9565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516110759190611531565b60405180910390a361108983600084611093565b505050565b505050565b505050565b6000813590506110a781611a30565b92915050565b6000813590506110bc81611a47565b92915050565b6000813590506110d181611a5e565b92915050565b6000602082840312156110e957600080fd5b60006110f784828501611098565b91505092915050565b6000806040838503121561111357600080fd5b600061112185828601611098565b925050602061113285828601611098565b9150509250929050565b60008060006060848603121561115157600080fd5b600061115f86828701611098565b935050602061117086828701611098565b9250506040611181868287016110c2565b9150509250925092565b6000806040838503121561119e57600080fd5b60006111ac85828601611098565b92505060206111bd858286016110c2565b9150509250929050565b6000602082840312156111d957600080fd5b60006111e7848285016110ad565b91505092915050565b6111f98161161f565b82525050565b600061120a82611567565b6112148185611572565b935061122481856020860161166c565b61122d8161172f565b840191505092915050565b6000611245602383611572565b915061125082611740565b604082019050919050565b6000611268602283611572565b91506112738261178f565b604082019050919050565b600061128b602283611572565b9150611296826117de565b604082019050919050565b60006112ae602683611572565b91506112b98261182d565b604082019050919050565b60006112d1602883611572565b91506112dc8261187c565b604082019050919050565b60006112f4602183611572565b91506112ff826118cb565b604082019050919050565b6000611317602583611572565b91506113228261191a565b604082019050919050565b600061133a602483611572565b915061134582611969565b604082019050919050565b600061135d602583611572565b9150611368826119b8565b604082019050919050565b6000611380601f83611572565b915061138b82611a07565b602082019050919050565b61139f81611655565b82525050565b6113ae8161165f565b82525050565b60006020820190506113c960008301846111f0565b92915050565b600060208201905081810360008301526113e981846111ff565b905092915050565b6000602082019050818103600083015261140a81611238565b9050919050565b6000602082019050818103600083015261142a8161125b565b9050919050565b6000602082019050818103600083015261144a8161127e565b9050919050565b6000602082019050818103600083015261146a816112a1565b9050919050565b6000602082019050818103600083015261148a816112c4565b9050919050565b600060208201905081810360008301526114aa816112e7565b9050919050565b600060208201905081810360008301526114ca8161130a565b9050919050565b600060208201905081810360008301526114ea8161132d565b9050919050565b6000602082019050818103600083015261150a81611350565b9050919050565b6000602082019050818103600083015261152a81611373565b9050919050565b60006020820190506115466000830184611396565b92915050565b600060208201905061156160008301846113a5565b92915050565b600081519050919050565b600082825260208201905092915050565b600061158e82611655565b915061159983611655565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156115ce576115cd6116d1565b5b828201905092915050565b60006115e482611655565b91506115ef83611655565b925082821015611602576116016116d1565b5b828203905092915050565b600061161882611635565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561168a57808201518184015260208101905061166f565b83811115611699576000848401525b50505050565b600060028204905060018216806116b757607f821691505b602082108114156116cb576116ca611700565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b611a398161160d565b8114611a4457600080fd5b50565b611a508161162b565b8114611a5b57600080fd5b50565b611a6781611655565b8114611a7257600080fd5b5056fea26469706673582212201fcd001a110ee6a83460bb2a0b7c525a234c12ddb24c8019745b38f819db398464736f6c63430008040033";

type TokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Token__factory extends ContractFactory {
  constructor(...args: TokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Token> {
    return super.deploy(name, symbol, overrides || {}) as Promise<Token>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): Token {
    return super.attach(address) as Token;
  }
  connect(signer: Signer): Token__factory {
    return super.connect(signer) as Token__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenInterface {
    return new utils.Interface(_abi) as TokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Token {
    return new Contract(address, _abi, signerOrProvider) as Token;
  }
}
