/**
 * GUIDE: Adding Images
 *
 * There are several ways to add images to your project:
 *
 * 1. Using the public folder:
 *    - Place your images in the 'public' folder
 *    - Reference them directly: <img src="/your-image.png" alt="Description" />
 *
 * 2. Using imported images (for Next.js Image component):
 *    - Place images in a folder like 'assets' or 'images'
 *    - Import them: import myImage from '@/assets/my-image.png'
 *    - Use with Next.js Image: <Image src={myImage || "/placeholder.svg"} alt="Description" />
 *
 * 3. For the Ape NFTs specifically:
 *    - Replace the placeholder URLs in the FlippingApeNFTs component
 *    - Example:
 *      image: "/apes/cyber-ape-001.png", // instead of placeholder.svg
 *
 * 4. Image Optimization:
 *    - Next.js automatically optimizes images used with the Image component
 *    - For best performance, use the Image component when possible
 *    - Example:
 *      import Image from 'next/image'
 *
 *      <Image
 *        src="/apes/cyber-ape-001.png"
 *        alt="Cyber Ape #001"
 *        width={300}
 *        height={300}
 *        className="rounded-lg"
 *      />
 */

