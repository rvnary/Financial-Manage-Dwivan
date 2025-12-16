import { Button } from "./ui/button";
import { TrendingUp, PiggyBank, DollarSign, BarChart3 } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full" style={{ backgroundColor: '#007200' }}>
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl mb-6 text-white">
            Smart Financial Planning
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Take control of your finances with our intelligent money management tool. 
            Calculate your remaining budget and get personalized investment recommendations 
            to make your money work for you.

            ⚠️Website Ini Hanya Sebagai Contoh Saja⚠️
          </p>
          
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="text-lg px-8 py-6 text-white hover:opacity-90"
            style={{ backgroundColor: '#007200' }}
          >
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#9ef01a30' }}>
              <PiggyBank className="w-7 h-7" style={{ color: '#9ef01a' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Track Your Expenses</h3>
            <p className="text-gray-400">
              Easily input your monthly salary and categorize your expenses to see where your money goes.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#70e00030' }}>
              <DollarSign className="w-7 h-7" style={{ color: '#70e000' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Calculate Remaining Budget</h3>
            <p className="text-gray-400">
              Automatically calculate how much money you have left after all your expenses and savings.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#38b00030' }}>
              <BarChart3 className="w-7 h-7" style={{ color: '#38b000' }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Investment Recommendations</h3>
            <p className="text-gray-400">
              Get smart suggestions on where to invest your remaining money for optimal growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
