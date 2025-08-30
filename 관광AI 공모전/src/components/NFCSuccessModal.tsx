import React from 'react';
import { motion } from 'motion/react';
import missionSuccessImage from 'figma:asset/470ef65d99a7aa306bcf4586bfb7c6abca4c3a2e.png';

interface NFCSuccessModalProps {
  onConfirm: () => void;
}

export default function NFCSuccessModal({ onConfirm }: NFCSuccessModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* 미션 성공 이미지 */}
        <div className="relative">
          <img 
            src={missionSuccessImage}
            alt="미션 성공"
            className="w-full h-auto object-contain"
          />
          
          {/* 이미지 하단 확인 버튼 클릭 영역 - 투명한 오버레이 (4% 더 낮춤) */}
          <motion.button
            onClick={onConfirm}
            className="absolute bottom-[1%] left-[10%] right-[10%] h-16 bg-transparent hover:bg-blue-500/10 transition-colors duration-200 z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="이미지 하단 확인 버튼"
          >
            {/* 호버 시 시각적 피드백 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500/20 border-t-2 border-blue-400/50 rounded-lg"
            />
          </motion.button>
          
          {/* 캐릭터 애니메이션 효과 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <div className="w-32 h-32 bg-transparent rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* 배경 파티클 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -20, -40],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}