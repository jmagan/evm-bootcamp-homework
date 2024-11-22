import { Injectable } from '@nestjs/common';
import * as tokenJson from './assets/MyToken.json';
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  PublicClient,
} from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient: PublicClient;
  walletClient;

  constructor(private configService: ConfigService) {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
    }) as any as PublicClient;

    this.walletClient = createWalletClient({
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
      chain: sepolia,
      account: account,
    });
  }

  getContractAddress(): string {
    return '0xE366C5a151e568eCBC46894E0791E8327b5310f8';
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'name',
    });
    return name as string;
  }

  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string): Promise<boolean> {
    const MINTER_ROLE =
      '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
    // const MINTER_ROLE =  await this.publicClient.readContract({
    //   address: this.getContractAddress(),
    //   abi: tokenJson.abi,
    //   functionName: 'MINTER_ROLE'
    // });
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    });
    return hasRole as boolean;
  }

  mintTokens(address: string) {
    return { result: true };
  }
  async getTransactionReceipt(hash: string) {
    const receipt = await this.publicClient.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    return {
      result: `Transaction status: ${receipt.status} , Block number ${receipt.blockNumber}`,
    };
  }

  async getTokenBalance(address: string) {
    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'symbol',
    });
    const balanceOf = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    });

    return `${formatEther(balanceOf as bigint)} ${symbol}`;
  }
  getTotalSupply() {
    throw new Error('Method not implemented.');
  }
}
