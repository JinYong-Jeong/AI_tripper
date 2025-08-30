import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MapPin, Award, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { PageType } from '../App';
import informationImage from 'figma:asset/c4018364e37ec51ebcab0ae18df3d52fe3d6892d.png';
import passedStampImage from 'figma:asset/e53cb61fbb7373bd6df3e35d4929b3507432aad7.png';

interface MainPageProps {
  onNavigate: (page: PageType) => void;
  onNationalStamp: () => void; // 메뉴의 전국 스탬프용 별도 함수
  onGusukTour: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  type: 'home' | 'region' | 'attraction' | 'shop' | 'stamp' | 'coupon';
  isActive?: boolean;
  children?: MenuItem[];
  action?: () => void;
}

export default function MainPage({ onNavigate, onNationalStamp, onGusukTour }: MainPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'gusuk-tour-home',
      title: 'AI 콕콕 트리퍼 홈',
      type: 'home',
      action: () => onNavigate('gusuk-tour-main')
    },
    {
      id: 'planner',
      title: '플래너 불러오기',
      type: 'region',
      action: () => window.open('https://korean.visitkorea.or.kr/list/travelcourse.do?service=abc&detailType=my', '_blank')
    },
    {
      id: 'gusuk-tour-daejeon',
      title: '트리퍼 in 대전',
      type: 'region',
      action: () => onGusukTour(), // 트리퍼_대전 페이지로 이동
      children: [
        { 
          id: 'science-museum', 
          title: '국립중앙과학관', 
          type: 'attraction',
          isActive: true
        },
        { 
          id: 'central-market', 
          title: '대전중앙시장', 
          type: 'attraction',
          action: () => onNavigate('daejeon-central-market')
        },
        { 
          id: 'bread-tour', 
          title: '빵지순례', 
          type: 'attraction',
          action: () => onNavigate('tour-guide')
        },
        { 
          id: 'skyroad', 
          title: '스카이로드', 
          type: 'attraction',
          action: () => onNavigate('tour-guide')
        },
        { 
          id: 'expo-park', 
          title: '엑스포 과학공원', 
          type: 'attraction'
        },
        { 
          id: 'oworld', 
          title: '오월드', 
          type: 'attraction',
          action: () => onNavigate('tour-guide')
        },
        { 
          id: 'yuseong-hotspring', 
          title: '유성온천', 
          type: 'attraction',
          action: () => onNavigate('tour-guide')
        },
        { 
          id: 'hanbit-arboretum', 
          title: '한밭수목원', 
          type: 'attraction'
        }
      ]
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
      action: () => onNationalStamp() // 메뉴의 전국 스탬프는 별도 함수 호출
    },
    { 
      id: 'coupon', 
      title: '쿠폰 보관함', 
      type: 'coupon',
      action: () => onNavigate('coupon')
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
      setIsMenuOpen(false);
    } else if (item.type === 'attraction' && !item.action && !item.isActive) {
      // 미구현 관광지 알림
      alert(`${item.title}은 준비 중입니다. 곧 만나볼 수 있어요!`);
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
            : item.action || (item.type === 'attraction' && !item.action)
            ? 'hover:bg-gray-100'
            : 'hover:bg-gray-100'
        }`}
        onClick={() => handleMenuItemClick(item)}
      >
        <span className={item.title.includes('트리퍼 in') ? 'tracking-wide' : ''}>
          {item.title}
        </span>
        {item.isActive && <span className="ml-2 text-xs">●</span>}
      </div>
      {item.children && (
        <div className="mt-1">
          {item.children.map(child => renderMenuItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* 메뉴 버튼 */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          onClick={() => setIsMenuOpen(true)}
          className="bg-white/80 hover:bg-white text-gray-700 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200"
        >
          <Menu className="w-5 h-5 mr-2" />
          메뉴
        </Button>
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

      {/* 메인 콘텐츠 - 더 아래로 이동 */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl mb-4 text-gray-800">
            <span className="hidden sm:inline font-gmarket-bold tracking-wide">트리퍼 in 국립중앙과학관</span>
            <span className="sm:hidden font-gmarket-bold tracking-wide">
              트리퍼 in<br />국립중앙과학관
            </span>
          </h1>
          <p className="text-lg text-gray-600">과학의 세계로 떠나는 재미있는 여행을 시작해보세요!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* 관람 안내 카드 */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-300 transition-all duration-500 shadow-xl hover:shadow-2xl h-72"
              onClick={() => onNavigate('national-science-museum-guide')}
            >
              {/* 이미지 섹션 */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-100/80 to-transparent z-10"></div>
                <img 
                  src={informationImage} 
                  alt="구석구석 백과" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* 아이콘 오버레이 */}
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
              
              {/* 텍스트 섹션 */}
              <div className="p-5 bg-gradient-to-b from-amber-50 to-orange-50">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2 text-amber-800 group-hover:text-amber-900 transition-colors">
                    구석구석 백과
                  </h2>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    실시간 혼잡도와 구역별 정보를 확인하고<br />
                    현재 진행 중인 특별한 행사들을 만나보세요!
                  </p>
                </div>
              </div>

              {/* 호버 이펙트 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-yellow-400/20 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </Card>
          </motion.div>

          {/* 미션 스탬프 카드 */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 border-2 border-red-200 hover:border-red-300 transition-all duration-500 shadow-xl hover:shadow-2xl h-72"
              onClick={() => onNavigate('stamp')} // 페이지의 미션 스탬프는 과학관 스탬프로 이동
            >
              {/* 이미지 섹션 */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-red-100/80 to-transparent z-10"></div>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-700">
                  <motion.img 
                    src={passedStampImage} 
                    alt="PASSED 스탬프" 
                    className="w-28 h-28 object-contain"
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {/* 아이콘 오버레이 */}
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <Award className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              
              {/* 텍스트 섹션 */}
              <div className="p-5 bg-gradient-to-b from-red-50 to-pink-50">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2 text-red-800 group-hover:text-red-900 transition-colors">
                    구석구석 스탬프
                  </h2>
                  <p className="text-red-700 text-sm leading-relaxed">
                    과학관에서 미션을 완료하고 스탬프를 수집하여<br />
                    특별한 혜택과 인증을 받아보세요!
                  </p>
                </div>
              </div>

              {/* 호버 이펙트 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-pink-400/20 to-rose-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}