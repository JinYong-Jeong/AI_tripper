import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Circle, Star, Gift, MapPin, Coins, Trophy, Ticket, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface DaejeonStampPageProps {
  onBack: () => void;
  onGusukTour: () => void;
  onNationalView?: () => void;
}

interface DaejeonAttraction {
  id: number;
  name: string;
  icon: string;
  description: string;
  location: string;
  category: string;
  missions: DaejeonMission[];
}

interface DaejeonMission {
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

// 대전 지역 관광지별 미션들
const daejeonAttractions: DaejeonAttraction[] = [
  {
    id: 1,
    name: '국립중앙과학관',
    icon: '🔬',
    description: '과학의 신비를 탐험하는 곳',
    location: '대전 유성구',
    category: '박물관',
    missions: [
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
        reward: '까우니 배낭 아이템',
        coinReward: 180,
        difficulty: 'medium',
        category: '학습'
      }
    ]
  },
  {
    id: 2,
    name: '한밭수목원',
    icon: '🌳',
    description: '도심 속 자연의 오아시스',
    location: '대전 서구',
    category: '자연',
    missions: [
      {
        id: 7,
        title: '동원 산책로 완주',
        description: '한밭수목원 동원의 모든 산책로를 걸어보세요',
        location: '동원 산책로',
        completed: false,
        reward: '식물 도감 아이템',
        coinReward: 80,
        difficulty: 'easy',
        category: '체험'
      },
      {
        id: 8,
        title: '열대식물원 관람',
        description: '열대식물원에서 특별한 식물들을 관찰해보세요',
        location: '열대식물원',
        completed: false,
        reward: '수목원 기념품',
        coinReward: 120,
        difficulty: 'medium',
        category: '관람'
      },
      {
        id: 9,
        title: '약용식물원 학습',
        description: '약용식물원에서 약초에 대해 배워보세요',
        location: '약용식물원',
        completed: false,
        reward: '한방차 체험권',
        coinReward: 100,
        difficulty: 'medium',
        category: '학습'
      }
    ]
  },
  {
    id: 3,
    name: '엑스포 과학공원',
    icon: '🎡',
    description: '미래와 과학이 만나는 공간',
    location: '대전 유성구',
    category: '테마파크',
    missions: [
      {
        id: 10,
        title: '한빛탑 전망대 방문',
        description: '한빛탑 전망대에서 대전 시내를 조망해보세요',
        location: '한빛탑 전망대',
        completed: false,
        reward: '전망대 기념 사진',
        coinReward: 150,
        difficulty: 'easy',
        category: '관람'
      },
      {
        id: 11,
        title: '꿈돌이 랜드 체험',
        description: '꿈돌이 랜드에서 다양한 놀이기구를 체험하세요',
        location: '꿈돌이 랜드',
        completed: false,
        reward: '놀이공원 1회권',
        coinReward: 200,
        difficulty: 'medium',
        category: '체험'
      },
      {
        id: 12,
        title: '과학관 특별전 관람',
        description: '엑스포 과학관의 특별전시를 관람하세요',
        location: '엑스포 과학관',
        completed: false,
        reward: '과학 실험 키트',
        coinReward: 250,
        difficulty: 'medium',
        category: '학습'
      }
    ]
  },
  {
    id: 4,
    name: '대전중앙시장',
    icon: '🏪',
    description: '전통과 정이 살아있는 시장',
    location: '대전 동구',
    category: '전통시장',
    missions: [
      {
        id: 13,
        title: '전통음식 5가지 맛보기',
        description: '중앙시장의 대표 전통음식 5가지를 맛보세요',
        location: '중앙시장 음식점가',
        completed: false,
        reward: '맛집 지도 아이템',
        coinReward: 180,
        difficulty: 'medium',
        category: '체험'
      },
      {
        id: 14,
        title: '수제반찬 구매 체험',
        description: '시장에서 수제반찬을 구매해보세요',
        location: '반찬가게',
        completed: false,
        reward: '전통시장 쿠폰',
        coinReward: 100,
        difficulty: 'easy',
        category: '체험'
      },
      {
        id: 15,
        title: '상인과 대화하기',
        description: '시장 상인분들과 대화를 나누어보세요',
        location: '중앙시장 전체',
        completed: false,
        reward: '인정 많은 대전 배지',
        coinReward: 120,
        difficulty: 'easy',
        category: '체험'
      }
    ]
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
    case '체험': return '🎮';
    case '학습': return '📚';
    case '관람': return '👀';
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
  if (reward.includes('입장권') || reward.includes('체험권') || reward.includes('1회권')) {
    const match = reward.match(/(\w+)\s*(입장권|체험권|1회권)/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }
  if (reward.includes('아이템')) {
    const match = reward.match(/(\w+)\s*아이템/);
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

export default function DaejeonStampPage({ onBack, onGusukTour, onNationalView }: DaejeonStampPageProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<DaejeonAttraction>(daejeonAttractions[0]);
  const [selectedMission, setSelectedMission] = useState<DaejeonMission | null>(null);

  // 전체 통계 계산
  const allMissions = daejeonAttractions.flatMap(attraction => attraction.missions);
  const completedMissions = allMissions.filter(mission => mission.completed).length;
  const totalMissions = allMissions.length;
  const completionRate = (completedMissions / totalMissions) * 100;
  const totalEarnedCoins = allMissions.filter(m => m.completed).reduce((sum, m) => sum + m.coinReward, 0);

  // 선택된 관광지의 통계
  const attractionCompletedMissions = selectedAttraction.missions.filter(mission => mission.completed).length;
  const attractionTotalMissions = selectedAttraction.missions.length;
  const attractionCompletionRate = (attractionCompletedMissions / attractionTotalMissions) * 100;

  return (
    <div className="min-h-screen p-4 relative">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 pt-4"
      >
        <Button 
          variant="ghost" 
          onClick={onGusukTour}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          트리퍼 in 대전
        </Button>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold mr-4">구석구석 스탬프</h1>
              {onNationalView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNationalView}
                  className="flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  전국스탬프
                </Button>
              )}
            </div>
            <p className="text-gray-600">대전의 명소에서 스탬프를 수집하고 특별한 보상을 받아보세요!</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <Coins className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-xl text-yellow-700">{totalEarnedCoins}G</span>
            </div>
            <div className="text-sm text-gray-600">{completedMissions}/{totalMissions} 완료</div>
          </div>
        </div>
        <Progress value={completionRate} className="mb-6" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 관광지 선택 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="flex items-center mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            대전 관광지
          </h3>
          {daejeonAttractions.map(attraction => {
            const completed = attraction.missions.filter(m => m.completed).length;
            const total = attraction.missions.length;
            const rate = (completed / total) * 100;
            
            return (
              <motion.div
                key={attraction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * attraction.id }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedAttraction.id === attraction.id 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => setSelectedAttraction(attraction)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{attraction.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{attraction.name}</h4>
                      <p className="text-xs text-gray-500">{attraction.category}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{completed}/{total}</span>
                    <span>{Math.round(rate)}%</span>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 선택된 관광지의 미션들 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{selectedAttraction.icon}</span>
                <div>
                  <h3 className="flex items-center">
                    {selectedAttraction.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedAttraction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">완료된 미션</div>
                <div className="font-bold">{attractionCompletedMissions} / {attractionTotalMissions}</div>
              </div>
            </div>
            
            <Progress value={attractionCompletionRate} className="mb-6" />
            
            <div className="space-y-3">
              {selectedAttraction.missions.map((mission, index) => (
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
                        <span className="text-2xl mr-2">{getCategoryIcon(mission.category)}</span>
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
                        
                        {mission.completed && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ 완료됨
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 선택된 미션 상세 정보 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 pb-24"
        >
          {selectedMission ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center">
                    <span className="text-2xl mr-2">{getCategoryIcon(selectedMission.category)}</span>
                    {selectedMission.title}
                  </h3>
                  {selectedMission.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedMission.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-gray-500" />
                    <Badge className={`text-white ${getDifficultyColor(selectedMission.difficulty)}`}>
                      {getDifficultyText(selectedMission.difficulty)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Gift className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-blue-600 font-medium">{selectedMission.reward}</span>
                  </div>

                  <div className="flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-yellow-600" />
                    <span className="text-yellow-700 font-medium">{selectedMission.coinReward}G</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">미션 상세 설명</h4>
                  <p className="text-sm text-gray-700">{selectedMission.description}</p>
                </div>
                
                {selectedMission.completed ? (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">미션 완료!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      보상이 지급되었습니다: {selectedMission.reward} + {selectedMission.coinReward}G
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center text-yellow-700">
                      <Circle className="w-5 h-5 mr-2" />
                      <span className="font-medium">미션 진행 중</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      해당 위치에서 미션을 완료해주세요.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ) : (
            <Card className="p-6 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="mb-2">미션을 선택하세요</h3>
              <p className="text-gray-600 text-sm">
                미션을 클릭하면 상세 정보를 확인할 수 있습니다.
              </p>
            </Card>
          )}

          {/* 대전 전체 통계 */}
          <Card className="p-4">
            <h3 className="mb-3 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              대전 전체 현황
            </h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {completedMissions} / {totalMissions}
                </div>
                <div className="text-sm text-gray-600 mb-2">전체 완료율</div>
                <Progress value={completionRate} className="h-3" />
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(completionRate)}% 완료
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium">총 획득 골드:</span>
                  <div className="flex items-center">
                    <Coins className="w-5 h-5 mr-1 text-yellow-600" />
                    <span className="text-lg font-bold text-yellow-700">{totalEarnedCoins}G</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {daejeonAttractions.map(attraction => {
                  const completed = attraction.missions.filter(m => m.completed).length;
                  const total = attraction.missions.length;
                  const rate = total > 0 ? (completed / total) * 100 : 0;
                  
                  return (
                    <div key={attraction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="flex items-center">
                        <span className="text-lg mr-2">{attraction.icon}</span>
                        {attraction.name}
                      </span>
                      <span className="font-medium">{completed}/{total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}