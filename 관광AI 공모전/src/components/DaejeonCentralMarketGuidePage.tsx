import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Star, Activity, Timer, AlertCircle, ShoppingBag, Filter, Search, Phone, DollarSign, MessageCircle, X, Send, Bot } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

import centralMarketMapImage from 'figma:asset/723266498f34fc3db953145495030e684de9e782.png';

interface DaejeonCentralMarketGuidePageProps {
  onBack: () => void;
  onCongestionAlert?: () => void;
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
  type: 'sale' | 'festival' | 'food' | 'culture';
  location: string;
  status: 'ongoing';
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Store {
  id: number;
  name: string;
  category: 'food' | 'fashion' | 'electronics' | 'living' | 'beauty' | 'vintage' | 'grocery';
  area: string;
  rating: number;
  priceRange: '₩' | '₩₩' | '₩₩₩';
  phone?: string;
  description: string;
  specialties: string[];
  operatingHours: string;
  averagePrice?: string;
  reviews: Review[];
}

export default function DaejeonCentralMarketGuidePage({ onBack, onCongestionAlert }: DaejeonCentralMarketGuidePageProps) {
  const [selectedArea, setSelectedArea] = useState<AreaInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  // 혼잡도 시현 관련 상태
  const [isCongestionMode, setIsCongestionMode] = useState(false);
  
  // 고정된 마커 위치 (393x852 기준)
  const baseMarkerPositions: { [key: number]: { x: number; y: number } } = {
    1: { x: 25, y: 45 },  // 중앙쇼핑타워
    2: { x: 40, y: 40 },  // 원동국제시장
    3: { x: 65, y: 40 },  // 먹자골목
    4: { x: 20, y: 60 },  // 신중앙시장
    5: { x: 40, y: 60 },  // 홈커텐거리
    6: { x: 60, y: 65 }   // 양키시장
  };

  // 기본 시장 정보 (평상시)
  const normalMarketInfo = {
    totalVisitors: 450,
    totalCapacity: 1500,
    averageStayTime: 90, // 1.5시간
    estimatedWaitTime: 3, // 3분
    congestion: 'low' as const
  };

  // 혼잡 모드 시장 정보 (시현용)
  const congestionMarketInfo = {
    totalVisitors: 1350,
    totalCapacity: 1500,
    averageStayTime: 150, // 2.5시간
    estimatedWaitTime: 25, // 25분
    congestion: 'high' as const
  };

  // 현재 시장 정보 (혼잡 모드에 따라 변경)
  const currentMarketInfo = isCongestionMode ? congestionMarketInfo : normalMarketInfo;

  // 기본 구역별 정보 (평상시)
  const normalAreas: AreaInfo[] = [
    {
      id: 0,
      name: '대전중앙시장 전체',
      congestion: normalMarketInfo.congestion,
      currentVisitors: normalMarketInfo.totalVisitors,
      maxCapacity: normalMarketInfo.totalCapacity,
      averageStayTime: normalMarketInfo.averageStayTime,
      description: '전체 시장 구역 평균 정보',
      highlights: ['전 구역 통합 정보', '평균 대기시간', '전체 혼잡도']
    },
    {
      id: 1,
      name: '중앙쇼핑타워',
      congestion: 'medium',
      currentVisitors: 95,
      maxCapacity: 250,
      averageStayTime: 60,
      description: '대전중앙시장의 대표 쇼핑몰로 패션과 생활용품 전문',
      highlights: ['패션 의류', '액세서리', '가방·신발', '화장품']
    },
    {
      id: 2,
      name: '원동국제시장',
      congestion: 'low',
      currentVisitors: 70,
      maxCapacity: 200,
      averageStayTime: 45,
      description: '전통시장과 현대 쇼핑의 조화, 다양한 상품 판매',
      highlights: ['생활용품', '주방용품', '문구류', '전자제품']
    },
    {
      id: 3,
      name: '먹자골목',
      congestion: 'medium',
      currentVisitors: 110,
      maxCapacity: 280,
      averageStayTime: 35,
      description: '대전의 대표 먹거리가 모인 맛의 거리',
      highlights: ['대전 칼국수', '순대국밥', '떡볶이', '튀김']
    },
    {
      id: 4,
      name: '신중앙시장',
      congestion: 'low',
      currentVisitors: 75,
      maxCapacity: 220,
      averageStayTime: 40,
      description: '신선한 농수산물과 전통 식재료 전문 구역',
      highlights: ['신선 채소', '수산물', '정육', '건어물']
    },
    {
      id: 5,
      name: '홈커텐거리',
      congestion: 'low',
      currentVisitors: 45,
      maxCapacity: 150,
      averageStayTime: 30,
      description: '인테리어 소품과 홈데코 전문 거리',
      highlights: ['커튼·블라인드', '홈데코', '침구류', '인테리어소품']
    },
    {
      id: 6,
      name: '양키시장',
      congestion: 'low',
      currentVisitors: 55,
      maxCapacity: 200,
      averageStayTime: 25,
      description: '빈티지와 유니크한 아이템들을 만날 수 있는 특별한 공간',
      highlights: ['빈티지 의류', '액세서리', '소품', '특이템']
    }
  ];

  // 혼잡 모드 구역별 정보 (시현용)
  const congestionAreas: AreaInfo[] = [
    {
      id: 0,
      name: '대전중앙시장 전체',
      congestion: congestionMarketInfo.congestion,
      currentVisitors: congestionMarketInfo.totalVisitors,
      maxCapacity: congestionMarketInfo.totalCapacity,
      averageStayTime: congestionMarketInfo.averageStayTime,
      description: '전체 시장 구역 평균 정보',
      highlights: ['전 구역 통합 정보', '평균 대기시간', '전체 혼잡도']
    },
    {
      id: 1,
      name: '중앙쇼핑타워',
      congestion: 'high',
      currentVisitors: 235,
      maxCapacity: 250,
      averageStayTime: 95,
      description: '대전중앙시장의 대표 쇼핑몰로 패션과 생활용품 전문',
      highlights: ['패션 의류', '액세서리', '가방·신발', '화장품']
    },
    {
      id: 2,
      name: '원동국제시장',
      congestion: 'high',
      currentVisitors: 185,
      maxCapacity: 200,
      averageStayTime: 80,
      description: '전통시장과 현대 쇼핑의 조화, 다양한 상품 판매',
      highlights: ['생활용품', '주방용품', '문구류', '전자제품']
    },
    {
      id: 3,
      name: '먹자골목',
      congestion: 'high',
      currentVisitors: 265,
      maxCapacity: 280,
      averageStayTime: 60,
      description: '대전의 대표 먹거리가 모인 맛의 거리',
      highlights: ['대전 칼국수', '순대국밥', '떡볶이', '튀김']
    },
    {
      id: 4,
      name: '신중앙시장',
      congestion: 'high',
      currentVisitors: 200,
      maxCapacity: 220,
      averageStayTime: 70,
      description: '신선한 농수산물과 전통 식재료 전문 구역',
      highlights: ['신선 채소', '수산물', '정육', '건어물']
    },
    {
      id: 5,
      name: '홈커텐거리',
      congestion: 'medium',
      currentVisitors: 120,
      maxCapacity: 150,
      averageStayTime: 55,
      description: '인테리어 소품과 홈데코 전문 거리',
      highlights: ['커튼·블라인드', '홈데코', '침구류', '인테리어소품']
    },
    {
      id: 6,
      name: '양키시장',
      congestion: 'medium',
      currentVisitors: 145,
      maxCapacity: 200,
      averageStayTime: 45,
      description: '빈티지와 유니크한 아이템들을 만날 수 있는 특별한 공간',
      highlights: ['빈티지 의류', '액세서리', '소품', '특이템']
    }
  ];

  // 현재 구역 정보 (혼잡 모드에 따라 변경)
  const areas = isCongestionMode ? congestionAreas : normalAreas;
  const actualAreas = areas.slice(1);

  // 현재 진행 중인 행사 (진행중인 것만)
  const currentEvents: Event[] = [
    {
      id: 1,
      title: '겨울 대전 먹거리 축제',
      date: '매일 진행',
      time: '10:00 - 18:00',
      description: '대전의 대표 먹거리를 한 곳에서 맛볼 수 있는 겨울 축제입니다. 특별 할인 혜택도 제공됩니다.',
      type: 'festival',
      location: '먹자골목',
      status: 'ongoing'
    },
    {
      id: 2,
      title: '성심당 빵만들기 체험',
      date: '매주 토요일',
      time: '10:00 - 12:00, 14:00 - 16:00',
      description: '성심당의 시그니처 빵을 직접 만들어보는 체험 프로그램입니다. 대전의 대표 베이커리에서 제공하는 특별한 경험을 즐겨보세요.',
      type: 'culture',
      location: '먹자골목',
      status: 'ongoing'
    },
    {
      id: 3,
      title: '빈티지 마켓 특별전',
      date: '매주 토요일',
      time: '14:00 - 18:00',
      description: '독특하고 개성 있는 빈티지 아이템들을 만나볼 수 있는 특별한 시간입니다.',
      type: 'culture',
      location: '양키시장',
      status: 'ongoing'
    },
    {
      id: 4,
      title: '신선식품 할인 데이',
      date: '매주 화, 목요일',
      time: '08:00 - 12:00',
      description: '아침 일찍 방문하면 신선한 농수산물을 더욱 저렴하게 구매할 수 있습니다.',
      type: 'sale',
      location: '신중앙시장',
      status: 'ongoing'
    },
    {
      id: 5,
      title: '대전 빵집 스탬프 투어',
      date: '매주 일요일',
      time: '10:00 - 18:00',
      description: '대전 중앙시장 주변의 유명 빵집들을 돌아다니며 스탬프를 모으는 빵지순례 이벤트입니다. 5개 이상 방문 시 특별 기념품을 드립니다.',
      type: 'festival',
      location: '중앙쇼핑타워',
      status: 'ongoing'
    },
    {
      id: 6,
      title: '중앙시장 먹거리 투어',
      date: '매주 일요일',
      time: '11:00, 15:00',
      description: '먹자골목의 숨은 맛집들을 둘러보는 가이드 투어입니다. 시식 기회도 제공됩니다.',
      type: 'food',
      location: '먹자골목',
      status: 'ongoing'
    }
  ];

  // 매장 데이터 (리뷰 포함)
  const stores: Store[] = [
    // 중앙쇼핑타워 매장들
    {
      id: 1,
      name: '트렌디 패션',
      category: 'fashion',
      area: '중앙쇼핑타워',
      rating: 4.5,
      priceRange: '₩₩',
      phone: '042-123-4567',
      description: '최신 트렌드를 따라가는 여성 의류 전문점',
      specialties: ['여성 의류', '액세서리', '가방'],
      operatingHours: '10:00 - 19:00',
      averagePrice: '3-8만원',
      reviews: [
        {
          id: 1,
          userName: '김수현',
          rating: 5,
          comment: '옷이 정말 예쁘고 가격도 합리적이에요! 사장님도 친절하시고 추천해주신 옷들이 모두 마음에 들었습니다.',
          date: '2024-08-20',
          helpful: 12
        },
        {
          id: 2,
          userName: '이민지',
          rating: 4,
          comment: '트렌디한 옷들이 많아서 좋아요. 다만 사이즈가 조금 작은 편이라 구매 전에 꼭 체크해보세요.',
          date: '2024-08-18',
          helpful: 8
        }
      ]
    },
    {
      id: 2,
      name: '뷰티 플러스',
      category: 'beauty',
      area: '중앙쇼핑타워',
      rating: 4.3,
      priceRange: '₩₩',
      phone: '042-234-5678',
      description: '국내외 브랜드 화장품과 뷰티용품 전문',
      specialties: ['화장품', '스킨케어', '향수'],
      operatingHours: '10:00 - 20:00',
      averagePrice: '2-5만원',
      reviews: [
        {
          id: 3,
          userName: '박지영',
          rating: 4,
          comment: '화장품 종류가 다양하고 가격도 백화점보다 저렴해요. 테스터도 많아서 직접 써볼 수 있어 좋습니다.',
          date: '2024-08-19',
          helpful: 6
        }
      ]
    },
    
    // 원동국제시장 매장들
    {
      id: 3,
      name: '생활백화점',
      category: 'living',
      area: '원동국제시장',
      rating: 4.2,
      priceRange: '₩',
      phone: '042-345-6789',
      description: '생활용품부터 주방용품까지 모든 것이 있는 곳',
      specialties: ['주방용품', '생활용품', '청소용품'],
      operatingHours: '09:00 - 19:00',
      averagePrice: '1-3만원',
      reviews: [
        {
          id: 4,
          userName: '최영수',
          rating: 4,
          comment: '필요한 생활용품들을 한 번에 구매할 수 있어서 편리해요. 가격도 저렴하고 품질도 괜찮습니다.',
          date: '2024-08-17',
          helpful: 5
        }
      ]
    },
    {
      id: 4,
      name: '스마트 전자',
      category: 'electronics',
      area: '원동국제시장',
      rating: 4.0,
      priceRange: '₩₩₩',
      phone: '042-456-7890',
      description: '최신 전자제품과 스마트 기기 전문점',
      specialties: ['스마트폰', '태블릿', '전자기기'],
      operatingHours: '10:00 - 20:00',
      averagePrice: '10-50만원',
      reviews: [
        {
          id: 5,
          userName: '김테크',
          rating: 4,
          comment: '최신 전자제품들이 잘 구비되어 있고, 사장님이 전문적인 상담을 해주셔서 만족합니다.',
          date: '2024-08-16',
          helpful: 3
        }
      ]
    },

    // 먹자골목 매장들
    {
      id: 5,
      name: '할머니 손칼국수',
      category: 'food',
      area: '먹자골목',
      rating: 4.8,
      priceRange: '₩',
      phone: '042-567-8901',
      description: '50년 전통의 손칼국수 전문점',
      specialties: ['손칼국수', '만두', '김치'],
      operatingHours: '07:00 - 17:00',
      averagePrice: '8000-12000원',
      reviews: [
        {
          id: 6,
          userName: '맛집탐방러',
          rating: 5,
          comment: '진짜 할머니가 손으로 직접 뽑으신 면이라 쫄깃하고 맛있어요! 국물도 깔끔하고 진짜 맛집입니다.',
          date: '2024-08-21',
          helpful: 15
        },
        {
          id: 7,
          userName: '대전토박이',
          rating: 5,
          comment: '어릴 때부터 먹던 추억의 맛이에요. 변하지 않는 정성과 맛에 항상 감사합니다.',
          date: '2024-08-19',
          helpful: 11
        }
      ]
    },
    {
      id: 6,
      name: '대전 순대국밥',
      category: 'food',
      area: '먹자골목',
      rating: 4.6,
      priceRange: '₩',
      phone: '042-678-9012',
      description: '진짜 대전식 순대국밥을 맛볼 수 있는 곳',
      specialties: ['순대국밥', '머릿고기', '선지국'],
      operatingHours: '06:00 - 22:00',
      averagePrice: '9000-15000원',
      reviews: [
        {
          id: 8,
          userName: '국밥사랑',
          rating: 5,
          comment: '진한 국물과 신선한 순대가 일품이에요. 새벽부터 저녁까지 언제 가도 맛있어요!',
          date: '2024-08-20',
          helpful: 9
        }
      ]
    },
    {
      id: 7,
      name: '매운 떡볶이',
      category: 'food',
      area: '먹자골목',
      rating: 4.4,
      priceRange: '₩',
      description: '청양고추로 만든 진짜 매운 떡볶이',
      specialties: ['매운 떡볶이', '튀김', '오뎅'],
      operatingHours: '11:00 - 21:00',
      averagePrice: '3000-8000원',
      reviews: [
        {
          id: 9,
          userName: '매운맛러버',
          rating: 4,
          comment: '정말 매워요! 매운 걸 좋아하는 분들께 강력 추천. 튀김도 바삭하고 맛있어요.',
          date: '2024-08-18',
          helpful: 7
        }
      ]
    },

    // 신중앙시장 매장들
    {
      id: 8,
      name: '싱싱 수산',
      category: 'grocery',
      area: '신중앙시장',
      rating: 4.5,
      priceRange: '₩₩',
      phone: '042-789-0123',
      description: '매일 새벽에 들어오는 신선한 수산물',
      specialties: ['활어', '조개류', '건어물'],
      operatingHours: '05:00 - 18:00',
      averagePrice: '시세',
      reviews: [
        {
          id: 10,
          userName: '요리사',
          rating: 5,
          comment: '매일 새벽에 들어오는 신선한 생선들이 정말 좋아요. 사장님이 좋은 것만 골라서 추천해주세요.',
          date: '2024-08-17',
          helpful: 8
        }
      ]
    },
    {
      id: 9,
      name: '자연농산',
      category: 'grocery',
      area: '신중앙시장',
      rating: 4.3,
      priceRange: '₩',
      phone: '042-890-1234',
      description: '농장 직송 신선한 채소와 과일',
      specialties: ['유기농 채소', '제철 과일', '쌀·잡곡'],
      operatingHours: '06:00 - 19:00',
      averagePrice: '시세',
      reviews: [
        {
          id: 11,
          userName: '건강지킴이',
          rating: 4,
          comment: '유기농 채소들이 정말 신선해요. 가격도 합리적이고 농장에서 직접 가져오셔서 믿을 수 있어요.',
          date: '2024-08-16',
          helpful: 4
        }
      ]
    },

    // 홈커텐거리 매장들
    {
      id: 10,
      name: '우리집 인테리어',
      category: 'living',
      area: '홈커텐거리',
      rating: 4.1,
      priceRange: '₩₩',
      phone: '042-901-2345',
      description: '맞춤 커튼과 블라인드 전문점',
      specialties: ['커튼', '블라인드', '침구류'],
      operatingHours: '10:00 - 18:00',
      averagePrice: '5-20만원',
      reviews: [
        {
          id: 12,
          userName: '인테리어초보',
          rating: 4,
          comment: '맞춤 커튼 제작해주시는데 정말 마음에 들어요. 상담도 친절하게 해주시고 추천합니다.',
          date: '2024-08-15',
          helpful: 6
        }
      ]
    },
    {
      id: 11,
      name: '홈데코 플러스',
      category: 'living',
      area: '홈커텐거리',
      rating: 4.0,
      priceRange: '₩',
      description: '작은 소품부터 큰 가구까지',
      specialties: ['인테리어 소품', '조명', '식물'],
      operatingHours: '10:00 - 19:00',
      averagePrice: '1-10만원',
      reviews: [
        {
          id: 13,
          userName: '홈꾸미기',
          rating: 4,
          comment: '예쁜 소품들이 많아서 구경하는 재미가 있어요. 가격도 착하고 종류도 다양합니다.',
          date: '2024-08-14',
          helpful: 3
        }
      ]
    },

    // 양키시장 매장들
    {
      id: 12,
      name: '빈티지 컬렉션',
      category: 'vintage',
      area: '양키시장',
      rating: 4.7,
      priceRange: '₩₩',
      phone: '042-012-3456',  
      description: '엄선된 빈티지 의류와 액세서리',
      specialties: ['빈티지 의류', '골동품', '레트로 소품'],
      operatingHours: '12:00 - 20:00',
      averagePrice: '2-15만원',
      reviews: [
        {
          id: 14,
          userName: '빈티지러버',
          rating: 5,
          comment: '정말 특별한 빈티지 아이템들이 많아요! 사장님이 직접 선별해서 가져오신 것 같아 퀄리티가 좋습니다.',
          date: '2024-08-13',
          helpful: 10
        }
      ]
    },
    {
      id: 13,
      name: '유니크 스토어',
      category: 'vintage',
      area: '양키시장',
      rating: 4.2,
      priceRange: '₩',
      description: '개성 있는 소품과 특이한 아이템들',
      specialties: ['독특한 소품', '희귀 아이템', '수집품'],
      operatingHours: '13:00 - 19:00',
      averagePrice: '5000-50000원',
      reviews: [
        {
          id: 15,
          userName: '수집가',
          rating: 4,
          comment: '정말 독특하고 재미있는 아이템들이 가득해요. 특별한 선물을 찾을 때 가기 좋은 곳입니다.',
          date: '2024-08-12',
          helpful: 5
        }
      ]
    }
  ];

  // 혼잡도 시현 모드 토글
  const handleCongestionToggle = () => {
    const newMode = !isCongestionMode;
    setIsCongestionMode(newMode);
    
    // 혼잡 모드로 전환 시 까우니 알림 트리거
    if (newMode && onCongestionAlert) {
      // 약간의 딜레이 후 캐릭터 알림 (UI 업데이트 후)
      setTimeout(() => {
        onCongestionAlert();
      }, 800); // 혼잡도 UI 변경 후 캐릭터 알림
    }
  };

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
      case 'sale': return '🏷️';
      case 'festival': return '🎉';
      case 'food': return '🍜';
      case 'culture': return '🎭';
      default: return '📅';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'sale': return '할인';
      case 'festival': return '축제';
      case 'food': return '먹거리';
      case 'culture': return '문화';
      default: return '행사';
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-green-500 text-white">진행중</Badge>;
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'food': return '음식점';
      case 'fashion': return '패션';
      case 'electronics': return '전자제품';
      case 'living': return '생활용품';
      case 'beauty': return '뷰티';
      case 'vintage': return '빈티지';
      case 'grocery': return '식료품';
      default: return '기타';
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
      return currentEvents;
    }
    return currentEvents.filter(event => event.location === area.name);
  };

  // 선택된 구역별 매장 필터링
  const getStoresForArea = (area: AreaInfo | null) => {
    if (!area || area.id === 0) {
      return stores;
    }
    return stores.filter(store => store.area === area.name);
  };

  // 카테고리와 검색어로 필터링된 매장
  const getFilteredStores = (areaStores: Store[]) => {
    let filtered = areaStores;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  const renderStarRating = (rating: number, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-1 ${size === 'lg' ? 'text-base' : 'text-sm'} text-gray-600`}>({rating})</span>
      </div>
    );
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  const handleReviewSubmit = () => {
    if (!selectedStore || !newReview.comment.trim()) return;

    // 실제 앱에서는 API 호출을 통해 리뷰를 저장
    const review: Review = {
      id: Date.now(),
      userName: '익명사용자',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    // 로컬 상태 업데이트 (실제 앱에서는 서버 응답 후 업데이트)
    const updatedStores = stores.map(store => 
      store.id === selectedStore.id 
        ? { ...store, reviews: [...store.reviews, review] }
        : store
    );

    setNewReview({ rating: 5, comment: '' });
    // 여기서 실제로는 stores 상태를 업데이트해야 하지만, 
    // 현재는 const로 선언되어 있어 데모용으로만 표시
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
        
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-gmarket-bold text-3xl">대전중앙시장 안내</h1>
          <Button
            variant={isCongestionMode ? "default" : "outline"}
            size="sm"
            onClick={handleCongestionToggle}
            className={`px-3 py-1 text-xs rounded-full font-gmarket-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
              isCongestionMode 
                ? 'bg-red-500 text-white border-0 hover:bg-red-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            <Activity className="w-3 h-3 mr-1" />
            혼잡{isCongestionMode ? 'OFF' : 'ON'}
          </Button>
        </div>
        <p className="text-gray-600">
          {isCongestionMode 
            ? '🚨 혼잡도 시현 모드 - 실제 혼잡 상황을 시뮬레이션하고 있습니다' 
            : '실시간 혼잡도와 구역별 매장 정보를 확인하세요'
          }
        </p>
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
                대전중앙시장 혼잡도 맵
                {isCongestionMode && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs animate-pulse">
                    혼잡 모드
                  </Badge>
                )}
              </h3>
            </div>
            <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
              <ImageWithFallback 
                src={centralMarketMapImage}
                alt="대전중앙시장 안내도"
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
                  animate={{ 
                    scale: 1,
                    x: 0,
                    y: 0
                  }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`absolute w-8 h-8 rounded-full cursor-pointer ${getCongestionColor(area.congestion)} border-3 border-white shadow-lg hover:scale-125 transition-transform z-10 flex items-center justify-center select-none ${
                    isCongestionMode && area.congestion === 'high' ? 'animate-pulse' : ''
                  }`}
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
              <ShoppingBag className="w-5 h-5 mr-2" />
              구역 선택 안내
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                지도의 번호를 클릭하면 해당 구역의 상세 정보와 매장들을 확인할 수 있습니다.
              </p>
              {isCongestionMode && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-gmarket-medium">
                    🚨 현재 혼잡 시현 모드입니다. 실제 상황보다 혼잡도가 높게 표시됩니다.
                  </p>
                </div>
              )}
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
                    <Badge className={`text-white text-xs ${getCongestionColor(area.congestion)} ${
                      isCongestionMode && area.congestion === 'high' ? 'animate-pulse' : ''
                    }`}>
                      {getCongestionText(area.congestion)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span className="break-keep">{area.currentVisitors}/{area.maxCapacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="break-keep">{formatStayTime(area.averageStayTime)}</span>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="flex items-center text-xs text-blue-600 mb-2">
                      <Timer className="w-3 h-3 mr-1" />
                      <span className="break-keep">예상 대기시간: {formatWaitTime(currentMarketInfo.estimatedWaitTime)}</span>
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

        {/* 선택된 구역 상세 정보 및 매장 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedArea && selectedArea.id !== 0 ? (
            <>
              {/* 선택된 구역 상세 정보 */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-gmarket-bold break-keep">{selectedArea.name}</h2>
                  <div className="text-right">
                    <Badge className={`text-white ${getCongestionColor(selectedArea.congestion)} mb-2 ${
                      isCongestionMode && selectedArea.congestion === 'high' ? 'animate-pulse' : ''
                    }`}>
                      {getCongestionText(selectedArea.congestion)}
                    </Badge>
                    <div className="text-sm text-gray-600 break-keep">
                      현재 {selectedArea.currentVisitors}명 쇼핑 중
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 break-keep">{selectedArea.description}</p>

                <div className="mb-4">
                  <h4 className="font-gmarket-medium mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    주요 판매 상품
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArea.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="break-keep">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm break-keep">평균 체류시간: {formatStayTime(selectedArea.averageStayTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm break-keep">최대 수용인원: {selectedArea.maxCapacity}명</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-gmarket-medium mb-2">혼잡도 현황</h4>
                  <Progress 
                    value={(selectedArea.currentVisitors / selectedArea.maxCapacity) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>여유</span>
                    <span>혼잡</span>
                  </div>
                </div>

                {isCongestionMode && selectedArea.congestion === 'high' && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="font-gmarket-medium text-red-700">혼잡 알림</span>
                    </div>
                    <p className="text-sm text-red-600">
                      현재 이 구역은 매우 혼잡합니다. 다른 구역을 먼저 둘러보시거나 시간을 두고 다시 방문하세요.
                    </p>
                  </div>
                )}
              </Card>

              {/* 해당 구역 진행 중인 행사 */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center font-gmarket-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  진행 중인 행사
                </h3>
                {getEventsForArea(selectedArea).length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {getEventsForArea(selectedArea).map(event => (
                      <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getEventTypeIcon(event.type)}</span>
                            <h4 className="font-gmarket-medium break-keep">{event.title}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline">
                              {getEventTypeText(event.type)}
                            </Badge>
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="break-keep">{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="break-keep">{event.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 break-keep">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>현재 진행 중인 행사가 없습니다</p>
                  </div>
                )}
              </Card>

              {/* 해당 구역 매장 목록 */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center font-gmarket-medium">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    매장 정보 ({getStoresForArea(selectedArea).length}개)
                  </h3>
                </div>

                {/* 매장 필터링 */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="매장명, 상품으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 카테고리</option>
                    <option value="food">음식점</option>
                    <option value="fashion">패션</option>
                    <option value="living">생활용품</option>
                    <option value="beauty">뷰티</option>
                    <option value="electronics">전자제품</option>
                    <option value="vintage">빈티지</option>
                    <option value="grocery">식료품</option>
                  </select>
                </div>

                {/* 매장 목록 */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getFilteredStores(getStoresForArea(selectedArea)).length > 0 ? (
                    getFilteredStores(getStoresForArea(selectedArea)).map(store => (
                      <div 
                        key={store.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleStoreClick(store)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-gmarket-medium break-keep">{store.name}</h4>
                            <p className="text-sm text-gray-600 break-keep">{store.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {getCategoryText(store.category)}
                            </Badge>
                            <div className="text-xs text-gray-500">{store.priceRange}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {renderStarRating(store.rating)}
                          <span className="break-keep">영업: {store.operatingHours}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {store.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs break-keep">
                              {specialty}
                            </Badge>
                          ))}
                          {store.specialties.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{store.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        {store.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{store.phone}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>검색 조건에 맞는 매장이 없습니다</p>
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            /* 전체 대전중앙시장 정보 */
            <>
              <Card className="p-6">
                <h2 className="text-2xl font-gmarket-bold mb-4">대전중앙시장 전체 현황</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${isCongestionMode ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <div className="flex items-center mb-2">
                      <Users className={`w-5 h-5 mr-2 ${isCongestionMode ? 'text-red-600' : 'text-blue-600'}`} />
                      <span className="font-gmarket-medium">전체 방문객</span>
                    </div>
                    <div className={`text-2xl font-gmarket-bold ${isCongestionMode ? 'text-red-600' : 'text-blue-600'}`}>
                      {currentMarketInfo.totalVisitors}명
                    </div>
                    <div className="text-sm text-gray-600">
                      최대 {currentMarketInfo.totalCapacity}명
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isCongestionMode ? 'bg-orange-50' : 'bg-green-50'}`}>
                    <div className="flex items-center mb-2">
                      <Clock className={`w-5 h-5 mr-2 ${isCongestionMode ? 'text-orange-600' : 'text-green-600'}`} />
                      <span className="font-gmarket-medium">평균 체류시간</span>
                    </div>
                    <div className={`text-2xl font-gmarket-bold ${isCongestionMode ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatStayTime(currentMarketInfo.averageStayTime)}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isCongestionMode ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <div className="flex items-center mb-2">
                      <Timer className={`w-5 h-5 mr-2 ${isCongestionMode ? 'text-red-600' : 'text-yellow-600'}`} />
                      <span className="font-gmarket-medium">예상 대기시간</span>
                    </div>
                    <div className={`text-2xl font-gmarket-bold ${isCongestionMode ? 'text-red-600' : 'text-yellow-600'}`}>
                      {formatWaitTime(currentMarketInfo.estimatedWaitTime)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-gmarket-medium mb-2">전체 혼잡도</h4>
                  <Progress 
                    value={(currentMarketInfo.totalVisitors / currentMarketInfo.totalCapacity) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>여유</span>
                    <span>혼잡</span>
                  </div>
                </div>
                
                {isCongestionMode && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-gmarket-medium mb-2 flex items-center text-red-700">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      혼잡 상황 알림
                    </h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• 현재 시장 전체가 매우 혼잡한 상태입니다</li>
                      <li>• 대기시간이 평소보다 길어질 수 있습니다</li>
                      <li>• 가급적 오후 늦은 시간 또는 대체 장소 방문을 권장합니다</li>
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-gmarket-medium mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    이용 안내
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 지도에서 구역 번호를 클릭하여 상세 정보를 확인하세요</li>
                    <li>• 혼잡도는 실시간으로 업데이트됩니다</li>
                    <li>• 여유 시간대: 오전 10시 이전, 오후 2-4시, 저녁 8시 이후</li>
                    {isCongestionMode && (
                      <li className="text-red-600">• 혼잡on 모드: 시현용 가상 데이터가 표시됩니다</li>
                    )}
                  </ul>
                </div>
              </Card>
              
              {/* 전체 진행 중인 행사 */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center font-gmarket-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  전체 진행 중인 행사
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {currentEvents.map(event => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{getEventTypeIcon(event.type)}</span>
                          <h4 className="font-gmarket-medium break-keep">{event.title}</h4>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline">
                            {getEventTypeText(event.type)}
                          </Badge>
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="break-keep">{event.date}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="break-keep">{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="break-keep">{event.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 break-keep">{event.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </motion.div>
      </div>

      {/* 매장 상세 정보 다이얼로그 */}
      <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          {selectedStore && (
            <>
              <DialogHeader>
                <DialogTitle className="font-gmarket-bold">{selectedStore.name}</DialogTitle>
                <DialogDescription>
                  {selectedStore.area} • {getCategoryText(selectedStore.category)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {renderStarRating(selectedStore.rating, 'lg')}
                  <div className="text-right">
                    <div className="text-lg font-gmarket-bold">{selectedStore.priceRange}</div>
                    {selectedStore.averagePrice && (
                      <div className="text-sm text-gray-600">{selectedStore.averagePrice}</div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 break-keep">{selectedStore.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-gmarket-medium mb-2">주요 상품</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStore.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="break-keep">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="break-keep">{selectedStore.operatingHours}</span>
                    </div>
                    {selectedStore.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedStore.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 리뷰 섹션 */}
                <div>
                  <h4 className="font-gmarket-medium mb-3">고객 리뷰 ({selectedStore.reviews.length})</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedStore.reviews.map(review => (
                      <div key={review.id} className="border-b pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-gmarket-medium text-sm">{review.userName}</span>
                            <div className="ml-2">
                              {renderStarRating(review.rating)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 break-keep">{review.comment}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>도움됨 {review.helpful}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 리뷰 작성 */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-gmarket-medium mb-3">리뷰 작성</h5>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">평점:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 cursor-pointer ${
                                star <= newReview.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            />
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="이 매장에 대한 솔직한 후기를 남겨주세요..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={3}
                      />
                      <Button 
                        onClick={handleReviewSubmit}
                        disabled={!newReview.comment.trim()}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        리뷰 등록
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}