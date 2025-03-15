"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center">
      <motion.main
        className="container max-w-4xl px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-xs font-medium tracking-wider mb-4">
              PRESERVE YOUR MOMENTS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Turn conversations into beautiful memories
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your meaningful dialogues and photos into elegant
              digital keepsakes that tell your story.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => router.push("/create")}
              size="lg"
              className="group rounded-full px-8"
            >
              Create memory
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => router.push("/how-it-works")}
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              How it works
            </Button>
          </div>
        </div>

        <motion.div
          className="mt-16 md:mt-24 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-[16/9] bg-gray-100 relative">
              <div className="absolute inset-0 p-8 flex flex-col justify-between glass rounded-xl">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Summer trip 2023
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    June 15th
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-blue-100 h-32"></div>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-green-100 h-32"></div>
                  </div>
                </div>

                <div className="p-4 rounded-lg glass w-fit">
                  <blockquote className="text-gray-700 italic">
                    &quot;This view makes everything worth it!
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-500 animate-pulse-subtle"></div>
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-indigo-400 animate-pulse-subtle"></div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Index;
