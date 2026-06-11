import { Target, ChartColumn, Zap, Shield } from "lucide-react";

// Move this to its own component file or keep it in the same file
export default function ChooseCard() {
  const features = [
    {
      icon: <Target className="w-5 h-5 text-teal-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models analyze thousands of data points",
    },
    {
      icon: <ChartColumn className="w-5 h-5 text-teal-600" />,
      title: "Real-time Updates",
      description: "Get instant updates on matches, odds, and predictions",
    },
    {
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      title: "Comprehensive Data",
      description: "Access detailed statistics, form guides, and head-to-head records",
    },
    {
      icon: <Zap className="w-5 h-5 text-teal-600" />,
      title: "High Accuracy",
      description: "87% prediction accuracy backed by historical performance",
    },
  ];

  return (
    <section className="bg-black py-16 px-4 max-w-6xl mx-auto text-center">
      {/* Header Section */}
      <h2 className="text-white text-3xl font-bold mb-2">
        Why Choose New8scoreAI?
      </h2>
      <p className="text-gray-400 text-sm mb-12">
        Advanced analytics meets intuitive design
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-[#111111] border border-[#222222] rounded-2xl p-2 sm:p-6 flex flex-col gap-3 sm:gap-4"
          >
            {/* Icon Container */}
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              {feature.icon}
            </div>
            
            {/* Text Content */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};