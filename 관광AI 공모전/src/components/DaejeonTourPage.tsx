import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { PageType } from '../App';
import mapIcon from 'figma:asset/f92a1f1c7ca3c073456c8ff13f4092d8655c4ba1.png';
import stampIcon from 'figma:asset/0c0def213758d15d52895a728ac56863139ee9d7.png';

interface DaejeonTourPageProps {
  onNavigate: (page: PageType) => void;
}

export default function DaejeonTourPage({ onNavigate }: DaejeonTourPageProps) {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl mb-4 text-gray-800">대전 투어</h1>
        <p className="text-lg text-gray-600">대전의 다양한 관광지를 탐험해보세요!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-100 to-green-200 border-green-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                🔬
              </div>
              <h2 className="text-xl mb-3 text-gray-800">국립중앙과학관</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                과학의 재미와 신비로움을 체험할 수 있는 국내 최대 과학관
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                🌳
              </div>
              <h2 className="text-xl mb-3 text-gray-800">대전 한밭수목원</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                도심 속 자연을 만날 수 있는 아름다운 수목원
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
                🎨
              </div>
              <h2 className="text-xl mb-3 text-gray-800">대전 엑스포 과학공원</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                1993년 대전엑스포의 감동을 다시 느껴보세요
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 text-sm">
          각 관광지를 선택하여 더 자세한 정보를 확인하세요
        </p>
      </motion.div>
    </div>
  );
}