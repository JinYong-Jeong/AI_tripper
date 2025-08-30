import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Circle, Star, Gift, MapPin, Coins, Trophy, Eye, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface StampPageProps {
  onBack: () => void;
  onGusukTour: () => void;
  fromDaejeon?: boolean; // 대전 스탬프에서 온 경우 구분
  fromMenu?: boolean; // 메뉴에서 온 경우 구분
  initialView?: 'stamp' | 'national' | 'market'; // 초기 뷰 설정 (market 추가)
  shouldTriggerStampSuccess?: boolean; // NFC 데모에서 인류관 스탬프 성공 트리거
  onStampSuccessComplete?: () => void; // 스탬프 성공 애니메이션 완료 콜백
}

interface ScienceMuseumMission {
  id: number;
  title: string;
  description: string;
  location: string;
  completed: boolean;
  reward: string;
  coinReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface NationalStamp {
  id: number;
  name: string;
  location: string;
  region: string;
  icon: string;
  collected: boolean;
  collectedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  subStamps?: NationalStamp[];
  completionRate?: number;
}

// 중앙시장 세부 미션 스탬프
const centralMarketMissions: ScienceMuseumMission[] = [
  {
    id: 201,
    title: '트렌디 패션 탐험가',
    description: '중앙쇼핑타워에서 3개 이상의 패션 매장을 방문하세요',
    location: '중앙쇼핑타워',
    completed: true,
    reward: '패션 매장 10% 할인 쿠폰',
    coinReward: 100,
    difficulty: 'easy',
    category: '쇼핑'
  },
  {
    id: 202,
    title: '전통시장 쇼핑 마스터',
    description: '원동국제시장에서 생활용품을 구매하세요',
    location: '원동국제시장',
    completed: false,
    reward: '생활용품 15% 할인 쿠폰',
    coinReward: 150,
    difficulty: 'medium',
    category: '쇼핑'
  },
  {
    id: 203,
    title: '먹자골목 미식가',
    description: '먹자골목에서 대전의 3대 명물 음식을 모두 맛보세요',
    location: '먹자골목',
    completed: true,
    reward: '까우니 요리사 모자 아이템',
    coinReward: 200,
    difficulty: 'medium',
    category: '먹거리'
  },
  {
    id: 204,
    title: '신선식품 감별사',
    description: '신중앙시장에서 신선한 농수산물을 구매하세요',
    location: '신중앙시장',
    completed: false,
    reward: '농수산물 20% 할인 쿠폰',
    coinReward: 120,
    difficulty: 'easy',
    category: '쇼핑'
  },
  {
    id: 205,
    title: '홈데코 디자이너',
    description: '홈커텐거리에서 인테리어 소품을 구매하고 꾸미기 팁을 받으세요',
    location: '홈커텐거리',
    completed: false,
    reward: '까우니 인테리어 안경 아이템',
    coinReward: 150,
    difficulty: 'medium',
    category: '문화'
  },
  {
    id: 206,
    title: '빈티지 헌터',
    description: '양키시장에서 특별한 빈티지 아이템을 발견하세요',
    location: '양키시장',
    completed: false,
    reward: '중앙시장 특제 에코백',
    coinReward: 250,
    difficulty: 'hard',
    category: '문화'
  },
  {
    id: 207,
    title: '시장 문화 체험가',
    description: '토요일 빈티지 마켓 특별전에 참여하세요',
    location: '양키시장',
    completed: false,
    reward: '특별전 참여 인증서',
    coinReward: 100,
    difficulty: 'easy',
    category: '문화'
  },
  {
    id: 208,
    title: '시장 사진작가',
    description: '각 구역별로 대표적인 장소에서 인증샷을 찍으세요',
    location: '전체 구역',
    completed: false,
    reward: '시장 포토북 제작권',
    coinReward: 180,
    difficulty: 'medium',
    category: '사진'
  }
];

// 국립중앙과학관 세부 미션 스탬프
let scienceMuseumMissions: ScienceMuseumMission[] = [
  {
    id: 1,
    title: '인류관 NFC 태그',
    description: '인류관 입구에서 NFC를 태그하여 스탬프를 획득하세요',
    location: '인류관 1층 입구',
    completed: true,
    reward: '대전 시티투어 10% 할인 쿠폰',
    coinReward: 100,
    difficulty: 'easy',
    category: '체험'
  },
  {
    id: 2,
    title: '자연사관 공룡 퀴즈',
    description: '자연사관에서 공룡에 대한 퀴즈 3문제를 맞혀보세요',
    location: '자연사관 공룡 전시실',
    completed: true,
    reward: '까우니 모자 아이템',
    coinReward: 200,
    difficulty: 'medium',
    category: '학습'
  },
  {
    id: 3,
    title: '과학기술관 로봇 체험',
    description: '과학기술관에서 로봇 조작 체험을 완료하세요',
    location: '과학기술관 체험존',
    completed: false,
    reward: '한밭수목원 입장권',
    coinReward: 150,
    difficulty: 'medium',
    category: '체험'
  },
  {
    id: 4,
    title: '천체관 플라네타리움 관람',
    description: '천체관에서 플라네타리움 상영을 끝까지 관람하세요',
    location: '천체관 플라네타리움',
    completed: false,
    reward: '까우니 안경 아이템',
    coinReward: 120,
    difficulty: 'easy',
    category: '관람'
  },
  {
    id: 5,
    title: '어린이과학관 미션 클리어',
    description: '어린이과학관의 모든 체험 활동을 완료하세요',
    location: '어린이과학관 전체',
    completed: false,
    reward: '대전 오월드 할인 쿠폰',
    coinReward: 300,
    difficulty: 'hard',
    category: '체험'
  },
  {
    id: 6,
    title: '생물탐구관 생태계 학습',
    description: '생물탐구관에서 생태계 전시를 모두 둘러보세요',
    location: '생물탐구관',
    completed: false,
    reward: '까우니 가운 아이템',
    coinReward: 180,
    difficulty: 'medium',
    category: '학습'
  }
];

// 전국 스탬프 컬렉션
const nationalStamps: NationalStamp[] = [
  // 서울 지역
  {
    id: 10,
    name: '경복궁',
    location: '서울 종로구',
    region: '서울',
    icon: '🏰',
    collected: false,
    rarity: 'common',
    description: '조선왕조의 정궁'
  },
  {
    id: 11,
    name: 'N서울타워',
    location: '서울 용산구',
    region: '서울',
    icon: '🗼',
    collected: false,
    rarity: 'common',
    description: '서울의 랜드마크'
  },
  {
    id: 12,
    name: '명동 거리',
    location: '서울 중구',
    region: '서울',
    icon: '🛍️',
    collected: false,
    rarity: 'common',
    description: '쇼핑과 문화의 중심지'
  },
  {
    id: 13,
    name: '한강공원',
    location: '서울 전역',
    region: '서울',
    icon: '🌊',
    collected: false,
    rarity: 'common',
    description: '서울 시민들의 휴식처'
  },
  {
    id: 14,
    name: '덕수궁',
    location: '서울 중구',
    region: '서울',
    icon: '🏯',
    collected: false,
    rarity: 'common',
    description: '근현대사가 살아있는 궁궐'
  },
  {
    id: 15,
    name: '인사동 거리',
    location: '서울 종로구',
    region: '서울',
    icon: '🎨',
    collected: false,
    rarity: 'common',
    description: '전통문화의 거리'
  },

  // 경기인천 지역
  {
    id: 16,
    name: '에버랜드',
    location: '경기 용인',
    region: '경기인천',
    icon: '🎢',
    collected: false,
    rarity: 'common',
    description: '환상과 모험의 테마파크'
  },
  {
    id: 17,
    name: '인천국제공항',
    location: '인천 중구',
    region: '경기인천',
    icon: '✈️',
    collected: false,
    rarity: 'common',
    description: '세계로 향하는 관문'
  },
  {
    id: 18,
    name: '수원 화성',
    location: '경기 수원',
    region: '경기인천',
    icon: '🏛️',
    collected: false,
    rarity: 'common',
    description: 'UNESCO 세계문화유산'
  },
  {
    id: 19,
    name: '파주 헤이리마을',
    location: '경기 파주',
    region: '경기인천',
    icon: '🏘️',
    collected: false,
    rarity: 'common',
    description: '예술가들의 창작 마을'
  },

  // 강원 지역
  {
    id: 20,
    name: '설악산 국립공원',
    location: '강원 속초',
    region: '강원',
    icon: '🏔️',
    collected: false,
    rarity: 'common',
    description: '대자연의 웅장함'
  },
  {
    id: 21,
    name: '춘천 남이섬',
    location: '강원 춘천',
    region: '강원',
    icon: '🌸',
    collected: false,
    rarity: 'common',
    description: '로맨틱한 섬 여행'
  },
  {
    id: 22,
    name: '평창 올림픽파크',
    location: '강원 평창',
    region: '강원',
    icon: '🏅',
    collected: false,
    rarity: 'common',
    description: '2018 동계올림픽의 무대'
  },
  {
    id: 23,
    name: '강릉 경포대',
    location: '강원 강릉',
    region: '강원',
    icon: '🌅',
    collected: false,
    rarity: 'common',
    description: '동해의 일출 명소'
  },

  // 대전 지역 (국립중앙과학관과 대전중앙시장은 세부 스탬프 포함)
  {
    id: 1,
    name: '국립중앙과학관',
    location: '대전 유성구',
    region: '대전',
    icon: '🔬',
    collected: false,
    rarity: 'common',
    description: '과학의 신비를 탐험하는 곳',
    completionRate: 33, // 6개 중 2개 완료
    subStamps: [
      {
        id: 101,
        name: '인류관',
        location: '대전 유성구',
        region: '대전',
        icon: '👨‍🔬',
        collected: true,
        collectedDate: '2025.01.15',
        rarity: 'rare',
        description: '인류의 진화와 문명을 탐험'
      },
      {
        id: 102,
        name: '자연사관',
        location: '대전 유성구',
        region: '대전',
        icon: '🦕',
        collected: true,
        collectedDate: '2025.01.15',
        rarity: 'rare',
        description: '공룡과 고생물의 세계'
      },
      {
        id: 103,
        name: '과학기술관',
        location: '대전 유성구',
        region: '대전',
        icon: '🤖',
        collected: false,
        rarity: 'epic',
        description: '첨단 과학기술 체험'
      },
      {
        id: 104,
        name: '천체관',
        location: '대전 유성구',
        region: '대전',
        icon: '🌌',
        collected: false,
        rarity: 'rare',
        description: '우주와 천체의 신비'
      },
      {
        id: 105,
        name: '어린이과학관',
        location: '대전 유성구',
        region: '대전',
        icon: '🧒',
        collected: false,
        rarity: 'common',
        description: '어린이를 위한 과학 놀이터'
      },
      {
        id: 106,
        name: '생물탐구관',
        location: '대전 유성구',
        region: '대전',
        icon: '🔬',
        collected: false,
        rarity: 'rare',
        description: '생명과학의 세계 탐구'
      }
    ]
  },
  {
    id: 9,
    name: '대전중앙시장',
    location: '대전 동구',
    region: '대전',
    icon: '🏪',
    collected: false,
    rarity: 'common',
    description: '전통과 정이 살아있는 시장',
    completionRate: 25, // 8개 중 2개 완료
    subStamps: [
      {
        id: 201,
        name: '중앙쇼핑타워',
        location: '대전 동구',
        region: '대전',
        icon: '👗',
        collected: true,
        collectedDate: '2025.01.16',
        rarity: 'common',
        description: '트렌디한 패션과 뷰티의 중심지'
      },
      {
        id: 202,
        name: '원동국제시장',
        location: '대전 동구',
        region: '대전',
        icon: '🛍️',
        collected: false,
        rarity: 'common',
        description: '생활용품과 다양한 상품들의 보고'
      },
      {
        id: 203,
        name: '먹자골목',
        location: '대전 동구',
        region: '대전',
        icon: '🍜',
        collected: true,
        collectedDate: '2025.01.16',
        rarity: 'rare',
        description: '대전 3대 명물 음식의 메카'
      },
      {
        id: 204,
        name: '신중앙시장',
        location: '대전 동구',
        region: '대전',
        icon: '🐟',
        collected: false,
        rarity: 'common',
        description: '신선한 농수산물과 식자재의 천국'
      },
      {
        id: 205,
        name: '홈커텐거리',
        location: '대전 동구',
        region: '대전',
        icon: '🏠',
        collected: false,
        rarity: 'common',
        description: '인테리어와 홈데코 전문 구역'
      },
      {
        id: 206,
        name: '양키시장',
        location: '대전 동구',
        region: '대전',
        icon: '💎',
        collected: false,
        rarity: 'epic',
        description: '빈티지와 특별한 아이템들의 보물창고'
      },
      {
        id: 207,
        name: '시장 문화체험',
        location: '대전 동구',
        region: '대전',
        icon: '🎭',
        collected: false,
        rarity: 'rare',
        description: '전통시장의 문화와 정취 체험'
      },
      {
        id: 208,
        name: '시장 포토존',
        location: '대전 동구',
        region: '대전',
        icon: '📸',
        collected: false,
        rarity: 'common',
        description: '시장의 활기찬 모습을 담는 특별한 장소'
      }
    ]
  },
  {
    id: 7,
    name: '한밭수목원',
    location: '대전 서구',
    region: '대전',
    icon: '🌳',
    collected: false,
    rarity: 'common',
    description: '도심 속 자연의 오아시스'
  },
  {
    id: 8,
    name: '엑스포 과학공원',
    location: '대전 유성구',
    region: '대전',
    icon: '🎡',
    collected: false,
    rarity: 'common',
    description: '미래와 과학이 만나는 공간'
  }
];

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const rarityNames = {
  common: '일반',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설'
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'hard': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '쉬움';
    case 'medium': return '보통';
    case 'hard': return '어려움';
    default: return '알 수 없음';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case '체험': return '🎮';
    case '학습': return '📚';
    case '관람': return '👀';
    case '쇼핑': return '🛍️';
    case '먹거리': return '🍜';
    case '문화': return '🎭';
    case '사진': return '📸';
    default: return '📝';
  }
};

