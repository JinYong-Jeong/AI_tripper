import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MapPin, Sparkles, Heart, LogOut, Wifi } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { PageType } from '../App';
import kauniImage from 'figma:asset/0f85bc5afb4ab9510756ee0578698ec79610af83.png';

interface GusukTourMainPageProps {
  onNavigate: (page: PageType) => void;
  onNFCDemo: () => void; // NFC 예시 버튼용 함수
}

interface MenuItem {
  id: string;
  title: string;
  type: 'home' | 'region' | 'shop' | 'stamp' | 'coupon';
  isActive?: boolean;
  action?: () => void;
}

interface Region {
  id: string;
  name: string;
  enabled?: boolean;
}

export default function GusukTourMainPage({ onNavigate, onNFCDemo }: GusukTourMainPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  // 전국 17개 지역 (첨부 이미지 기준)
  const regions: Region[] = [
    { id: 'seoul', name: '서울' },
    { id: 'busan', name: '부산' },
    { id: 'daegu', name: '대구' },
    { id: 'incheon', name: '인천' },
    { id: 'gwangju', name: '광주' },
    { id: 'daejeon', name: '대전', enabled: true },
    { id: 'ulsan', name: '울산' },
    { id: 'sejong', name: '세종' },
    { id: 'gyeonggi', name: '경기' },
    { id: 'gangwon', name: '강원' },
    { id: 'chungbuk', name: '충북' },
    { id: 'chungnam', name: '충남' },
    { id: 'jeonbuk', name: '전북' },
    { id: 'jeonnam', name: '전남' },
    { id: 'gyeongbuk', name: '경북' },
    { id: 'gyeongnam', name: '경남' },
    { id: 'jeju', name: '제주' }
  ];

  const menuItems: MenuItem[] = [
    {
      id: 'gusuk-tour-home',
      title: 'AI 콕콕 트리퍼 홈',
      type: 'home',
      isActive: true,
      action: () => setIsMenuOpen(false) // 현재 페이지이므로 메뉴만 닫기
    },
    {
      id: 'planner',
      title: '플래너 불러오기',
      type: 'region',
      action: () => window.open('https://korean.visitkorea.or.kr/list/travelcourse.do?service=abc&detailType=my', '_blank')
    },
    { 
      id: 'gusuk-shop', 
      title: '콕콕 상점', 
      type: 'shop',
      action: () => onNavigate('gusuk-shop')
    },
    { 
      id: 'national-stamp', 
      title: '전국 스탬프', 
      type: 'stamp',
      action: () => onNavigate('national-stamp') // 메뉴의 전국 스탬프는 national-stamp로 이동
    },
    { 
      id: 'coupon', 
      title: '쿠폰 보관함', 
      type: 'coupon',
      action: () => onNavigate('coupon')
    }
  ];

  const handleRegionSelect = (region: Region) => {
    if (region.enabled) {
      setSelectedRegion(region.id);
    } else {
      // 미구현 지역 알림
      alert(`${region.name} 지역은 준비 중입니다. 곧 만나볼 수 있어요!`);
    }
  };

  const handleNextClick = () => {
    if (selectedRegion === 'daejeon') {
      onNavigate('gusuk-tour-daejeon');
    } else if (selectedRegion) {
      // 다른 지역 선택 시
      const regionName = regions.find(r => r.id === selectedRegion)?.name;
      alert(`${regionName} 지역은 준비 중입니다. 곧 만나볼 수 있어요!`);
    } else {
      alert('여행할 지역을 선택해주세요!');
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
      setIsMenuOpen(false);
    }
  };

  const handleExitClick = () => {
    const confirmed = window.confirm('AI 콕콕 트리퍼를 종료하시겠습니까?');
    if (confirmed) {
      // 메인 사이트로 이동 (현재는 미구현)
      alert('메인 사이트로 이동하는 기능은 준비 중입니다.');
      // 실제 구현 시: window.location.href = 'https://ai-kokok-traveler.com';
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => (
    <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
      <div
        className={`p-3 rounded-lg cursor-pointer transition-colors ${
          item.isActive 
            ? 'bg-blue-100 text-blue-800' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => handleMenuItemClick(item)}
      >
        <span className={item.title.includes('트리퍼 in') ? 'font-bold tracking-wide' : ''}>
          {item.title}
        </span>
        {item.isActive && <span className="ml-2 text-xs">●</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 메뉴 버튼 */}
      <div className="absolute top-4 left-4 z-50 sm:top-6 sm:left-6">
        <Button
          onClick={() => setIsMenuOpen(true)}
          className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200"
        >
          <Menu className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">메뉴</span>
        </Button>
      </div>

      {/* NFC 예시 버튼 - 하단 우측에 배치 */}
      <div className="absolute bottom-6 right-6 z-40">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onNFCDemo}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg border-2 border-white/30 backdrop-blur-sm"
          >
            <Wifi className="w-5 h-5 mr-2" />
            NFC 예시
          </Button>
        </motion.div>
        
        {/* 버튼 설명 툴팁 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border border-gray-200"
        >
          <p className="text-xs text-gray-700 whitespace-nowrap">
            📱 NFC 태그 데모
          </p>
        </motion.div>
      </div>

      {/* 슬라이드 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* 메뉴 패널 */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-800">메뉴</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {menuItems.map(item => renderMenuItem(item))}
                </div>
              </div>

              {/* 좌측 하단 나가기 버튼 */}
              <div className="p-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleExitClick}
                  className="w-full flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  나가기
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 메인 콘텐츠 */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-6xl w-full">
          
          {/* 좌측: 지역 선택 카드 (컴팩트하게 수정) */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <Card className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-2xl max-w-md w-full">
              <div className="text-center mb-4 sm:mb-6">
                <div className="mb-3 sm:mb-4">
                  <h1 className="font-gmarket-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-tight mb-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                    AI콕콕 트리퍼
                  </h1>
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 mx-auto rounded-full opacity-80"></div>
                </div>
                <div className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4 font-medium">어디로 떠나실까요?</div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed">
                  여행을 떠나고 싶은 지역을<br />
                  선택해 주세요.
                </h2>
              </div>

              {/* 지역 선택 버튼들 (더 컴팩트하게) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {regions.map((region) => (
                  <motion.button
                    key={region.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`min-h-[40px] sm:min-h-[44px] px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center whitespace-nowrap ${
                      selectedRegion === region.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : region.enabled
                        ? 'bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => handleRegionSelect(region)}
                  >
                    {region.name}
                  </motion.button>
                ))}
              </div>

              <Button 
                className={`w-full py-2 sm:py-3 text-sm sm:text-base transition-all ${
                  selectedRegion 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleNextClick}
                disabled={!selectedRegion}
              >
                다음
              </Button>
              
              {selectedRegion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-xs sm:text-sm text-blue-600"
                >
                  {regions.find(r => r.id === selectedRegion)?.name} 지역이 선택되었습니다!
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* 우측: 까우니 캐릭터와 메시지 (모바일에서 크기 축소) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center justify-center text-center relative"
          >
            {/* "우리 함께 여행을 떠나보자!" 텍스트 (더 컴팩트하게) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-4 sm:mb-6 lg:mb-8 relative"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-lg border border-white/20">
                <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                  우리 함께 여행을 떠나보자!
                </div>
                <div className="flex items-center justify-center mt-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2" />
                  <span className="text-xs sm:text-sm text-blue-600">AI가 맞춤 여행을 도와드려요</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 ml-2" />
                </div>
              </div>
              
              {/* 말풍선 꼬리 */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-r border-b border-white/20"></div>
            </motion.div>

            {/* 까우니 캐릭터 (모바일에서 크기 축소) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="filter drop-shadow-xl"
              >
                <img 
                  src={kauniImage} 
                  alt="까우니" 
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain"
                />
              </motion.div>
              
              {/* 반짝이는 이펙트 (크기 축소) */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-lg sm:text-xl lg:text-2xl"
              >
                ✨
              </motion.div>

              {/* 하트 이펙트 (크기 축소) */}
              <motion.div
                animate={{ 
                  y: [0, -25, 0],
                  x: [0, 15, -15, 0],
                  scale: [0.8, 1.3, 0.8]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-lg sm:text-xl lg:text-2xl"
              >
                💕
              </motion.div>

              {/* 추가 반짝이 이펙트 (크기 축소) */}
              <motion.div
                animate={{ 
                  scale: [0.5, 1.1, 0.5],
                  opacity: [0.3, 0.7, 0.3],
                  rotate: [0, -180, -360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                className="absolute -bottom-1 -right-2 sm:-bottom-2 sm:-right-4 text-base sm:text-lg lg:text-xl"
              >
                🌟
              </motion.div>
            </motion.div>

            {/* 부가 설명 (더 컴팩트하게) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-4 sm:mt-6 text-white/80 text-xs sm:text-sm"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>숨겨진 명소 발견</span>
                </div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="flex items-center">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>따뜻한 여행 동반자</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}