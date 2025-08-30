import React from 'react';
import { motion } from 'motion/react';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import comicImage from 'figma:asset/e4af211e58049d4540f9fb283980b0731ed9b551.png';

interface NFCComicModalProps {
  onClose: () => void;
  onSave: () => void;
  onShare: () => void;
}

export default function NFCComicModal({ onClose, onSave, onShare }: NFCComicModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
      >
        {/* 닫기 버튼 */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6 text-gray-700" />
        </motion.button>

        {/* 네컷 만화 이미지 */}
        <div className="relative">
          <motion.img 
            src={comicImage}
            alt="인류관 네컷 만화"
            className="w-full h-auto object-contain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          
          {/* 이미지 테두리 효과 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* 하단 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="p-6 bg-gradient-to-t from-gray-50 to-white"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* 저장하기 버튼 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onSave}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-gmarket-medium shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                저장하기
              </Button>
            </motion.div>

            {/* 공유하기 버튼 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onShare}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-gmarket-medium shadow-lg flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                공유하기
              </Button>
            </motion.div>
          </div>

          {/* 설명 텍스트 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center text-sm text-gray-600 mt-4"
          >
            🎉 인류관 방문 기념 네컷 만화가 완성되었어요!
          </motion.p>
        </motion.div>
      </motion.div>

      {/* 배경 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
              opacity: 0
            }}
            animate={{
              y: -20,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}