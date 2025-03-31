/**
 * INSTALLATION GUIDE
 *
 * Follow these steps to set up and run the project in VS Code:
 *
 * 1. PREREQUISITES
 *    - Node.js (v16 or later)
 *    - npm or yarn
 *    - VS Code
 *    - Git
 *
 * 2. CLONE THE REPOSITORY
 *    - Open a terminal
 *    - Run: git clone [your-repository-url]
 *    - cd into the project directory
 *
 * 3. INSTALL DEPENDENCIES
 *    - Run: npm install
 *    - This will install all required packages including:
 *      - next
 *      - react & react-dom
 *      - tailwindcss
 *      - framer-motion
 *      - lucide-react
 *      - ethers (for Web3 integration)
 *      - @splinetool/react-spline (for 3D scenes)
 *
 * 4. ENVIRONMENT SETUP
 *    - Create a .env.local file in the root directory
 *    - Add your NFT contract address:
 *      NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your-nft-contract-address
 *
 * 5. RUN THE DEVELOPMENT SERVER
 *    - Run: npm run dev
 *    - Open http://localhost:3000 in your browser
 *
 * 6. BUILD FOR PRODUCTION
 *    - Run: npm run build
 *    - To start the production server: npm start
 *
 * 7. CUSTOMIZATION
 *    - Update the NFT contract ABI in lib/web3-utils.ts
 *    - Replace placeholder images with your actual NFT images
 *    - Customize colors in tailwind.config.ts
 *
 * 8. TROUBLESHOOTING
 *    - If you encounter issues with Spline, try: npm install @splinetool/react-spline@latest
 *    - For Web3 connection issues, ensure your browser has a wallet extension like MetaMask installed
 *    - For styling issues, run: npm run build:css to rebuild the Tailwind styles
 */

