/**
 * Landing Page
 * Marketing page with features and CTA
 */

import { Link } from "react-router-dom";
import { BookOpen, Zap, Video, Brain, ArrowRight, Github } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#3b82f6]" />
            <span className="text-xl font-bold text-[#e6edf3]">Text2Learn</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/DineshDumka/Text2Learn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8b949e] hover:text-[#3b82f6] transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">
              Login
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-5 px-4 py-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full text-[#3b82f6] text-xs font-medium">
          ✨ Built for Fast Learning
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-5 text-[#e6edf3]">
          Learn Anything, Instantly.
        </h1>
        <p className="text-lg text-[#8b949e] mb-8 max-w-xl mx-auto">
          Type a topic. Get a full AI-generated course.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/signup"
            className="btn-primary px-6 py-3 inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3">
            Login
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-[#e6edf3]">
          Why Text2Learn?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-[#3b82f6]" />}
            title="Instant Generation"
            description="Create complete courses in seconds with AI-powered content generation"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-[#3b82f6]" />}
            title="Structured Learning"
            description="Organized modules and lessons that build on each other logically"
          />
          <FeatureCard
            icon={<Video className="w-8 h-8 text-[#3b82f6]" />}
            title="Video Integration"
            description="Curated YouTube videos for every lesson to enhance understanding"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-[#3b82f6]" />}
            title="Interactive Quizzes"
            description="Test your knowledge with auto-generated MCQs and instant feedback"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-[#e6edf3]">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <Step
            number={1}
            title="Enter a Topic"
            description="Type any subject you want to learn - from 'React Hooks' to 'Machine Learning Basics'"
          />
          <Step
            number={2}
            title="AI Generates Course"
            description="Our AI creates a structured course with modules, lessons, videos, and quizzes"
          />
          <Step
            number={3}
            title="Start Learning"
            description="Follow the curriculum, watch videos, complete quizzes, and master the topic"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto bg-[#1c2128] border border-[#30363d] rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-3 text-[#e6edf3]">
            Ready to Learn Anything?
          </h2>
          <p className="text-base mb-6 text-[#8b949e]">
            Join learners mastering new skills with AI-powered courses
          </p>
          <Link to="/signup" className="btn-primary px-6 py-3 inline-block">
            Create Your First Course Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-[#8b949e] border-t border-[#30363d]">
        <p className="text-sm">Made by Dinesh Dumka • Text2Learn © 2025</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-[#1c2128] border border-[#30363d] rounded-lg p-6 text-center hover:border-[#3b82f6]/50 transition-all group">
    <div className="flex justify-center mb-3 group-hover:scale-105 transition-transform">
      {icon}
    </div>
    <h3 className="text-base font-semibold mb-2 text-[#e6edf3]">{title}</h3>
    <p className="text-sm text-[#8b949e]">{description}</p>
  </div>
);

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="w-10 h-10 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
      {number}
    </div>
    <h3 className="text-base font-semibold mb-2 text-[#e6edf3]">{title}</h3>
    <p className="text-sm text-[#8b949e]">{description}</p>
  </div>
);

export default Landing;
