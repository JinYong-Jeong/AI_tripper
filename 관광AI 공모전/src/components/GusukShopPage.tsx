import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Coins, Star, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WearableItem } from '../App';
import kawouniImage from 'figma:asset/0f85bc5afb4ab9510756ee0578698ec79610af83.png';
import kawouniLabCoatImage from 'figma:asset/ad33722c7c815572d1465ccf756f849ee774aa75.png';

interface GusukShopPageProps {
  onBack: () => void;
  equippedItems: WearableItem[];
  onItemEquip: (item: WearableItem, equip: boolean) => void;
}

interface ShopItem {
  id: number;
  name: string;
  category: '모자' | '안경' | '배낭' | '의상' | '액세서리';
  price: number;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  wearableType?: WearableItem['type']; // 착용 가능한 타입
}

export default function GusukShopPage({ onBack, equippedItems, onItemEquip }: GusukShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [coins, setCoins] = useState(1500);
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null); // 미���보기 중인 아이템
  
  // 아이템 상태를 관리하는 state 추가
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    {
      id: 1,
      name: '까우니 모자',
      category: '모자',
      price: 500,
      description: '귀여운 까우니 캐릭터 모자입니다',
      image: '🎩',
      rarity: 'common',
      owned: true,
      wearableType: 'hat'
    },
    {
      id: 2,
      name: '과학자 안경',
      category: '안경',
      price: 300,
      description: '과학관에서 얻을 수 있는 특별한 안경',
      image: '🤓',
      rarity: 'rare',
      owned: true,
      wearableType: 'glasses'
    },
    {
      id: 3,
      name: '탐험가 배낭',
      category: '배낭',
      price: 800,
      description: '모든 탐험에 필요한 든든한 배낭',
      image: '🎒',
      rarity: 'epic',
      owned: false
    },
    {
      id: 4,
      name: '대전 한복',
      category: '의상',
      price: 1200,
      description: '대전 전통 한복 스타일',
      image: '👘',
      rarity: 'legendary',
      owned: false
    },
    {
      id: 5,
      name: '과학 배지',
      category: '액세서리',
      price: 200,
      description: '과학관 미션 완료 기념 배지',
      image: '🏅',
      rarity: 'common',
      owned: false,
      wearableType: 'accessory'
    },
    {
      id: 6,
      name: '탐험 나침반',
      category: '액세서리',
      price: 600,
      description: '길을 잃지 않게 도와주는 마법의 나침반',
      image: '🧭',
      rarity: 'rare',
      owned: false,
      wearableType: 'accessory'
    },
    {
      id: 7,
      name: '까우니 가운',
      category: '의상',
      price: 1000,
      description: '국립중앙과학관에서 획득할 수 있는 과학자 가운입니다',
      image: '🥼',
      rarity: 'epic',
      owned: false,
      wearableType: 'labcoat'
    }
  ]);

  const categories = ['전체', '모자', '안경', '배낭', '의상', '액세서리'];

  const filteredItems = shopItems.filter(item => 
    selectedCategory === '전체' || item.category === selectedCategory
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return '일반';
      case 'rare': return '희귀';
      case 'epic': return '영웅';
      case 'legendary': return '전설';
      default: return '일반';
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !item.owned) {
      // 코인 차감
      setCoins(prev => prev - item.price);
      
      // 아이템 보유 상태 업데이트
      setShopItems(prev => 
        prev.map(shopItem => 
          shopItem.id === item.id 
            ? { ...shopItem, owned: true }
            : shopItem
        )
      );
      
      // 선택된 아이템 정보도 업데이트
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...item, owned: true });
      }
      
      alert(`${item.name}을(를) 구매했습니다!`);
    }
  };

  // 아이템 착용/해제 처리
  const handleEquipToggle = (item: ShopItem) => {
    if (item.wearableType && item.owned) {
      const isEquipped = equippedItems.some(equipped => equipped.id === item.id);
      const wearableItem: WearableItem = {
        id: item.id,
        name: item.name,
        type: item.wearableType,
        equipped: !isEquipped
      };
      
      onItemEquip(wearableItem, !isEquipped);
    }
  };

  // 미리보기 토글
  const handlePreviewToggle = (item: ShopItem) => {
    if (previewItem?.id === item.id) {
      setPreviewItem(null); // 미리보기 해제
    } else {
      setPreviewItem(item); // 미리보기 설정
    }
  };

  // 아이템이 착용되어 있는지 확인
  const isEquipped = (item: ShopItem) => {
    return equippedItems.some(equipped => equipped.id === item.id);
  };

  // 미리보기에 사용할 이미지 결정
  const getPreviewImage = () => {
    // 미리보기 중인 아이템이 있으면 해당 아이템 적용
    if (previewItem?.name === '까우니 가운') {
      return kawouniLabCoatImage;
    }
    
    // 실제 착용된 아이템 확인
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    return hasLabCoat ? kawouniLabCoatImage : kawouniImage;
  };

  // 미리보기에 표시할 액세서리들
  const getPreviewAccessories = () => {
    const accessories = [];
    
    // 미리보기 중인 아이템이 있으면 우선 적용
    if (previewItem) {
      if (previewItem.name.includes('모자')) {
        accessories.push({ type: 'hat', emoji: '🎩' });
      }
      if (previewItem.name.includes('안경')) {
        accessories.push({ type: 'glasses', emoji: '🤓' });
      }
    } else {
      // 실제 착용된 아이템들 적용
      const hatItem = equippedItems.find(item => item.type === 'hat');
      const glassesItem = equippedItems.find(item => item.type === 'glasses');
      
      if (hatItem) accessories.push({ type: 'hat', emoji: '🎩' });
      if (glassesItem) accessories.push({ type: 'glasses', emoji: '🤓' });
    }
    
    return accessories;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">콕콕 상점</h1>
            <p className="text-gray-600">까우니를 꾸며보세요!</p>
          </div>
          <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-700">{coins} 코인</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="p-4">
            <h3 className="mb-4">카테고리</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </Card>

          {/* 캐릭터 미리보기 */}
          <Card className="p-4 mt-4">
            <h3 className="mb-4">까우니 미리보기</h3>
            <div className="flex flex-col items-center relative">
              <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-4 overflow-hidden relative">
                <img 
                  src={getPreviewImage()} 
                  alt="까우니" 
                  className="w-full h-full object-contain" 
                />
                
                {/* 액세서리 표시 (가운이 없을 때만) */}
                {getPreviewImage() === kawouniImage && getPreviewAccessories().map(accessory => (
                  <div 
                    key={accessory.type}
                    className={`absolute text-lg ${
                      accessory.type === 'hat' ? '-top-2 left-1/2 transform -translate-x-1/2' :
                      accessory.type === 'glasses' ? 'top-1/4 right-2 text-sm' : ''
                    }`}
                  >
                    {accessory.emoji}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {previewItem ? '미리보기 중' : '구매한 아이템들로 까우니를 꾸며보세요'}
                </p>
                {previewItem && (
                  <div className="bg-purple-50 px-3 py-1 rounded-full mb-2">
                    <span className="text-xs text-purple-700 font-medium">👁️ {previewItem.name} 미리보기</span>
                  </div>
                )}
                {equippedItems.length > 0 && (
                  <div className="space-y-1">
                    {equippedItems.map(item => (
                      <div key={item.id} className="bg-blue-50 px-3 py-1 rounded-full">
                        <span className="text-xs text-blue-700 font-medium">✨ {item.name} 착용 중</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 아이템 그리드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    item.owned ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'
                  } ${previewItem?.id === item.id ? 'ring-2 ring-purple-300 bg-purple-50' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={`text-white ${getRarityColor(item.rarity)}`}>
                        {getRarityText(item.rarity)}
                      </Badge>
                      {item.owned && (
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          보유중
                        </Badge>
                      )}
                      {isEquipped(item) && (
                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                          착용중
                        </Badge>
                      )}
                      {previewItem?.id === item.id && (
                        <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                          미리보기
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Coins className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="font-medium">{item.price}</span>
                    </div>
                  </div>

                  {/* 버튼들 */}
                  <div className="space-y-2">
                    {/* 구매 버튼 */}
                    {!item.owned && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(item);
                        }}
                        disabled={coins < item.price}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        구매 ({item.price}G)
                      </Button>
                    )}

                    {/* 착용/해제 및 미리보기 버튼 */}
                    {item.owned && item.wearableType && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={isEquipped(item) ? "destructive" : "default"}
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipToggle(item);
                          }}
                        >
                          {isEquipped(item) ? '해제' : '착용'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewToggle(item);
                          }}
                        >
                          {previewItem?.id === item.id ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              미리보기 해제
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              미리보기
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 아이템 상세 정보 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          {selectedItem ? (
            <Card className="p-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{selectedItem.image}</div>
                <h3 className="mb-2">{selectedItem.name}</h3>
                <Badge className={`text-white ${getRarityColor(selectedItem.rarity)}`}>
                  {getRarityText(selectedItem.rarity)}
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">카테고리:</span> {selectedItem.category}
                </div>
                <div>
                  <span className="font-medium">가격:</span>
                  <div className="flex items-center mt-1">
                    <Coins className="w-4 h-4 text-yellow-600 mr-1" />
                    {selectedItem.price} 코인
                  </div>
                </div>
                <div>
                  <span className="font-medium">설명:</span>
                  <p className="mt-1 text-gray-600">{selectedItem.description}</p>
                </div>
                {selectedItem.name === '까우니 가운' && !selectedItem.owned && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center text-purple-700 mb-1">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="font-medium text-xs">특별 아이템</span>
                    </div>
                    <p className="text-xs text-purple-600">
                      국립중앙과학관 생물탐구관 미션을 완료하면 무료로 획득할 수 있습니다!
                    </p>
                  </div>
                )}
              </div>
              
              {selectedItem.owned ? (
                <div className="space-y-2 mt-4">
                  {selectedItem.wearableType ? (
                    <>
                      <Button
                        className={`w-full ${isEquipped(selectedItem) ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        onClick={() => handleEquipToggle(selectedItem)}
                      >
                        {isEquipped(selectedItem) ? '해제하기' : '착용하기'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePreviewToggle(selectedItem)}
                      >
                        {previewItem?.id === selectedItem.id ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            미리보기 해제
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            미리보기
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center text-green-700">
                        <Star className="w-5 h-5 mr-2" />
                        <span className="font-medium">보유중인 아이템</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full mt-4"
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={coins < selectedItem.price}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {coins < selectedItem.price ? '코인 부족' : '구매하기'}
                </Button>
              )}
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="mb-2">아이템을 선택하세요</h3>
              <p className="text-gray-600 text-sm">
                왼쪽에서 아이템을 클릭하면 상세 정보를 확인할 수 있습니다.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}