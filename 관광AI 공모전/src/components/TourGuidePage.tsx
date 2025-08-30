import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Star, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TourGuidePageProps {
  onBack: () => void;
}

interface TouristSpot {
  id: number;
  name: string;
  category: string;
  congestion: 'low' | 'medium' | 'high';
  currentVisitors: number;
  maxCapacity: number;
  weather: string;
  averageStayTime: number; // 평균 체류시간 (분)
  events: Event[];
  highlights: string[];
  operatingHours: string;
  location: string;
  hasGusukTour?: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'exhibition' | 'performance' | 'festival' | 'education';
  location: string;
  category: string;
}

export default function TourGuidePage({ onBack }: TourGuidePageProps) {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCategoryFilters, setShowCategoryFilters] = useState<boolean>(false);

  const touristSpots: TouristSpot[] = [
    {
      id: 1,
      name: '국립중앙과학관',
      category: '박물관/과학관',
      congestion: 'medium',
      currentVisitors: 450,
      maxCapacity: 800,
      weather: '맑음',
      averageStayTime: 180, // 3시간
      operatingHours: '09:30 - 17:30',
      location: '대전광역시 유성구 대덕대로 481',
      highlights: ['천체관', '자연사관', '인류관', '어린이과학관'],
      hasGusukTour: true,
      events: [
        {
          id: 1,
          title: '겨울 별자리 관측회',
          date: '2025-01-25',
          time: '19:00 - 21:00',
          description: '겨울 밤하늘의 아름다운 별자리를 관측해보세요',
          type: 'education',
          location: '국립중앙과학관',
          category: 'education'
        },
        {
          id: 2,
          title: '과학체험 특별전',
          date: '2025-01-20 ~ 2025-02-28',
          time: '09:30 - 17:30',
          description: 'AI와 로봇 기술을 직접 체험할 수 있는 특별전시',
          type: 'exhibition',
          location: '국립중앙과학관',
          category: 'exhibition'
        }
      ]
    },
    {
      id: 4,
      name: '대전중앙시장',
      category: '전통시장',
      congestion: 'medium',
      currentVisitors: 320,
      maxCapacity: 600,
      weather: '맑음',
      averageStayTime: 90, // 1.5시간
      operatingHours: '08:00 - 20:00',
      location: '대전광역시 동구 중앙로 148',
      highlights: ['전통음식', '수제반찬', '생선회', '떡집'],
      events: [
        {
          id: 6,
          title: '전통음식 축제',
          date: '2025-01-26 ~ 2025-01-28',
          time: '10:00 - 18:00',
          description: '대전 지역 전통음식을 맛볼 수 있는 축제',
          type: 'festival',
          location: '대전중앙시장',
          category: 'festival'
        }
      ]
    },
    {
      id: 5,
      name: '빵지순례',
      category: '맛집 투어',
      congestion: 'high',
      currentVisitors: 890,
      maxCapacity: 1200,
      weather: '맑음',
      averageStayTime: 150, // 2.5시간
      operatingHours: '07:00 - 22:00',
      location: '대전 전 지역 (성심당 본점 중심)',
      highlights: ['성심당 튀김소보로', '대전 앙버터', '노브랜드 버거', '기타 유명 빵집'],
      events: [
        {
          id: 11,
          title: '성심당 빵만���기 체험',
          date: '매주 토요일',
          time: '10:00 - 12:00, 14:00 - 16:00',
          description: '성심당의 시그니��� 빵을 직접 만들어보는 체험 프로그램',
          type: 'experience',
          location: '빵지순례',
          category: 'experience'
        },
        {
          id: 12,
          title: '대전 빵집 스탬프 투어',
          date: '2025-01-20 ~ 2025-02-29',
          time: '전일 운영시간',
          description: '대전 유명 빵집 10곳을 방문하여 스탬프를 모으는 이벤트',
          type: 'festival',
          location: '빵지순례',
          category: 'festival'
        }
      ]
    },
    {
      id: 8,
      name: '스카이로드',
      category: '관람/전망',
      congestion: 'low',
      currentVisitors: 180,
      maxCapacity: 400,
      weather: '맑음',
      averageStayTime: 60, // 1시간
      operatingHours: '09:00 - 22:00',
      location: '대전광역시 중구 보문산공원 일대',
      highlights: ['스카이워크', '대전시내 전망', '야경명소', '산책로'],
      events: [
        {
          id: 19,
          title: '스카이로드 야경 투어',
          date: '매주 금-토',
          time: '19:00 - 21:00',
          description: '대전 시내 야경을 감상하는 특별 투어',
          type: 'experience',
          location: '스카이로드',
          category: 'experience'
        },
        {
          id: 20,
          title: '보문산 일출 페스티벌',
          date: '2025-02-01 ~ 2025-02-03',
          time: '06:00 - 08:00',
          description: '새해 첫 일출을 함께 맞이하는 특별 행사',
          type: 'festival',
          location: '스카이로드',
          category: 'festival'
        }
      ]
    },
    {
      id: 3,
      name: '엑스포 과학공원',
      category: '테마파크',
      congestion: 'high',
      currentVisitors: 1200,
      maxCapacity: 1500,
      weather: '맑음',
      averageStayTime: 240, // 4시간
      operatingHours: '09:30 - 17:30',
      location: '대전광역시 유성구 대덕대로 480',
      highlights: ['한빛탑', '엑스포홀', '과학공원', '꿈돌이 랜드'],
      events: [
        {
          id: 4,
          title: '겨울 빛축제',
          date: '2025-01-15 ~ 2025-02-15',
          time: '18:00 - 22:00',
          description: '화려한 LED 조명으로 꾸며진 겨울 축제',
          type: 'festival',
          location: '엑스포 과학공원',
          category: 'festival'
        },
        {
          id: 5,
          title: '과학 매직쇼',
          date: '2025-01-21',
          time: '11:00, 14:00, 16:00',
          description: '과학 원리를 이용한 재미있는 매직쇼',
          type: 'performance',
          location: '엑스포 과학공원',
          category: 'performance'
        }
      ]
    },
    {
      id: 7,
      name: '오월드',
      category: '테마파크',
      congestion: 'high',
      currentVisitors: 1250,
      maxCapacity: 1500,
      weather: '맑음',
      averageStayTime: 240, // 4시간
      operatingHours: '09:30 - 18:00',
      location: '대전광역시 중구 사정동 395',
      highlights: ['롤러코스터', '동물원', '플라워랜드', '놀이기구'],
      events: [
        {
          id: 17,
          title: '오월드 겨울축제',
          date: '2025-01-20 ~ 2025-02-28',
          time: '09:30 - 18:00',
          description: '겨울 특별 이벤트와 동물들의 겨울나기 체험',
          type: 'festival',
          location: '오월드',
          category: 'festival'
        },
        {
          id: 18,
          title: '동물먹이주기 체험',
          date: '매일',
          time: '11:00, 14:00, 16:00',
          description: '다양한 동물들에게 직접 먹이를 주는 체험',
          type: 'experience',
          location: '오월드',
          category: 'experience'
        }
      ]
    },
    {
      id: 6,
      name: '유성온천',
      category: '온천/휴양',
      congestion: 'medium',
      currentVisitors: 450,
      maxCapacity: 800,
      weather: '맑음',
      averageStayTime: 180, // 3시간
      operatingHours: '06:00 - 24:00',
      location: '대전광역시 유성구 온천로 일대',
      highlights: ['천연온천', '스파시설', '족욕체험', '온천마을'],
      events: [
        {
          id: 15,
          title: '유성온천 힐링 페스티벌',
          date: '2025-02-15 ~ 2025-02-17',
          time: '10:00 - 21:00',
          description: '온천과 함께 즐기는 힐링 음악회와 웰니스 체험',
          type: 'festival',
          location: '유성온천',
          category: 'festival'
        },
        {
          id: 16,
          title: '족욕 명상 프로그램',
          date: '매주 일요일',
          time: '14:00 - 15:30',
          description: '족욕과 함께 하는 힐링 명상 체험',
          type: 'experience',
          location: '유성온천',
          category: 'experience'
        }
      ]
    },
    {
      id: 2,
      name: '한밭수목원',
      category: '공원/수목원',
      congestion: 'low',
      currentVisitors: 180,
      maxCapacity: 500,
      weather: '맑음',
      averageStayTime: 120, // 2시간
      operatingHours: '05:00 - 22:00',
      location: '대전광역시 서구 둔산대로 169',
      highlights: ['동원', '서원', '열대식물원', '약용식물원'],
      events: [
        {
          id: 3,
          title: '겨울 식물 생태 교육',
          date: '2025-01-22',
          time: '14:00 - 16:00',
          description: '겨울철 식물들의 생존 전략을 배워보세요',
          type: 'education',
          location: '한밭수목원',
          category: 'education'
        }
      ]
    }
  ];

  // 추가 대전 행사들
  const additionalEvents: Event[] = [
    {
      id: 7,
      title: '대전 문화예술의 전당 신년음악회',
      date: '2025-01-30',
      time: '19:30 - 21:30',
      description: '클래식과 국악이 어우러진 특별한 신년음악회',
      type: 'performance',
      location: '대전 문화예술의 전당',
      category: 'performance'
    },
    {
      id: 8,
      title: '대전시립미술관 현대미술전',
      date: '2025-01-15 ~ 2025-03-15',
      time: '10:00 - 18:00',
      description: '한국 현대미술의 흐름을 한눈에 보는 기획전',
      type: 'exhibition',
      location: '대전시립미술관',
      category: 'exhibition'
    },
    {
      id: 9,
      title: '유성온천 축제',
      date: '2025-02-01 ~ 2025-02-03',
      time: '10:00 - 22:00',
      description: '온천과 함께하는 겨울 힐링 축제',
      type: 'festival',
      location: '유성온천',
      category: 'festival'
    },
    {
      id: 10,
      title: '대전 과학축전',
      date: '2025-02-10 ~ 2025-02-12',
      time: '09:00 - 18:00',
      description: '과학기술도시 대전의 과학축전',
      type: 'education',
      location: '대전컨벤션센터',
      category: 'education'
    },
    {
      id: 13,
      title: '대전 베이커리 페스티벌',
      date: '2025-02-05 ~ 2025-02-07',
      time: '10:00 - 19:00',
      description: '대전의 유명 빵집들이 한자리에 모이는 베이커리 축제',
      type: 'festival',
      location: '대전엑스포시민광장',
      category: 'festival'
    },
    {
      id: 14,
      title: '성심당 역사 전시회',
      date: '2025-01-25 ~ 2025-03-25',
      time: '09:00 - 18:00',
      description: '대전 대표 빵집 성심당의 70년 역사를 돌아보는 전시',
      type: 'exhibition',
      location: '대전시립박물관',
      category: 'exhibition'
    },
    {
      id: 21,
      title: '대전 온천문화 축제',
      date: '2025-03-15 ~ 2025-03-17',
      time: '10:00 - 20:00',
      description: '유성온천을 중심으로 한 온천문화와 건강 라이프스타일 축제',
      type: 'festival',
      location: '유성온천 일대',
      category: 'festival'
    },
    {
      id: 22,
      title: '오월드 동물교육 프로그램',
      date: '2025-02-10 ~ 2025-02-14',
      time: '10:00 - 16:00',
      description: '어린이를 위한 동물 생태 교육과 체험 프로그램',
      type: 'education',
      location: '오월드',
      category: 'education'
    },
    {
      id: 23,
      title: '보문산 등반 대회',
      date: '2025-02-22',
      time: '08:00 - 12:00',
      description: '스카이로드를 포함한 보문산 등반 대회',
      type: 'sport',
      location: '보문산공원 (스카이로드)',
      category: 'sport'
    }
  ];

  // 전체 행사 목록 (관광지 행사 + 추가 행사)
  const allEvents = [
    ...touristSpots.flatMap(spot => spot.events),
    ...additionalEvents
  ];

  // 필터링된 관광지
  const filteredTouristSpots = touristSpots.filter(spot => {
    return categoryFilter === 'all' || spot.category === categoryFilter;
  });

  // 고유 카테고리 목록 추출
  const uniqueCategories = Array.from(new Set(touristSpots.map(spot => spot.category)));

  // 필터링된 행사
  const filteredEvents = allEvents.filter(event => {
    const matchesType = eventFilter === 'all' || event.category === eventFilter;
    const matchesTime = timeFilter === 'all' || 
      (timeFilter === 'morning' && (event.time.includes('09:') || event.time.includes('10:') || event.time.includes('11:'))) ||
      (timeFilter === 'afternoon' && (event.time.includes('14:') || event.time.includes('15:') || event.time.includes('16:'))) ||
      (timeFilter === 'evening' && (event.time.includes('18:') || event.time.includes('19:') || event.time.includes('20:')));
    
    return matchesType && matchesTime;
  });

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
      case 'festival': return '🎉';
      case 'education': return '📚';
      default: return '📅';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'exhibition': return '전시';
      case 'performance': return '공연';
      case 'festival': return '축제';
      case 'education': return '교육';
      default: return '행사';
    }
  };

  const getFilterText = (filter: string, type: 'event' | 'time') => {
    if (type === 'event') {
      switch (filter) {
        case 'exhibition': return '전시';
        case 'performance': return '공연';
        case 'festival': return '축제';
        case 'education': return '교육';
        case 'all': return '전체';
        default: return '전체';
      }
    } else {
      switch (filter) {
        case 'morning': return '오전';
        case 'afternoon': return '오후';
        case 'evening': return '저녁';
        case 'all': return '전체';
        default: return '전체';
      }
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

  const handleGusukTour = () => {
    // App.tsx의 라우팅을 통해 main 페이지로 이동
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'main' }));
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
        <h1 className="font-gmarket-bold text-3xl mb-2">대전 관광 안내</h1>
        <p className="text-gray-600">실시간 혼잡도와 진행 중인 행사를 확인하세요</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 관광지 목록 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="p-4 relative">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  주요 관광지
                </h3>
                {selectedSpot && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSpot(null)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    선택해제
                  </Button>
                )}
              </div>
              
              {/* 카테고리 필터 */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                  className="flex items-center gap-2 text-xs"
                >
                  <Filter className="w-3 h-3" />
                  카테고리
                  {showCategoryFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
                
                {/* 현재 적용된 필터 표시 */}
                <div className="flex items-center gap-2">
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      {categoryFilter}
                    </Badge>
                  )}
                  {categoryFilter !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryFilter('all')}
                      className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                    >
                      초기화
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 카테고리 필터 선택창 */}
              <AnimatePresence>
                {showCategoryFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 p-3 bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={categoryFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter('all')}
                        className="text-xs"
                      >
                        전체
                      </Button>
                      {uniqueCategories.map(category => (
                        <Button
                          key={category}
                          variant={categoryFilter === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCategoryFilter(category)}
                          className="text-xs"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {filteredTouristSpots.length > 0 ? (
                filteredTouristSpots.map(spot => (
                  <div
                    key={spot.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSpot?.id === spot.id 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedSpot(spot)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{spot.name}</h4>
                      <Badge className={`text-white text-xs ${getCongestionColor(spot.congestion)}`}>
                        {getCongestionText(spot.congestion)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{spot.category}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {spot.currentVisitors}/{spot.maxCapacity}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        평균 {formatStayTime(spot.averageStayTime)}
                      </div>
                    </div>
                    <Progress 
                      value={(spot.currentVisitors / spot.maxCapacity) * 100} 
                      className="h-1"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">해당 카테고리의 관광지가 없습니다</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* 선택된 관광지 상세 정보 또는 전체 행사 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedSpot ? (
            <>
              {/* 선택된 관광지 상세 정보 */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl">{selectedSpot.name}</h2>
                    {selectedSpot.hasGusukTour && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleGusukTour}
                      >
                        트리퍼
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className={`text-white ${getCongestionColor(selectedSpot.congestion)} mb-2`}>
                      {getCongestionText(selectedSpot.congestion)}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      현재 {selectedSpot.currentVisitors}명 방문 중
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{selectedSpot.category}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">운영시간: {selectedSpot.operatingHours}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">{selectedSpot.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">평균 체류시간: {formatStayTime(selectedSpot.averageStayTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">최대 수용인원: {selectedSpot.maxCapacity}명</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    주요 볼거리
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpot.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">혼잡도 현황</h4>
                  <Progress 
                    value={(selectedSpot.currentVisitors / selectedSpot.maxCapacity) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>여유</span>
                    <span>혼잡</span>
                  </div>
                </div>
              </Card>

              {/* 해당 관광지 진행 중인 행사 */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  진행 중인 행사
                </h3>
                {selectedSpot.events.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedSpot.events.map(event => (
                      <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getEventTypeIcon(event.type)}</span>
                            <h4 className="font-medium">{event.title}</h4>
                          </div>
                          <Badge variant="outline">
                            {getEventTypeText(event.type)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>진행 중인 행사가 없습니다</p>
                  </div>
                )}
              </Card>
            </>
          ) : (
            /* 전체 대전 행사 목록 */
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 mr-2" />
                  대전 전체 진행 중인 행사
                </h3>
                
                {/* 필터 버튼 */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    필터
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {/* 현재 적용된 필터 표시 */}
                  <div className="flex items-center gap-2">
                    {eventFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        분야: {getFilterText(eventFilter, 'event')}
                      </Badge>
                    )}
                    {timeFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        시간: {getFilterText(timeFilter, 'time')}
                      </Badge>
                    )}
                    {(eventFilter !== 'all' || timeFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEventFilter('all');
                          setTimeFilter('all');
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                      >
                        초기화
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* 필터 선택창 */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">분야별</label>
                          <Select value={eventFilter} onValueChange={setEventFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="분야 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">전체</SelectItem>
                              <SelectItem value="exhibition">전시</SelectItem>
                              <SelectItem value="performance">공연</SelectItem>
                              <SelectItem value="festival">축제</SelectItem>
                              <SelectItem value="education">교육</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">시간대별</label>
                          <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="시간대 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">전체</SelectItem>
                              <SelectItem value="morning">오전 (09:00-11:59)</SelectItem>
                              <SelectItem value="afternoon">오후 (14:00-17:59)</SelectItem>
                              <SelectItem value="evening">저녁 (18:00-22:00)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getEventTypeIcon(event.type)}</span>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {getEventTypeText(event.type)}
                      </Badge>
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
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>조건에 맞는 행사가 없습니다</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}