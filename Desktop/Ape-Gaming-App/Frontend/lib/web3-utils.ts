// Smart contract integration utilities
import { ethers } from "ethers"

// ABI for your NFT contract
export const NFT_CONTRACT_ABI = [
  // Mint function
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "mintWithAPE",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Get user NFTs
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserNFTs",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Get NFT details
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nftDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "apePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "xp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Earn XP
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "xp",
        type: "uint256",
      },
    ],
    name: "earnXP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Referral rewards
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "referralRewards",
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
  // Referrer of
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "referrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Check if NFT is borrowed
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isBorrowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Get lender of NFT
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "lenderOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Get borrower of NFT
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "address",
      },
    ],
    name: "borrowerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Get borrow expiration
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "borrowExpiration",
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
]

// Contract address
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ""
export const APE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_APE_TOKEN_ADDRESS || ""

// ABI for ERC20 token (APE)
export const ERC20_ABI = [
  // Function to approve spending
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
  // Function to check balance
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
]

// Function to connect wallet
export async function connectWallet() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      return { success: true, account: accounts[0] }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      return { success: false, error }
    }
  } else {
    console.error("Ethereum wallet not detected")
    return { success: false, error: "Ethereum wallet not detected. Please install MetaMask or another Web3 wallet." }
  }
}

// Function to mint NFT with APE tokens
export async function mintNFTWithAPE(tokenId: number, referrer: string = ethers.constants.AddressZero) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    return { success: false, error: "Ethereum wallet not detected" }
  }

  try {
    // Connect to the wallet
    const { success, account, error } = await connectWallet()
    if (!success) {
      return { success: false, error }
    }

    // Create a Web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // Create contract instances
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)
    const apeContract = new ethers.Contract(APE_TOKEN_ADDRESS, ERC20_ABI, signer)

    // Get NFT price
    const nftDetails = await nftContract.nftDetails(tokenId)
    const price = nftDetails.apePrice

    // Approve APE token spending
    const approveTx = await apeContract.approve(NFT_CONTRACT_ADDRESS, price)
    await approveTx.wait()

    // Call mint function
    const mintTx = await nftContract.mintWithAPE(tokenId, referrer)
    const receipt = await mintTx.wait()

    return {
      success: true,
      transaction: receipt.transactionHash,
      account,
    }
  } catch (error: any) {
    console.error("Error minting NFT:", error)
    return { success: false, error: error.message || "Error minting NFT" }
  }
}

// Function to get user's NFTs
export async function getUserNFTs(address: string) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    return { success: false, error: "Ethereum wallet not detected" }
  }

  try {
    // Create a Web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create contract instance
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

    // Get user's NFTs
    const tokenIds = await nftContract.getUserNFTs(address)

    // Get details for each NFT
    const nfts = await Promise.all(
      tokenIds.map(async (id: ethers.BigNumber) => {
        const tokenId = id.toNumber()
        const details = await nftContract.nftDetails(tokenId)
        const isBorrowed = await nftContract.isBorrowed(tokenId)

        return {
          id: tokenId,
          price: ethers.utils.formatEther(details.apePrice),
          xp: details.xp.toNumber(),
          level: details.level.toNumber(),
          isBorrowed,
        }
      }),
    )

    return { success: true, nfts }
  } catch (error: any) {
    console.error("Error getting user NFTs:", error)
    return { success: false, error: error.message || "Error getting user NFTs" }
  }
}

// Function to earn XP for an NFT
export async function earnXPForNFT(tokenId: number, xpAmount: number) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    return { success: false, error: "Ethereum wallet not detected" }
  }

  try {
    // Connect to the wallet
    const { success, account, error } = await connectWallet()
    if (!success) {
      return { success: false, error }
    }

    // Create a Web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // Create contract instance
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

    // Call earnXP function
    const tx = await nftContract.earnXP(tokenId, xpAmount)
    const receipt = await tx.wait()

    return {
      success: true,
      transaction: receipt.transactionHash,
      account,
    }
  } catch (error: any) {
    console.error("Error earning XP:", error)
    return { success: false, error: error.message || "Error earning XP" }
  }
}

// Function to get referral rewards
export async function getReferralRewards(address: string) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    return { success: false, error: "Ethereum wallet not detected" }
  }

  try {
    // Create a Web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create contract instance
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

    // Get referral rewards
    const rewards = await nftContract.referralRewards(address)

    return { success: true, rewards: rewards.toNumber() }
  } catch (error: any) {
    console.error("Error getting referral rewards:", error)
    return { success: false, error: error.message || "Error getting referral rewards" }
  }
}

// Function to check if NFT is borrowed
export async function checkNFTBorrowStatus(tokenId: number) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    return { success: false, error: "Ethereum wallet not detected" }
  }

  try {
    // Create a Web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create contract instance
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

    // Check if NFT is borrowed
    const isBorrowed = await nftContract.isBorrowed(tokenId)

    if (isBorrowed) {
      const lender = await nftContract.lenderOf(tokenId)
      const borrower = await nftContract.borrowerOf(tokenId)
      const expiration = await nftContract.borrowExpiration(tokenId)

      return {
        success: true,
        isBorrowed,
        lender,
        borrower,
        expiration: new Date(expiration.toNumber() * 1000),
      }
    }

    return { success: true, isBorrowed }
  } catch (error: any) {
    console.error("Error checking borrow status:", error)
    return { success: false, error: error.message || "Error checking borrow status" }
  }
}

// Function to mint NFT (placeholder - needs actual implementation)
export async function mintNFT(quantity: number, pricePerNFT: number) {
  // Placeholder implementation - replace with actual contract interaction
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = true // Simulate success
      const error = success ? null : "Minting failed"
      resolve({ success, error })
    }, 1000)
  })
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

