"use client";
import React from "react";
import { ArrowLeft, Upload, PenTool, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const HowItWorks = () => {
  const router = useRouter();
  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-blue-500" />,
      title: "Upload your content",
      description:
        "Add a conversation transcript (100-500 words) and up to 5 related photos.",
    },
    {
      icon: <PenTool className="h-10 w-10 text-blue-500" />,
      title: "Design your memory",
      description:
        "Arrange photos, highlight quotes, and add artistic elements using our intuitive editor.",
    },
    {
      icon: <Download className="h-10 w-10 text-blue-500" />,
      title: "Save and share",
      description:
        "Download your creation or share it directly to social media with friends and family.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-4xl px-6 py-12 mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-8 rounded-full"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            How it works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating beautiful memory keepsakes is easy with our simple
            three-step process.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
              variants={childVariants}
            >
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            // onClick={() => navigate("/create")}
            size="lg"
            className="rounded-full px-8"
          >
            Create your first memory
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;

// Add the ArrowRight component since it's used above
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
