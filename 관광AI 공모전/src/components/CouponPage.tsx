import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Clock, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CouponPageProps {
  onBack: () => void;
}

export default function CouponPage({ onBack }: CouponPageProps) {
  // 임시 쿠폰 데이터
  const coupons = [
    {
      id: 1,
      title: '국립중앙과학관 입장료 할인',
      discount: '20% 할인',
      description: '성인 입장료 20% 할인 혜택',
      expiryDate: '2024.12.31',
      status: 'available', // available, used, expired
      category: '관람'
    },
    {
      id: 2,
      title: '구석투어 기념품샵',
      discount: '3,000원 할인',
      description: '10,000원 이상 구매 시 사용 가능',
      expiryDate: '2024.11.30',
      status: 'used',
      category: '쇼핑'
    },
    {
      id: 3,
      title: '카페 음료 할인',
      discount: '15% 할인',
      description: '과학관 내 카페 음료 할인',
      expiryDate: '2024.10.15',
      status: 'expired',
      category: '음식'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-600';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '사용가능';
      case 'used':
        return '사용완료';
      case 'expired':
        return '기간만료';
      default:
        return '알 수 없음';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '관람':
        return <Star className="w-4 h-4" />;
      case '쇼핑':
        return <Gift className="w-4 h-4" />;
      case '음식':
        return <Clock className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          onClick={onBack}
          className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">쿠폰 보관함</h1>
          <p className="text-lg text-gray-600">구석투어에서 획득한 쿠폰들을 확인해보세요!</p>
        </motion.div>

        {/* 쿠폰 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md"
        >
          <Card className="p-4 text-center bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {coupons.filter(c => c.status === 'available').length}
            </div>
            <div className="text-sm text-green-700">사용가능</div>
          </Card>
          <Card className="p-4 text-center bg-gray-50 border-gray-200">
            <div className="text-2xl font-bold text-gray-600">
              {coupons.filter(c => c.status === 'used').length}
            </div>
            <div className="text-sm text-gray-700">사용완료</div>
          </Card>
          <Card className="p-4 text-center bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {coupons.filter(c => c.status === 'expired').length}
            </div>
            <div className="text-sm text-red-700">기간만료</div>
          </Card>
        </motion.div>

        {/* 쿠폰 리스트 */}
        <div className="w-full max-w-2xl space-y-4">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className={`p-6 ${coupon.status === 'available' ? 'bg-white border-blue-200 shadow-lg' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(coupon.category)}
                      <Badge variant="outline" className="text-xs">
                        {coupon.category}
                      </Badge>
                      <Badge className={getStatusColor(coupon.status)}>
                        {getStatusText(coupon.status)}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-gray-800">
                      {coupon.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {coupon.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {coupon.discount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {coupon.expiryDate}까지
                      </div>
                    </div>
                  </div>
                </div>
                
                {coupon.status === 'available' && (
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => alert('쿠폰 사용 기능은 준비 중입니다!')}
                  >
                    쿠폰 사용하기
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {coupons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-12"
          >
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              보유 중인 쿠폰이 없습니다
            </h3>
            <p className="text-gray-500">
              구석투어를 진행하면서 다양한 쿠폰을 획득해보세요!
            </p>
          </motion.div>
        )}

        {/* 하단 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
            <p className="text-gray-600 text-sm">
              🎁 스탬프를 모으고 미션을 완료하여 더 많은 쿠폰을 획득하세요!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}