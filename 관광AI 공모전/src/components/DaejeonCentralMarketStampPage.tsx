import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Circle, Star, Gift, MapPin, Coins, Trophy, Eye, ChevronDown, ChevronUp, Ticket, ShoppingBag, Utensils, Award, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

import stampImage from 'figma:asset/0c0def213758d15d52895a728ac56863139ee9d7.png';

interface DaejeonCentralMarketStampPageProps {
  onBack: () => void;
}

interface MarketMission {
  id: number;
  title: string;
  description: string;
  location: string;
  completed: boolean;
  reward: string;
  coinReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: string;
  tips: string[];
}

// 대전중앙시장 미션 데이터
const marketMissions: MarketMission[] = [
  {
    id: 1,
    title: '트렌디 패션 탐험가',
    description: '중앙쇼핑타워에서 3개 이상의 패션 매장을 방문하세요',
    location: '중앙쇼핑타워',
    completed: true,
    reward: '패션 매장 10% 할인 쿠폰',
    coinReward: 100,
    difficulty: 'easy',
    category: '쇼핑',
    icon: '👗',
    tips: ['트렌디 패션, 뷰티 플러스 등을 방문해보세요', '매장 직원에게 인사를 나누며 대화해보세요']
  },
  {
    id: 2,
    title: '전통시장 쇼핑 마스터',
    description: '원동국제시장에서 생활용품을 구매하세요',
    location: '원동국제시장',
    completed: false,
    reward: '생활용품 15% 할인 쿠폰',
    coinReward: 150,
    difficulty: 'medium',
    category: '쇼핑',
    icon: '🛍️',
    tips: ['생활백화점에서 실용적인 물건을 구매해보세요', '가격 비교를 통해 좋은 상품을 찾아보세요']
  },
  {
    id: 3,
    title: '먹자골목 미식가',
    description: '먹자골목에서 대전의 3대 명물 음식을 모두 맛보세요',
    location: '먹자골목',
    completed: true,
    reward: '까우니 요리사 모자 아이템',
    coinReward: 200,
    difficulty: 'medium',
    category: '먹거리',
    icon: '🍜',
    tips: ['할머니 손칼국수, 대전 순대국밥, 매운 떡볶이를 방문해보세요', '음식 사진을 찍어 인증해보세요']
  },
  {
    id: 4,
    title: '신선식품 감별사',
    description: '신중앙시장에서 신선한 농수산물을 구매하세요',
    location: '신중앙시장',
    completed: false,
    reward: '농수산물 20% 할인 쿠폰',
    coinReward: 120,
    difficulty: 'easy',
    category: '쇼핑',
    icon: '🐟',
    tips: ['싱싱 수산이나 자연농산에서 신선한 재료를 구매해보세요', '매장 사장님께 요리법을 물어보세요']
  },
  {
    id: 5,
    title: '홈데코 디자이너',
    description: '홈커텐거리에서 인테리어 소품을 구매하고 꾸미기 팁을 받으세요',
    location: '홈커텐거리',
    completed: false,
    reward: '까우니 인테리어 안경 아이템',
    coinReward: 150,
    difficulty: 'medium',
    category: '문화',
    icon: '🏠',
    tips: ['우리집 인테리어에서 전문 상담을 받아보세요', '홈데코 플러스에서 작은 소품부터 시작해보세요']
  },
  {
    id: 6,
    title: '빈티지 헌터',
    description: '양키시장에서 특별한 빈티지 아이템을 발견하세요',
    location: '양키시장',
    completed: false,
    reward: '중앙시장 특제 에코백',
    coinReward: 250,
    difficulty: 'hard',
    category: '문화',
    icon: '💎',
    tips: ['빈티지 컬렉션에서 역사 있는 아이템을 찾아보세요', '유니크 스토어에서 희귀한 수집품을 탐험해보세요']
  },
  {
    id: 7,
    title: '시장 사진작가',
    description: '각 구역별로 대표적인 장소에서 인증샷을 찍으세요',
    location: '전체 구역',
    completed: false,
    reward: '시장 포토북 제작권',
    coinReward: 180,
    difficulty: 'medium',
    category: '사진',
    icon: '📸',
    tips: ['각 구역의 대표 간판이나 특징적인 장소에서 사진을 찍어보세요', '시장의 활기찬 모습을 담아보세요']
  },
  {
    id: 8,
    title: '시장 문화 체험가',
    description: '토요일 빈티지 마켓 특별전에 참여하세요',
    location: '양키시장',
    completed: false,
    reward: '특별전 참여 인증서',
    coinReward: 100,
    difficulty: 'easy',
    category: '문화',
    icon: '🎭',
    tips: ['토요일 14:00-18:00에 진행되는 특별전에 참여해보세요', '다른 방문객들과 교류해보세요']
  }
];

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
    const match = reward.match(/([\w가-힣]+)\s*할인/);
    if (match) {
      return `${match[1]} 할인`;
    }
  }
  if (reward.includes('아이템')) {
    const match = reward.match(/까우니\s*([\w가-힣]+)\s*아이템/);
    if (match) {
      return `${match[1]} 아이템`;
    }
  }
  if (reward.includes('에코백')) {
    return '에코백';
  }
  if (reward.includes('포토북')) {
    return '포토북';
  }
  if (reward.includes('인증서')) {
    return '인증서';
  }
  // 기본적으로 첫 두 단어만 표시
  const words = reward.split(' ');
  if (words.length > 2) {
    return words.slice(0, 2).join(' ');
  }
  return reward;
};

