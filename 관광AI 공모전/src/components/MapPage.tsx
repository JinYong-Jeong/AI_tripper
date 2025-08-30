import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Users, Clock, Phone, Star, ChefHat, Filter, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import scienceMuseumMap from 'figma:asset/0736c7e654b93f490a86453beff299f2be7f6909.png';

interface MapPageProps {
  onBack: () => void;
  onGusukTour: () => void;
}

interface ZoneInfo {
  id: number;
  name: string;
  category: string;
  congestion: 'low' | 'medium' | 'high';
  hours: string;
  description: string;
  highlights: string[];
  currentVisitors: number;
  maxCapacity: number;
}

const scienceZones: ZoneInfo[] = [
  {
    id: 1,
    name: '자연사관',
    category: '상설전시',
    congestion: 'medium',
    hours: '09:30 - 17:30',
    description: '지구의 역사와 생명체의 진화 과정을 살펴볼 수 있습니다.',
    highlights: ['공룡 화석', '암석 표본', '진화의 역사'],
    currentVisitors: 45,
    maxCapacity: 80
  },
  {
    id: 2,
    name: '인류관',
    category: '상설전시',
    congestion: 'high',
    hours: '09:30 - 17:30',
    description: '인류의 발전��� 문명의 발달 과정을 체험할 수 있습니다.',
    highlights: ['문명의 발달', '기술 발전사', '인류 진화'],
    currentVisitors: 72,
    maxCapacity: 80
  },
  {
    id: 3,
    name: '과학기술관',
    category: '상설전시',
    congestion: 'low',
    hours: '09:30 - 17:30',
    description: '최신 과학기술과 미래 기술을 체험해보세요.',
    highlights: ['로봇 체험', 'VR 기술', '인공지능'],
    currentVisitors: 28,
    maxCapacity: 60
  },
  {
    id: 4,
    name: '어린이과학관',
    category: '어린이관',
    congestion: 'high',
    hours: '09:30 - 17:30',
    description: '어린이들이 과학을 재미있게 배울 수 있는 체험형 전시관입니다.',
    highlights: ['체험형 학습', '과학 놀이', '창의력 개발'],
    currentVisitors: 95,
    maxCapacity: 100
  },
  {
    id: 5,
    name: '천체관',
    category: '특별전시',
    congestion: 'medium',
    hours: '09:30 - 17:30',
    description: '우주와 천체에 대해 알아보고 플라네타리움을 관람할 수 있습니다.',
    highlights: ['플라네타리움', '태양계 모형', '천체 망원경'],
    currentVisitors: 38,
    maxCapacity: 70
  },
  {
    id: 6,
    name: '생물탐구관',
    category: '상설전시',
    congestion: 'low',
    hours: '09:30 - 17:30',
    description: '다양한 생물들의 생태와 환경에 대해 학습할 수 있습니다.',
    highlights: ['생태계 모형', '해양생물', '식물원'],
    currentVisitors: 22,
    maxCapacity: 50
  }
];

const categories = ['전체', '상설전시', '특별전시', '어린이관'];

export default function MapPage({ onBack, onGusukTour }: MapPageProps) {
  const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [congestionFilter, setCongestionFilter] = useState('전체');

  const filteredZones = scienceZones.filter(zone => {
    const categoryMatch = selectedCategory === '전체' || zone.category === selectedCategory;
    const congestionMatch = congestionFilter === '전체' || zone.congestion === congestionFilter;
    return categoryMatch && congestionMatch;
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

  const clearFilters = () => {
    setSelectedCategory('전체');
    setCongestionFilter('전체');
  };

  return (
    <div className="min-h-screen p-4 relative">
      {/* 트레버 in 대전으로 돌아가기 버튼 */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          onClick={onGusukTour}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          트레버 in 대전
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 pt-16"
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <h1 className="text-3xl font-bold mb-2">국립중앙과학관 안내</h1>
        <p className="text-gray-600">실시간 혼잡도와 전시관 정보를 확인하세요</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 영역 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-96 relative overflow-hidden">
            <h3 className="mb-4">국립중앙과학관 안내도</h3>
            <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
              <img 
                src={scienceMuseumMap}
                alt="국립중앙과학관 안내도"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* 구역 위치 마커들 */}
            {filteredZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`absolute w-6 h-6 rounded-full cursor-pointer ${getCongestionColor(zone.congestion)} border-2 border-white shadow-lg hover:scale-150 transition-transform z-10 flex items-center justify-center`}
                style={{
                  left: `${15 + (index % 3) * 25}%`,
                  top: `${30 + Math.floor(index / 3) * 25}%`
                }}
                onClick={() => setSelectedZone(zone)}
              >
                <span className="text-white text-xs font-bold">{zone.id}</span>
              </motion.div>
            ))}
          </Card>
        </motion.div>

        {/* 구역 정보 패널 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pb-24"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                구역별 실시간 혼잡도
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">필터 설정</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">카테고리</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">혼잡도</label>
                    <Select value={congestionFilter} onValueChange={setCongestionFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="전체">전체</SelectItem>
                        <SelectItem value="low">여유</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="high">혼잡</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">
                    {filteredZones.length}개 구역
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    초기화
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex-1">
                    <span className="text-sm block font-medium">{zone.name}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{zone.category}</span>
                      <span className="text-xs text-gray-500">
                        {zone.currentVisitors}/{zone.maxCapacity}명
                      </span>
                    </div>
                  </div>
                  <Badge className={`text-white ${getCongestionColor(zone.congestion)}`}>
                    {getCongestionText(zone.congestion)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {selectedZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-4">
                <h3 className="mb-3">{selectedZone.name}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedZone.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedZone.hours}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-white ${getCongestionColor(selectedZone.congestion)}`}>
                        {getCongestionText(selectedZone.congestion)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        현재 {selectedZone.currentVisitors}명 / 최대 {selectedZone.maxCapacity}명
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Star className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">주요 전시품</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedZone.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  {selectedZone.description}
                </p>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}