// 보상 텍스트를 짧게 표시하는 함수
const getShortReward = (reward: string) => {
  if (reward.includes('할인')) {
    const match = reward.match(/(\w+)\s*할인/);
    if (match) {
      return `${match[1]} 할인`;
    }
  }
  if (reward.includes('입장권')) {
    const match = reward.match(/(\w+)\s*입장권/);
    if (match) {
      return `${match[1]} 입장권`;
    }
  }
  if (reward.includes('아이템')) {
    const match = reward.match(/까우니\s*(\w+)\s*아이템/);
    if (match) {
      return `${match[1]} 아이템`;
    }
  }
  // 기본적으로 첫 두 단어만 표시
  const words = reward.split(' ');
  if (words.length > 2) {
    return words.slice(0, 2).join(' ');
  }
  return reward;
};

// 지역별 그룹핑 (순서 변경: 서울 -> 경기인천 -> 강원 -> 대전)
const groupedStamps = nationalStamps.reduce((acc, stamp) => {
  if (!acc[stamp.region]) {
    acc[stamp.region] = [];
  }
  acc[stamp.region].push(stamp);
  return acc;
}, {} as Record<string, NationalStamp[]>);

const regions = ['서울', '경기인천', '강원', '대전'];

export default function StampPage({ onBack, onGusukTour, fromDaejeon = false, fromMenu = false, initialView = 'stamp', shouldTriggerStampSuccess = false, onStampSuccessComplete }: StampPageProps) {
  const [isNationalView, setIsNationalView] = useState(initialView === 'national');
  const [isMarketView, setIsMarketView] = useState(initialView === 'market');
  const [selectedMission, setSelectedMission] = useState<ScienceMuseumMission | null>(null);
  const [expandedStamps, setExpandedStamps] = useState<Set<number>>(new Set());
  const daejeonRef = useRef<HTMLDivElement>(null);
  const [isAnimatingSuccess, setIsAnimatingSuccess] = useState(false);

  // 인류관 미션 성공 트리거 처리
  useEffect(() => {
    if (shouldTriggerStampSuccess && !isAnimatingSuccess) {
      setIsAnimatingSuccess(true);
      
      // 인류관 미션을 완료 상태로 변경
      const humanityMission = scienceMuseumMissions.find(m => m.id === 1);
      if (humanityMission && !humanityMission.completed) {
        humanityMission.completed = true;
        
        // 2초 후 애니메이션 완료 콜백 호출
        setTimeout(() => {
          setIsAnimatingSuccess(false);
          onStampSuccessComplete?.();
        }, 2000);
      } else {
        // 이미 완료된 경우 즉시 콜백 호출
        setIsAnimatingSuccess(false);
        onStampSuccessComplete?.();
      }
    }
  }, [shouldTriggerStampSuccess, isAnimatingSuccess, onStampSuccessComplete]);

  // 현재 미션 타입에 따라 미션 데이터 선택
  const currentMissions = isMarketView ? centralMarketMissions : scienceMuseumMissions;
  const completedMissions = currentMissions.filter(mission => mission.completed).length;
  const totalMissions = currentMissions.length;
  const missionCompletionRate = (completedMissions / totalMissions) * 100;
  const totalEarnedCoins = currentMissions.filter(m => m.completed).reduce((sum, m) => sum + m.coinReward, 0);

  const collectedNationalStamps = nationalStamps.filter(stamp => stamp.collected).length + 
    nationalStamps.reduce((sum, stamp) => sum + (stamp.subStamps?.filter(sub => sub.collected).length || 0), 0);
  const totalNationalStamps = nationalStamps.length + 
    nationalStamps.reduce((sum, stamp) => sum + (stamp.subStamps?.length || 0), 0);
  const nationalCollectionRate = (collectedNationalStamps / totalNationalStamps) * 100;

  const handleNationalView = () => {
    setIsNationalView(true);
    if (fromDaejeon) {
      // 대전에서 온 경우 대전 섹션으로 스크롤
      setTimeout(() => {
        daejeonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const toggleStampExpansion = (stampId: number) => {
    const newExpanded = new Set(expandedStamps);
    if (newExpanded.has(stampId)) {
      newExpanded.delete(stampId);
    } else {
      newExpanded.add(stampId);
    }
    setExpandedStamps(newExpanded);
  };

  const handleBackToStampView = () => {
    setIsNationalView(false);
    setIsMarketView(false);
  };

  if (isNationalView) {
    return (
      <div className="min-h-screen p-4 relative bg-gradient-to-b from-yellow-50 to-white">
        {/* Fixed 돌아가기 버튼 (좌측 상단, 스크롤시에도 고정) */}
        <div className="fixed top-4 left-4 z-50">
          <Button 
            variant="default" 
            onClick={fromMenu ? onBack : (fromDaejeon ? onBack : handleBackToStampView)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {fromMenu ? '돌아가기' : (fromDaejeon ? '대전 스탬프로' : '과학관 스탬프로')}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 pt-16"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Trophy className="w-8 h-8 mr-3 text-yellow-600" />
                전국 스탬프 컬렉션
              </h1>
              <p className="text-gray-600">전국 곳곳의 특별한 장소에서 스탬프를 수집해보세요!</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-xl text-yellow-700">{collectedNationalStamps} / {totalNationalStamps}</span>
              </div>
              <div className="text-sm text-gray-600">수집률: {Math.round(nationalCollectionRate)}%</div>
            </div>
          </div>
          <Progress value={nationalCollectionRate} className="mb-6" />
        </motion.div>

        {/* 전국 스탬프 리스트 */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {regions.map((region) => (
              <motion.div
                key={region}
                ref={region === '대전' ? daejeonRef : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* 지역 구분선 */}
                <div className="flex items-center mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="px-4 py-2 bg-blue-100 rounded-full mx-4">
                    <h2 className="font-medium text-blue-800">{region} 지역</h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* 지역별 스탬프들 */}
                <div className="space-y-3">
                  {groupedStamps[region]?.map((stamp) => (
                    <div key={stamp.id}>
                      {/* 메인 스탬프 */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          stamp.collected 
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300 shadow-md' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => stamp.subStamps && toggleStampExpansion(stamp.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`text-3xl ${stamp.collected ? '' : 'filter grayscale opacity-50'}`}>
                              {stamp.icon}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-medium ${stamp.collected ? 'text-gray-800' : 'text-gray-500'}`}>
                                  {stamp.name}
                                </h4>
                                {stamp.completionRate !== undefined && (
                                  <div className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    {stamp.completionRate}%
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 space-x-4">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {stamp.location}
                                </div>
                                {stamp.collected && stamp.collectedDate && (
                                  <div className="text-green-600 font-medium">
                                    획득: {stamp.collectedDate}
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-1">{stamp.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {stamp.collected ? (
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                              </div>
                            ) : (
                              <div className="text-gray-400">
                                <Circle className="w-5 h-5" />
                              </div>
                            )}
                            {stamp.subStamps && (
                              <div className="text-gray-400">
                                {expandedStamps.has(stamp.id) ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* 세부 스탬프들 (확장된 경우만 표시) */}
                      <AnimatePresence>
                        {expandedStamps.has(stamp.id) && stamp.subStamps && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-8 mt-3 space-y-2 overflow-hidden"
                          >
                            {stamp.subStamps.map((subStamp) => (
                              <motion.div
                                key={subStamp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  subStamp.collected 
                                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-sm' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`text-2xl ${subStamp.collected ? '' : 'filter grayscale opacity-50'}`}>
                                      {subStamp.icon}
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h5 className={`text-sm font-medium ${subStamp.collected ? 'text-gray-800' : 'text-gray-500'}`}>
                                          {subStamp.name}
                                        </h5>
                                        <Badge className={`text-white text-xs ${rarityColors[subStamp.rarity]}`}>
                                          {rarityNames[subStamp.rarity]}
                                        </Badge>
                                      </div>
                                      
                                      <p className="text-xs text-gray-500">{subStamp.description}</p>
                                      
                                      {subStamp.collected && subStamp.collectedDate && (
                                        <div className="text-xs text-green-600 font-medium mt-1">
                                          획득: {subStamp.collectedDate}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center">
                                    {subStamp.collected ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 기본 모드: 국립중앙과학관 스탬프
  return (
    <div className="min-h-screen p-4 relative">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 pt-4"
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold mr-4">
                {isMarketView ? '중앙시장 미션 스탬프' : '과학관 미션 스탬프'}
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNationalView}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                전국 스탬프
              </Button>
            </div>
            <p className="text-gray-600">
              {isMarketView ? '대전중앙시장에서 미션을 완료하고 스탬프를 획득하세요!' : '과학관에서 미션을 완료하고 스탬프를 획득하세요!'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-xl text-yellow-700">{completedMissions} / {totalMissions}</span>
            </div>
            <div className="flex items-center justify-end text-sm text-gray-600">
              <Coins className="w-4 h-4 mr-1" />
              <span>{totalEarnedCoins} 코인 획득</span>
            </div>
          </div>
        </div>
        <Progress value={missionCompletionRate} className="mb-6" />
      </motion.div>

      {/* 미션 스탬프 카드 목록 */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  mission.completed 
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
                }`}
                onClick={() => setSelectedMission(selectedMission?.id === mission.id ? null : mission)}
              >
                {/* NFC 데모 성공 애니메이션 */}
                {mission.id === 1 && isAnimatingSuccess && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 1.5, times: [0, 0.6, 1] }}
                    className="absolute inset-0 bg-green-100 border-2 border-green-300 rounded-lg z-10 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: 1 }}
                        className="text-6xl mb-2"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-lg font-bold text-green-800">미션 성공!</h3>
                      <p className="text-sm text-green-600">인류관 NFC 태그 완료</p>
                    </div>
                  </motion.div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCategoryIcon(mission.category)}</div>
                      <div>
                        <h3 className={`font-medium text-sm ${mission.completed ? 'text-green-800' : 'text-gray-800'}`}>
                          {mission.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{mission.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {mission.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{mission.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-white text-xs ${getDifficultyColor(mission.difficulty)}`}>
                        {getDifficultyText(mission.difficulty)}
                      </Badge>
                      <div className="text-xs text-gray-500">{mission.category}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs text-yellow-600">
                        <Coins className="w-3 h-3 mr-1" />
                        {mission.coinReward}
                      </div>
                    </div>
                  </div>

                  {/* 보상 정보 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-600">
                      <Gift className="w-3 h-3 mr-1" />
                      <span className="truncate">{getShortReward(mission.reward)}</span>
                    </div>
                  </div>
                </div>

                {/* 완료 배지 */}
                {mission.completed && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      완료
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 선택된 미션 상세 정보 */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMission(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{selectedMission.title}</h3>
                <button 
                  onClick={() => setSelectedMission(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">설명</label>
                  <p className="text-sm text-gray-600">{selectedMission.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">위치</label>
                  <p className="text-sm text-gray-600">{selectedMission.location}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">난이도</label>
                    <Badge className={`text-white text-xs ml-2 ${getDifficultyColor(selectedMission.difficulty)}`}>
                      {getDifficultyText(selectedMission.difficulty)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <label className="text-sm font-medium text-gray-700">보상 코인</label>
                    <div className="flex items-center text-yellow-600">
                      <Coins className="w-4 h-4 mr-1" />
                      {selectedMission.coinReward}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">보상</label>
                  <p className="text-sm text-gray-600">{selectedMission.reward}</p>
                </div>
                
                <div className="pt-3 border-t">
                  <div className={`text-center py-2 px-4 rounded-lg ${
                    selectedMission.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedMission.completed ? '✅ 미션 완료!' : '📍 미션 진행 중'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}