export default function DaejeonCentralMarketStampPage({ onBack }: DaejeonCentralMarketStampPageProps) {
  const [selectedMission, setSelectedMission] = useState<MarketMission | null>(null);

  const completedMissions = marketMissions.filter(mission => mission.completed).length;
  const totalMissions = marketMissions.length;
  const missionCompletionRate = (completedMissions / totalMissions) * 100;
  const totalEarnedCoins = marketMissions.filter(m => m.completed).reduce((sum, m) => sum + m.coinReward, 0);

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
              <img 
                src={stampImage} 
                alt="스탬프" 
                className="w-8 h-8 mr-3"
              />
              <h1 className="text-3xl font-bold mr-4">중앙시장 미션 스탬프</h1>
            </div>
            <p className="text-gray-600">시장에서 미션을 완료하고 특별한 보상을 받아보세요!</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <Coins className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-xl text-yellow-700">{totalEarnedCoins}G</span>
            </div>
            <div className="text-sm text-gray-600">{completedMissions}/{totalMissions} 완료</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 미션 스탬프 목록 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                미션 진행 현황
              </h3>
              <div className="text-right">
                <div className="text-sm text-gray-600">완료된 미션</div>
                <div className="font-bold">{completedMissions} / {totalMissions}</div>
              </div>
            </div>
            
            <Progress value={missionCompletionRate} className="mb-6" />
            
            <div className="space-y-3">
              {marketMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mission.completed 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:border-green-300 shadow-md' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMission(mission)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {mission.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 mr-2" />
                        )}
                        <span className="text-2xl mr-2">{mission.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${mission.completed ? 'text-gray-800' : 'text-gray-600'}`}>
                            {mission.title}
                          </h4>
                          <Badge className={`text-white text-xs ${getDifficultyColor(mission.difficulty)}`}>
                            {getDifficultyText(mission.difficulty)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {mission.location}
                          </div>
                          <div className="flex items-center">
                            <Ticket className="w-3 h-3 mr-1 text-purple-600" />
                            <span className="text-purple-600 font-medium">{getShortReward(mission.reward)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        <Coins className="w-3 h-3 mr-1" />
                        {mission.coinReward}G
                      </div>
                      <div className="text-gray-400">
                        {selectedMission?.id === mission.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 미션 상세 정보 사이드바 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 sticky top-4">
            {selectedMission ? (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{selectedMission.icon}</span>
                  <div>
                    <h3 className="font-bold">{selectedMission.title}</h3>
                    <Badge className={`text-white text-xs ${getDifficultyColor(selectedMission.difficulty)}`}>
                      {getDifficultyText(selectedMission.difficulty)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      미션 설명
                    </h4>
                    <p className="text-sm text-gray-600">{selectedMission.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      위치
                    </h4>
                    <p className="text-sm text-gray-600">{selectedMission.location}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <Gift className="w-4 h-4 mr-2" />
                      보상
                    </h4>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-700">{selectedMission.reward}</span>
                        <div className="flex items-center text-yellow-600">
                          <Coins className="w-4 h-4 mr-1" />
                          <span className="font-medium">{selectedMission.coinReward}G</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      완료 팁
                    </h4>
                    <ul className="space-y-2">
                      {selectedMission.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    {selectedMission.completed ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-600 mb-2">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">미션 완료!</span>
                        </div>
                        <p className="text-sm text-gray-600">보상을 받으셨습니다</p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => {
                          alert('미션 인증 기능은 준비 중입니다. 실제 방문 후 인증해주세요!');
                        }}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        미션 인증하기
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>미션을 선택하면</p>
                <p>상세 정보가 표시됩니다</p>
              </div>
            )}
          </Card>

          {/* 진행 통계 카드 */}
          <Card className="p-6 mt-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              진행 통계
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">완료율</span>
                <span className="font-medium">{Math.round(missionCompletionRate)}%</span>
              </div>
              <Progress value={missionCompletionRate} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-bold text-green-600">{completedMissions}</div>
                  <div className="text-xs text-gray-600">완료</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-bold text-gray-600">{totalMissions - completedMissions}</div>
                  <div className="text-xs text-gray-600">남은 미션</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-center">
                  <Coins className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="font-bold text-yellow-700">{totalEarnedCoins}G</span>
                </div>
                <div className="text-xs text-center text-gray-600 mt-1">획득한 코인</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}