import { AnimatedTestimonials } from "./animated-testomonials";

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Use machine learning models to predict optimal interest rates and loan durations based on customer preferences, credit score, income, and other relevant data.",
      name: "Interest Rate & Time Period Prediction",
      designation: "Product Manager at TechFlow",
      src: "/images/image2.jpg",
    },
    {
      quote:
        "Provide personalized loan plans tailored to customer profiles, ensuring the options are both profitable for the bank and affordable for the client.",
      name: "Personalized Loan Suggestions",
      designation: "CTO at InnovateSphere",
      src: "/images/image3.jpg",
    },
    {
      quote:
        "Ensure transparency by explaining why certain rates or time periods are suggested, helping both customers and bank officials trust the Al's decisions.",
      name: "Explainable AI",
      designation: "Operations Director at CloudScale",
      src: "/images/image4.jpg",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

export { AnimatedTestimonialsDemo };
