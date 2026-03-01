import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { BRANCHES } from '../../data/mockData';
import clsx from 'clsx';

export default function NetworkMap() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald/5 h-full">
      <h3 className="text-lg font-serif font-bold text-emerald mb-6 flex items-center gap-2">
        <MapPin size={20} className="text-saffron" />
        Network Status
      </h3>

      <div className="relative h-[300px] bg-ivory/50 rounded-xl border border-emerald/5 p-4 overflow-hidden">
        {/* Stylized Map Representation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#02457A_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M100,200 Q150,150 200,100" stroke="#02457A" strokeWidth="2" strokeOpacity="0.1" fill="none" />
          <path d="M200,100 Q250,150 300,200" stroke="#02457A" strokeWidth="2" strokeOpacity="0.1" fill="none" />
          <path d="M200,100 L200,250" stroke="#02457A" strokeWidth="2" strokeOpacity="0.1" fill="none" />
        </svg>

        {/* Nodes */}
        <div className="relative h-full w-full">
          {BRANCHES.map((branch, index) => {
            // Simple manual positioning for demo visual
            const positions = [
              { top: '10%', left: '50%' }, // Virar
              { top: '40%', left: '20%' }, // Powai
              { top: '40%', left: '80%' }, // Kalyan
              { top: '70%', left: '30%' }, // Dombivli
              { top: '80%', left: '70%' }, // Pune
            ];
            const pos = positions[index] || { top: '50%', left: '50%' };

            const statusColor =
              branch.status === 'Green' ? 'bg-green-500' :
                branch.status === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500';

            return (
              <motion.div
                key={branch.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={pos}
              >
                <div className={clsx("w-4 h-4 rounded-full shadow-lg border-2 border-white relative", statusColor)}>
                  <div className={clsx("absolute inset-0 rounded-full animate-ping opacity-75", statusColor)}></div>
                </div>
                <div className="mt-2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold text-emerald whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                  {branch.location}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Optimal</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Warning</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Critical</div>
      </div>
    </div>
  );
}
