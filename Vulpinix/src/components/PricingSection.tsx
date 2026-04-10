import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export function PricingSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isAuthenticated = !!localStorage.getItem("userInfo") || localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      const isReturning = !!localStorage.getItem("userEmail") || !!localStorage.getItem("returningUser");
      navigate(isReturning ? "/login" : "/signup");
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      features: [
        "Up to 10 posts per month",
        "AI-powered captions",
        "2 social platforms",
        "Basic analytics",
        "Email support"
      ],
      gradient: "from-gray-800 to-gray-900",
      border: "border-gray-700/50",
      popular: false
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      features: [
        "Up to 50 posts per month",
        "AI-powered captions",
        "All social platforms",
        "Advanced analytics",
        "Priority support",
        "Team collaboration"
      ],
      gradient: "from-purple-900/50 to-cyan-900/50",
      border: "border-purple-500/50",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      features: [
        "Unlimited posts",
        "AI-powered captions",
        "All social platforms",
        "Real-time analytics",
        "24/7 dedicated support",
        "Team collaboration",
        "Custom integrations",
        "White-label options"
      ],
      gradient: "from-gray-800 to-gray-900",
      border: "border-gray-700/50",
      popular: false
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-cyan-400 mb-4 tracking-wider uppercase">Pricing</h2>
          <h3 className="text-4xl sm:text-5xl text-white mb-6">
            Choose Your Plan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative flex flex-col bg-gradient-to-br ${plan.gradient} border ${plan.border} backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300 ${plan.popular ? 'shadow-2xl shadow-purple-500/30' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full">
                  <span className="text-white text-sm">Most Popular</span>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-white text-2xl mb-2">{plan.name}</h4>
                <div className="flex items-baseline">
                  <span className="text-5xl text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`mt-auto w-full py-6 rounded-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                }`}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}