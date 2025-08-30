import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Star, Activity, Timer, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

import scienceMuseumMap from 'figma:asset/0736c7e654b93f490a86453beff299f2be7f6909.png';

interface NationalScienceMuseumGuidePageProps {
  onBack: () => void;
}

interface AreaInfo {
  id: number;
  name: string;
  congestion: 'low' | 'medium' | 'high';
  currentVisitors: number;
  maxCapacity: number;
  averageStayTime: number; // 평균 체류시간 (분)
  description: string;
  highlights: string[];
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'exhibition' | 'performance' | 'education' | 'experience';
  location: string;
  status: 'ongoing' | 'upcoming' | 'registration';
}

export default function NationalScienceMuseumGuidePage({ onBack }: NationalScienceMuseumGuidePageProps) {
  const [selectedArea, setSelectedArea] = useState<AreaInfo | null>(null);

  // 고정된 마커 위치 (393x852 기준)
  const baseMarkerPositions: { [key: number]: { x: number; y: number } } = {
    1: { x: 50, y: 30 },  // 천체관
    2: { x: 40, y: 30 },  // 자연사관
    3: { x: 40, y: 40 },  // 인류관
    4: { x: 15, y: 55 },  // 어린이과학관
    5: { x: 40, y: 55 },  // 창의나래관
    6: { x: 75, y: 55 }   // 생물탐구관
  };

  // 전체 박물관 정보
  const totalMuseumInfo = {
    totalVisitors: 1247,
    totalCapacity: 2500,
    averageStayTime: 180, // 3시간
    estimatedWaitTime: 15, // 15분
    congestion: 'medium' as const
  };

  // 구역별 정보 (전체 평균이 첫 번째)
  const areas: AreaInfo[] = [
    {
      id: 0,
      name: '국립중앙과학관 전체',
      congestion: totalMuseumInfo.congestion,
      currentVisitors: totalMuseumInfo.totalVisitors,
      maxCapacity: totalMuseumInfo.totalCapacity,
      averageStayTime: totalMuseumInfo.averageStayTime,
      description: '전체 관람 구역 평균 정보',
      highlights: ['전 구역 통합 정보', '평균 대기시간', '전체 혼잡도']
    },
    {
      id: 1,
      name: '천체관',
      congestion: 'high',
      currentVisitors: 180,
      maxCapacity: 200,
      averageStayTime: 45,
      description: '플라네타리움과 천체 관측 장비 전시',
      highlights: ['플라네타리움', '망원경 체험', '별자리 학습']
    },
    {
      id: 2,
      name: '자연사관',
      congestion: 'medium',
      currentVisitors: 320,
      maxCapacity: 500,
      averageStayTime: 60,
      description: '지구 역사와 생물 진화 과정 전시',
      highlights: ['공룡 화석', '광물 전시', '생물 진화']
    },
    {
      id: 3,
      name: '인류관',
      congestion: 'low',
      currentVisitors: 145,
      maxCapacity: 400,
      averageStayTime: 50,
      description: '인류 문명과 기술 발전사 전시',
      highlights: ['발명품 전시', '기술 역사', '인류 진화']
    },
    {
      id: 4,
      name: '어린이과학관',
      congestion: 'high',
      currentVisitors: 280,
      maxCapacity: 350,
      averageStayTime: 90,
      description: '어린이를 위한 체험형 과학 전시',
      highlights: ['체험 놀이', '과학 실험', '교육 프로그램']
    },
    {
      id: 5,
      name: '창의나래관',
      congestion: 'medium',
      currentVisitors: 220,
      maxCapacity: 400,
      averageStayTime: 70,
      description: '창의적 사고와 상상력을 키우는 체험 공간',
      highlights: ['창의 체험', '상상력 개발', '미래 기술']
    },
    {
      id: 6,
      name: '생물탐구관',
      congestion: 'medium',
      currentVisitors: 102,
      maxCapacity: 200,
      averageStayTime: 40,
      description: '생명과학과 생물 다양성을 탐구하는 전시관',
      highlights: ['생명과학', '생물 다양성', '생태계 탐구']
    }
  ];

  // 실제 구역들 (전체 정보는 제외)
  const actualAreas = areas.slice(1);

  // 현재 진행 중인 행사
  const currentEvents: Event[] = [
    {
      id: 1,
      title: '겨울 별자리 관측회',
      date: '2025-01-25',
      time: '19:00 - 21:00',
      description: '겨울 밤하늘의 아름다운 별자리를 관측해보세요. 전문 강사와 함께하는 천체 관측 프로그램입니다.',
      type: 'education',
      location: '천체관',
      status: 'registration'
    },
    {
      id: 2,
      title: 'AI와 로봇 기술 특별전',
      date: '2025-01-20 ~ 2025-02-28',
      time: '09:30 - 17:30',
      description: 'AI와 로봇 기술을 직접 체험할 수 있는 특별전시입니다. 최신 기술 동향을 확인하세요.',
      type: 'exhibition',
      location: '생물탐구관',
      status: 'ongoing'
    },
    {
      id: 3,
      title: '어린이 과학교실',
      date: '매주 토요일',
      time: '10:00, 14:00, 16:00',
      description: '어린이들을 위한 재미있는 과학 실험 교실입니다. 직접 실험하며 과학 원리를 배워보세요.',
      type: 'education',
      location: '어린이과학관',
      status: 'ongoing'
    },
    {
      id: 4,
      title: '화학 실험 체험',
      date: '평일 매일',
      time: '11:00, 15:00',
      description: '안전한 화학 실험을 통해 화학의 원리를 이해할 수 있는 체험 프로그램입니다.',
      type: 'experience',
      location: '창의나래관',
      status: 'ongoing'
    },
    {
      id: 5,
      title: '공룡 화석 발굴 체험',
      date: '주말 한정',
      time: '13:00 - 15:00',
      description: '모래 속에서 공룡 화석을 찾아보는 발굴 체험 활동입니다.',
      type: 'experience',
      location: '자연사관',
      status: 'upcoming'
    }
  ];

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCongestionText = (level: string) => {
    switch (level) {
      case 'high': return '혼잡';
      case 'medium': return '보통';
      case 'low': return '여유';
      default: return '정보없음';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exhibition': return '🎨';
      case 'performance': return '🎭';
      case 'education': return '📚';
      case 'experience': return '🔬';
      default: return '📅';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'exhibition': return '전시';
      case 'performance': return '공연';
      case 'education': return '교육';
      case 'experience': return '체험';
      default: return '행사';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge className="bg-green-500 text-white">진행중</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white">예정</Badge>;
      case 'registration':
        return <Badge className="bg-orange-500 text-white">접수중</Badge>;
      default:
        return <Badge variant="outline">일반</Badge>;
    }
  };

  const formatStayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}시간 ${mins}분`;
    } else if (hours > 0) {
      return `${hours}시간`;
    } else {
      return `${mins}분`;
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 5) return '대기없음';
    return `약 ${minutes}분`;
  };

  // 선택된 구역별 행사 필터링
  const getEventsForArea = (area: AreaInfo | null) => {
    if (!area || area.id === 0) {
      // 전체 선택 시 모든 행사 반환
      return currentEvents;
    }
    // 특정 구역 선택 시 해당 구역의 행사만 반환
    return currentEvents.filter(event => event.location === area.name);
  };

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <h1 className="font-gmarket-bold text-3xl mb-2">국립중앙과학관 관람안내</h1>
        <p className="text-gray-600">실시간 혼잡도와 구역별 정보를 확인하세요</p>
      </motion.div>

      {/* 혼잡도 맵 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 지도 영역 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-96 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center font-gmarket-medium">
                <MapPin className="w-5 h-5 mr-2" />
                국립중앙과학관 혼잡도 맵
              </h3>
            </div>
            <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
              <img 
                src={scienceMuseumMap}
                alt="국립중앙과학관 안내도"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* 구역 위치 마커들 - 고정 위치 */}
            {actualAreas.map((area, index) => {
              const position = baseMarkerPositions[area.id];
              if (!position) return null;
              
              return (
                <motion.div
                  key={area.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`absolute w-8 h-8 rounded-full cursor-pointer ${getCongestionColor(area.congestion)} border-3 border-white shadow-lg hover:scale-125 transition-transform z-10 flex items-center justify-center select-none`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArea(area);
                  }}
                  whileHover={{
                    scale: 1.15,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-white text-sm font-bold pointer-events-none drop-shadow-sm font-gmarket-bold">{area.id}</span>
                </motion.div>
              );
            })}
          </Card>
        </motion.div>

        {/* 간단한 맵 안내 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <h3 className="flex items-center mb-4 font-gmarket-medium">
              <Users className="w-5 h-5 mr-2" />
              구역 선택 안내
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                지도의 번호를 클릭하면 해당 구역의 상세 정보와 진행 중인 행사를 확인할 수 있습니다.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>여유</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>보통</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>혼잡</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 구역별 실시간 혼잡도 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="p-4">
            <h3 className="flex items-center mb-4 font-gmarket-medium">
              <Activity className="w-5 h-5 mr-2" />
              구역별 실시간 혼잡도
            </h3>
            <div className="space-y-3">
              {areas.map((area, index) => (
                <div
                  key={area.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedArea?.id === area.id 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } ${index === 0 ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => setSelectedArea(area)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm break-keep ${index === 0 ? 'font-gmarket-bold text-blue-700' : 'font-gmarket-medium'}`}>
                      {area.name}
                    </h4>
                    <Badge className={`text-white text-xs ${getCongestionColor(area.congestion)}`}>
                      {getCongestionText(area.congestion)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {area.currentVisitors}/{area.maxCapacity}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatStayTime(area.averageStayTime)}
                    </div>
                  </div>

                  {/* 전체 평균의 경우 예상 대기시간도 표시 */}
                  {index === 0 && (
                    <div className="flex items-center text-xs text-blue-600 mb-2">
                      <Timer className="w-3 h-3 mr-1" />
                      예상 대기시간: {formatWaitTime(totalMuseumInfo.estimatedWaitTime)}
                    </div>
                  )}
                  
                  <Progress 
                    value={(area.currentVisitors / area.maxCapacity) * 100} 
                    className="h-1"
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 선택된 구역 상세 정보 또는 전체 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedArea && selectedArea.id !== 0 ? (
            <>
              {/* 선택된 구역 상세 정보 (전체가 아닌 특정 구역만) */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-gmarket-bold break-keep">{selectedArea.name}</h2>
                  <div className="text-right">
                    <Badge className={`text-white ${getCongestionColor(selectedArea.congestion)} mb-2`}>
                      {getCongestionText(selectedArea.congestion)}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      현재 {selectedArea.currentVisitors}명 관람 중
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 break-keep">{selectedArea.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">평균 체류시간: {formatStayTime(selectedArea.averageStayTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">최대 수용인원: {selectedArea.maxCapacity}명</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedArea.id === 0 && (
                      <div className="flex items-center">
                        <Timer className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm text-blue-600">예상 대기시간: {formatWaitTime(totalMuseumInfo.estimatedWaitTime)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">현재 혼잡도: {getCongestionText(selectedArea.congestion)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    {selectedArea.id === 0 ? '전체 주요 특징' : '주요 전시물'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArea.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">혼잡도 현황</h4>
                  <Progress 
                    value={(selectedArea.currentVisitors / selectedArea.maxCapacity) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>여유</span>
                    <span>혼잡</span>
                  </div>
                </div>
              </Card>

              {/* 선택된 구역의 진행 행사 (전체가 아닌 특정 구역만) */}
              {selectedArea.id !== 0 && getEventsForArea(selectedArea).length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {selectedArea.name} 진행 행사
                  </h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {getEventsForArea(selectedArea).map(event => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{getEventTypeIcon(event.type)}</span>
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.location}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col items-end">
                            {getStatusBadge(event.status)}
                            <Badge variant="outline">
                              {getEventTypeText(event.type)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2 ml-11">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {event.time}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 ml-11">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <>
              {/* 전체 박물관 안내 */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  국립중앙과학관 전체 현황
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalMuseumInfo.totalVisitors}</div>
                    <div className="text-sm text-gray-600">현재 관람객</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatStayTime(totalMuseumInfo.averageStayTime)}</div>
                    <div className="text-sm text-gray-600">평균 체류시간</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formatWaitTime(totalMuseumInfo.estimatedWaitTime)}</div>
                    <div className="text-sm text-gray-600">예상 대기시간</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className={`text-2xl font-bold ${
                      totalMuseumInfo.congestion === 'high' ? 'text-red-600' :
                      totalMuseumInfo.congestion === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getCongestionText(totalMuseumInfo.congestion)}
                    </div>
                    <div className="text-sm text-gray-600">전체 혼잡도</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">운영 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>운영시간: 09:30 - 17:30</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>대전광역시 유성구 대덕대로 481</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">전체 수용 현황</h4>
                  <Progress 
                    value={(totalMuseumInfo.totalVisitors / totalMuseumInfo.totalCapacity) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>여유</span>
                    <span>혼잡</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* 전체 진행 중인 행사 (전체 선택 또는 아무것도 선택 안했을 때) */}
          {(!selectedArea || selectedArea.id === 0) && (
            <Card className="p-6">
              <h3 className="mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                국립중앙과학관 전체 진행 행사
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {currentEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getEventTypeIcon(event.type)}</span>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col items-end">
                        {getStatusBadge(event.status)}
                        <Badge variant="outline">
                          {getEventTypeText(event.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 ml-11">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-11">{event.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}