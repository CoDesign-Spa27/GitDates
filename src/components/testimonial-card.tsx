import {motion} from 'motion/react'

interface TestimonialCardProps {
    name: string;
    role: string;
    text: string;
    delay?: number;
}

const TestimonialCard = ({ name, role, text, delay = 0 }:TestimonialCardProps) => {
    return (
      <motion.div 
        className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ 
          boxShadow: "0 10px 30px -15px rgba(0, 0, 255, 0.2)",
          y: -5
        }}
      >
        <p className="text-gray-300 mb-4 italic">"{text}"</p>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{name}</p>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </motion.div>
    );
  };