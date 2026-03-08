"use client";

import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  matched: string[];
  missing: string[];
}

export default function SBERTRadarChart({ matched, missing }: Props) {
  const allSkills = [...(matched || []), ...(missing || [])].slice(0, 6);

  if (allSkills.length < 3) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 font-light text-sm">
        Not enough diverse skills extracted for radar visualization.
      </div>
    );
  }

  const data = allSkills.map((skill) => ({
    subject: skill.length > 15 ? skill.slice(0, 15) + "..." : skill,
    full_name: skill,
    score: (matched || []).includes(skill) ? 100 : 25,
    target: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-full h-full min-h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontWeight: 300,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          <Radar
            name="Your Match Profile"
            dataKey="score"
            stroke="rgba(250, 250, 250, 0.4)"
            fill="rgba(56, 189, 248, 0.15)"
            fillOpacity={1}
          />

          <Radar
            name="Target Profile"
            dataKey="target"
            stroke="rgba(255, 255, 255, 0.1)"
            fill="none"
            strokeDasharray="3 3"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(9, 9, 11, 0.6)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "#d4d4d8",
              fontSize: "12px",
            }}
            itemStyle={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}
            formatter={(value: any, name: any, props: any) => {
              if (name === "Your Match Profile") {
                return [
                  value === 100 ? "Matched" : "Missing / Weak",
                  props.payload.full_name,
                ];
              }
              return ["Required", "Target"];
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
