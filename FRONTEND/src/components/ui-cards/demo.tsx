import { AnimatedTestimonials } from "./animated-testomonials";

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Use machine learning models to predict optimal interest rates and loan durations based on customer preferences, credit score, income, and other relevant data.",
      name: "Interest Rate & Time Period Prediction",
      src: '/images/image1.jpg',
    },
    {
      quote:
        "Provide personalized loan plans tailored to customer profiles, ensuring the options are both profitable for the bank and affordable for the client.",
      name: "Personalized Loan Suggestions",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Ensure transparency by explaining why certain rates or time periods are suggested, helping both customers and bank officials trust the Al's decisions..",
      name: "Explainable AI",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implement model that identify suspicious applications or data inconsistencies, alerting the bank to potential fraud.",
      name: "Fraud Detection",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The Dues module provides a complete summary of a customer’s loan status, showing remaining installments, total dues, repayment history, and any penalties or refunds. It helps track payments and manage loan accounts efficiently using the customer’s name or code.",
      name: "Dues",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

export { AnimatedTestimonialsDemo };
