import { ethers } from 'ethers';

import { ITxObject, StoreAccount, ITxConfig, TAddress } from 'v2/types';
import {
  inputValueToHex,
  inputGasPriceToHex,
  toWei,
  hexToString,
  hexWeiToString
} from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID, DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { UnlockToken, ERC20 } from 'v2/services/EthService/contracts';
import { getAssetByUUID } from 'v2/services';

import { MembershipSimpleTxFormFull } from './types';
import { isERC20Tx } from '../SendAssets';

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: payload.membershipSelected.contractAddress,
    _value: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL)
  });

  return {
    // @ts-ignore Contract Address should be set if asset is ERC20
    to: payload.asset.contractAddress,
    from: payload.account.address,
    data,
    chainId: DEFAULT_NETWORK_CHAINID,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    value: inputValueToHex('0')
  };
};

export const createPurchaseTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const membershipSelected = payload.membershipSelected;

  const weiPrice = toWei(membershipSelected.price, DEFAULT_ASSET_DECIMAL);
  const data = UnlockToken.purchase.encodeInput({
    _value: weiPrice,
    _recipient: payload.account.address,
    _referrer: ethers.constants.AddressZero,
    _data: []
  });

  return {
    from: payload.account.address,
    to: membershipSelected.contractAddress as TAddress,
    value: isERC20Tx(payload.asset) ? inputValueToHex('0') : inputValueToHex(payload.amount),
    data,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const makeTxConfigFromTransaction = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, to, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;

  const txConfig: ITxConfig = {
    from: address,
    amount,
    receiverAddress: to,
    senderAccount: account,
    network,
    asset: baseAsset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit: hexToString(gasLimit),
    value: hexWeiToString(value),
    nonce: hexToString(nonce),
    data,
    rawTransaction
  };

  return txConfig;
};
