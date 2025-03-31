import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

export function TeamSection() {
  const teamMembers = [
    {
      quote:
        "I lead our blockchain development team, focusing on creating secure and scalable smart contracts for our gaming ecosystem. My passion is building decentralized systems that empower users.",
      name: "Alex Morgan",
      designation: "Lead Blockchain Developer",
      src: "/team/pop.webp",
    },
    {
      quote:
        "As the game designer, I create immersive experiences that blend traditional gaming with blockchain rewards. I believe games should be fun first, with earning as a natural extension of gameplay.",
      name: "Sophia Chen",
      designation: "Game Design Director",
      src: "/team/photo.jpg",
    },
    {
      quote:
        "I oversee our tokenomics and ensure our play-to-earn model is sustainable and rewarding. My background in economics helps me design systems that benefit both casual and dedicated players.",
      name: "Marcus Johnson",
      designation: "Tokenomics Specialist",
      src: "/team/jerome.webp",
    },
    {
      quote:
        "My focus is on creating beautiful, responsive interfaces that make blockchain gaming accessible to everyone. I believe great UX is the bridge between traditional and Web3 gaming.",
      name: "Leila Patel",
      designation: "UI/UX Lead",
      src: "/team/4.webp",
    },
    {
      quote:
        "I manage our community and help players navigate the world of Web3 gaming. Building an inclusive, supportive community is essential for the long-term success of our platform.",
      name: "Jordan Williams",
      designation: "Community Manager",
      src: "/team/2.png",
    },
  ]

  return (
    <section className="w-full py-16 bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl text-lime mb-12 text-center">Our Team</h2>
        <AnimatedTestimonials testimonials={teamMembers} autoplay={true} className="text-lime" />
      </div>
    </section>
  )
}

