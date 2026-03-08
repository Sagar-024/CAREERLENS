"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Course {
  title: string;
  platform: string;
  link: string;
  skill: string;
}

export default function CourseRecommendations({
  courses,
}: {
  courses: Course[];
}) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-zinc-500 font-light text-sm p-4">
        No critical skills gaps flagged. No courses recommended.
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x snap-mandatory no-scrollbar"
    >
      {courses.map((course, idx) => (
        <motion.a
          variants={item}
          key={idx}
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="snap-start shrink-0 w-[280px] sm:w-[320px] p-6 bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-[2rem] group flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-300">
                {course.platform}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </div>
            </div>
            <h4 className="text-zinc-100 font-medium leading-snug mb-1 group-hover:text-white transition-colors text-lg">
              {course.title.length > 50
                ? course.title.slice(0, 50) + "..."
                : course.title}
            </h4>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-zinc-500 font-light flex items-center gap-2">
              Bridges Gap:{" "}
              <span className="text-zinc-300 font-medium bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                {course.skill}
              </span>
            </p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
