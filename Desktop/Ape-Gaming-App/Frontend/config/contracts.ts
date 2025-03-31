export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ""

export const NFT_CONTRACT_ABI = [
  "function getReferralRewards(address) view returns (uint256)",
  "function referralRewards(address) view returns (uint256)",
  "function mintNFT(uint256, uint256) payable",
  "function mintNFTWithAPE(uint256, address) payable",
  "function isBorrowed(uint256) view returns (bool)",
  "function lenderOf(uint256) view returns (address)",
  "function borrowerOf(uint256) view returns (address)",
  "function borrowExpiration(uint256) view returns (uint256)",
  "function earnXPForNFT(uint256, uint256)",
  "function getUserNFTs(address) view returns (uint256[] memory)"
] as const 