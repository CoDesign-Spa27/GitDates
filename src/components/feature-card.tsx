import {motion} from 'motion/react' 

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const FeatureCard = ({ icon, title, description }:FeatureCardProps) => {
    return (
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-8 border border-gray-700/30 group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          boxShadow: "0 10px 30px -15px rgba(255, 0, 128, 0.3)",
          y: -5
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="mb-5">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </motion.div>
    );
  };
  
   