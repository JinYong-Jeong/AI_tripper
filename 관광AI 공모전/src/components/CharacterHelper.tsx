import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, PanInfo } from 'motion/react';
import { WearableItem, CharacterState, CharacterPosition } from '../App';
import kawouniImage from 'figma:asset/efa418cd9f47da90b1416b2db7afbe8ea75ccf24.png';
import kawouniLabCoatImage from 'figma:asset/ad33722c7c815572d1465ccf756f849ee774aa75.png';
import kawouniPeekLeftImage from 'figma:asset/9a668970a11afa603045bd5d363b88e7cac768d8.png';
import kawouniPeekRightImage from 'figma:asset/5f700869de3af6d5856b7760b9541df57d03f7b6.png';

interface CharacterHelperProps {
  onChatOpen: () => void;
  onStateChange: (state: CharacterState, position?: CharacterPosition) => void;
  characterState: CharacterState;
  characterPosition: CharacterPosition;
  equippedItems: WearableItem[];
  onCongestionChatOpen?: () => void;
  onCongestionDismiss?: () => void;
}

export default function CharacterHelper({ 
  onChatOpen, 
  onStateChange, 
  characterState, 
  characterPosition,
  equippedItems,
  onCongestionChatOpen,
  onCongestionDismiss
}: CharacterHelperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [peekPosition, setPeekPosition] = useState(characterPosition);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [totalDragDistance, setTotalDragDistance] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // 화면 크기 및 캐릭터 크기 상수
  const CHARACTER_SIZE = 80;
  const PEEK_SIZE = 80;
  const WALL_DETECTION_DISTANCE = 85;
  const CLICK_THRESHOLD = 8;
  const PEEK_DRAG_THRESHOLD = 25;

  // 기본 위치 상수
  const BASE_LEFT = 24;
  const BASE_BOTTOM = 24;

  // 화면 크기 가져오기
  const getScreenDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 관성 적용 후 실제 캐릭터 이미지 위치 기준으로 화면 밖 체크 및 방향별 빢꼼
  const checkOutOfScreenWithDirection = (finalRelativeX: number, finalRelativeY: number) => {
    const screen = getScreenDimensions();
    
    // 관성 적용 후 실제 캐릭터 이미지의 절대 위치 계산
    const characterAbsoluteX = BASE_LEFT + finalRelativeX;
    const characterAbsoluteY = screen.height - BASE_BOTTOM - CHARACTER_SIZE + finalRelativeY;
    
    console.log('🔍 관성 후 실제 캐릭터 이미지 위치 체크:', {
      finalRelative: { x: finalRelativeX, y: finalRelativeY },
      characterImageAbsolute: { x: characterAbsoluteX, y: characterAbsoluteY },
      characterBounds: {
        left: characterAbsoluteX,
        right: characterAbsoluteX + CHARACTER_SIZE,
        top: characterAbsoluteY,
        bottom: characterAbsoluteY + CHARACTER_SIZE
      },
      screenBounds: {
        left: 0,
        right: screen.width,
        top: 0,
        bottom: screen.height
      }
    });
    
    // 각 방향별 화면 밖 여부 확인 (더 민감하게)
    const isLeftOut = characterAbsoluteX + CHARACTER_SIZE < -20; // 왼쪽으로 20px 이상 밖
    const isRightOut = characterAbsoluteX > screen.width + 20; // 오른쪽으로 20px 이상 밖
    const isTopOut = characterAbsoluteY + CHARACTER_SIZE < -20; // 위쪽으로 20px 이상 밖
    const isBottomOut = characterAbsoluteY > screen.height + 20; // 아래쪽으로 20px 이상 밖
    
    const isOut = isLeftOut || isRightOut || isTopOut || isBottomOut;
    
    if (isOut) {
      console.log('🚨 관성으로 캐릭터 이미지가 완전히 화면 밖!', {
        directions: { isLeftOut, isRightOut, isTopOut, isBottomOut }
      });
      
      // 방향별 빢꼼 결정
      let peekSide: 'left' | 'right' = 'left';
      let peekY = Math.max(50, Math.min(screen.height - PEEK_SIZE - 50, screen.height * 0.4));
      
      // 우선순위: 좌우 > 상하
      if (isRightOut) {
        peekSide = 'right';
        console.log('➡️ 오른쪽으로 완전히 나감 → 오른쪽 빢꼼');
      } else if (isLeftOut) {
        peekSide = 'left';
        console.log('⬅️ 왼쪽으로 완전히 나감 → 왼쪽 빢꼼');
      } else if (isTopOut || isBottomOut) {
        // 위/아래로 나간 경우 - 가운데 기준으로 결정
        const centerX = characterAbsoluteX + CHARACTER_SIZE / 2;
        if (centerX > screen.width / 2) {
          peekSide = 'right';
          console.log('⬆️⬇️ 상하로 완전히 나감 (오른쪽 치우침) → 오른쪽 빢꼼');
        } else {
          peekSide = 'left';
          console.log('⬆️⬇️ 상하로 완전히 나감 (왼쪽 치우침) → 왼쪽 빢꼼');
        }
      }
      
      // 빢꼼 위치 계산 (좌우 대칭으로 45px씩 가려짐)
      const peekX = peekSide === 'left' ? -45 : screen.width - PEEK_SIZE + 45;
      
      return {
        isOut: true,
        side: peekSide,
        peekPosition: { x: peekX, y: peekY }
      };
    }
    
    return { isOut: false, side: null, peekPosition: null };
  };

  // 좌우 벽 감지 함수 (화면 안에서만)
  const checkHorizontalWallCollision = (finalRelativeX: number, finalRelativeY: number) => {
    const screen = getScreenDimensions();
    
    // 관성 적용 후 실제 캐릭터의 절대 위치 계산
    const characterAbsoluteX = BASE_LEFT + finalRelativeX;
    const characterAbsoluteY = screen.height - BASE_BOTTOM - CHARACTER_SIZE + finalRelativeY;
    
    console.log('🔍 좌우 벽 감지 (화면 안에서):', {
      finalRelative: { x: finalRelativeX, y: finalRelativeY },
      characterAbsolute: { x: characterAbsoluteX, y: characterAbsoluteY }
    });
    
    // 좌측 벽 감지
    const distanceFromLeftWall = characterAbsoluteX;
    if (distanceFromLeftWall <= WALL_DETECTION_DISTANCE && distanceFromLeftWall >= -45) {
      console.log('🏠🔴 좌측 벽 감지!', distanceFromLeftWall);
      return {
        isWall: true,
        side: 'left',
        clampedX: -45,
        clampedY: Math.max(0, Math.min(screen.height - PEEK_SIZE, characterAbsoluteY))
      };
    }
    
    // 우측 벽 감지
    const distanceFromRightWall = screen.width - (characterAbsoluteX + CHARACTER_SIZE);
    if (distanceFromRightWall <= WALL_DETECTION_DISTANCE && distanceFromRightWall >= -45) {
      console.log('🏠🔵 우측 벽 감지!', distanceFromRightWall);
      return {
        isWall: true,
        side: 'right',
        clampedX: screen.width - PEEK_SIZE + 45,
        clampedY: Math.max(0, Math.min(screen.height - PEEK_SIZE, characterAbsoluteY))
      };
    }
    
    return { isWall: false, side: null };
  };

  // 관성 효과 적용 (감소시켜 화면 밖으로 덜 나가게)
  const applyInertia = (finalX: number, finalY: number, velocity: { x: number; y: number }) => {
    const minVelocity = 200; // 150 → 200: 더 빠른 속도일 때만 관성 적용
    const maxInertiaX = 60; // 100 → 60: 관성 효과 감소
    const maxInertiaY = 60; // 100 → 60: 관성 효과 감소
    const inertiaFactor = 0.15; // 0.2 → 0.15: 관성 계수 감소
    
    if (Math.abs(velocity.x) > minVelocity || Math.abs(velocity.y) > minVelocity) {
      const inertiaX = Math.max(-maxInertiaX, Math.min(maxInertiaX, velocity.x * inertiaFactor));
      const inertiaY = Math.max(-maxInertiaY, Math.min(maxInertiaY, velocity.y * inertiaFactor));
      
      console.log('⚡ 관성 적용:', {
        velocity,
        applied: { x: inertiaX, y: inertiaY },
        finalWithInertia: { x: finalX + inertiaX, y: finalY + inertiaY }
      });
      
      return { 
        x: finalX + inertiaX, 
        y: finalY + inertiaY 
      };
    }
    
    return { x: finalX, y: finalY };
  };

  // 안전한 위치 보정 (더 엄격한 경계)
  const ensureSafePosition = (x: number, y: number) => {
    const screen = getScreenDimensions();
    const characterAbsoluteX = BASE_LEFT + x;
    const characterAbsoluteY = screen.height - BASE_BOTTOM - CHARACTER_SIZE + y;
    
    // 기본 안전 범위 (더 엄격하게)
    const safeMarginX = 20; // 10 → 20: 더 큰 안전 마진
    const safeMarginY = 30; // 20 → 30: 더 큰 안전 마진
    
    const minX = -BASE_LEFT + safeMarginX;
    const maxX = screen.width - BASE_LEFT - CHARACTER_SIZE - safeMarginX;
    const minY = -(screen.height - BASE_BOTTOM - CHARACTER_SIZE) + safeMarginY;
    const maxY = BASE_BOTTOM - safeMarginY;
    
    const safeX = Math.max(minX, Math.min(maxX, x));
    const safeY = Math.max(minY, Math.min(maxY, y));
    
    if (safeX !== x || safeY !== y) {
      console.log('🛡️ 안전 위치 보정:', {
        original: { x, y },
        safe: { x: safeX, y: safeY }
      });
    }
    
    return { x: safeX, y: safeY };
  };

  // ========== 혼잡 알림 상태 드래그 핸들러 ==========
  const handleCongestionDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log('🚨 혼잡 알림 드래그 종료:', {
      offset: info.offset,
      totalDragDistance,
      threshold: PEEK_DRAG_THRESHOLD
    });
    
    if (totalDragDistance > PEEK_DRAG_THRESHOLD && onCongestionDismiss) {
      // 충분히 드래그하면 혼잡 알림 해제
      console.log('🚨 혼잡 알림 해제 (드래그로 치움)');
      onCongestionDismiss();
    } else {
      // 짧은 드래그는 위치만 조정
      const screen = getScreenDimensions();
      const newX = characterPosition.x + info.offset.x;
      const newY = characterPosition.y + info.offset.y;
      
      // 중앙에서 조금 벗어날 수 있도록 허용
      const clampedX = Math.max(50, Math.min(screen.width - 146, newX)); // 96px 캐릭터 + 50px 마진
      const clampedY = Math.max(50, Math.min(screen.height - 146, newY));
      
      const newPosition = { x: clampedX, y: clampedY };
      onStateChange('congestion-alert', newPosition);
    }
    
    setTotalDragDistance(0);
  };

  // ========== 일반 상태 드래그 핸들러 ==========
  const handleDragStart = (event: PointerEvent, info: PanInfo) => {
    setIsDragging(true);
    setDragStartTime(Date.now());
    setTotalDragDistance(0);
    console.log('🚀 일반 드래그 시작');
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 실시간 드래그 거리 누적
    const currentDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    setTotalDragDistance(currentDistance);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // 1단계: 기본 위치 계산
    let finalRelativeX = position.x + info.offset.x;
    let finalRelativeY = position.y + info.offset.y;
    
    console.log('🎯 드래그 종료 - 1단계 (기본 위치):', {
      currentPosition: position,
      offset: info.offset,
      beforeInertia: { x: finalRelativeX, y: finalRelativeY },
      velocity: info.velocity
    });
    
    // 2단계: 관성 효과 적용 (충분한 드래그일 때만)
    if (totalDragDistance > CLICK_THRESHOLD) {
      const inertiaPosition = applyInertia(finalRelativeX, finalRelativeY, info.velocity);
      finalRelativeX = inertiaPosition.x;
      finalRelativeY = inertiaPosition.y;
      console.log('⚡ 2단계 - 관성 적용 완료:', { 
        final: { x: finalRelativeX, y: finalRelativeY }
      });
    }
    
    // 3단계: 좌우 벽 감지 우선 (화면 안에서)
    const horizontalCollision = checkHorizontalWallCollision(finalRelativeX, finalRelativeY);
    
    if (horizontalCollision.isWall) {
      // 좌우 벽 근처면 빢 상태로 전환
      const newPeekPosition = { x: horizontalCollision.clampedX, y: horizontalCollision.clampedY };
      console.log('🏠✅ 3단계 - 좌우 벽 근처! 빢 전환:', {
        side: horizontalCollision.side,
        peekPosition: newPeekPosition
      });
      
      setPeekPosition(newPeekPosition);
      onStateChange(horizontalCollision.side === 'left' ? 'peek-left' : 'peek-right', newPeekPosition);
      return;
    }
    
    // 4단계: 화면 완전히 밖 체크
    const screenCheck = checkOutOfScreenWithDirection(finalRelativeX, finalRelativeY);
    
    if (screenCheck.isOut && screenCheck.peekPosition) {
      console.log(`🏠${screenCheck.side === 'right' ? '🔵' : '🔴'} 4단계 - 관성으로 완전히 화면 밖! ${screenCheck.side} 빢꼼:`, screenCheck.peekPosition);
      setPeekPosition(screenCheck.peekPosition);
      onStateChange(screenCheck.side === 'left' ? 'peek-left' : 'peek-right', screenCheck.peekPosition);
      return;
    }
    
    // 5단계: 안전한 위치 보정
    const safePosition = ensureSafePosition(finalRelativeX, finalRelativeY);
    finalRelativeX = safePosition.x;
    finalRelativeY = safePosition.y;
    
    console.log('✅ 5단계 - 최종 안전한 위치로 setPosition:', { x: finalRelativeX, y: finalRelativeY });
    setPosition({ x: finalRelativeX, y: finalRelativeY });
  };

  // ========== 빢 상태 드래그 핸들러 ==========
  const handlePeekDragStart = (event: PointerEvent, info: PanInfo) => {
    setDragStartTime(Date.now());
    setTotalDragDistance(0);
    console.log('🔄 빢 드래그 시작');
  };

  const handlePeekDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 실시간 드래그 거리 누적
    const currentDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    setTotalDragDistance(currentDistance);
  };

  const handlePeekDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log('🏠 빢 드래그 종료:', {
      offset: info.offset,
      totalDragDistance,
      threshold: PEEK_DRAG_THRESHOLD
    });
    
    if (totalDragDistance > PEEK_DRAG_THRESHOLD) {
      // 충분히 드래그하면 일반 상태로 전환
      console.log('🔄 빢→일반 전환 (즉시 클릭 가능하도록 초기화)');
      
      const screen = getScreenDimensions();
      const dragEndAbsoluteX = peekPosition.x + info.offset.x;
      const dragEndAbsoluteY = peekPosition.y + info.offset.y;
      
      // 일반 캐릭터의 기준점으로 변환
      const normalRelativeX = dragEndAbsoluteX - BASE_LEFT;
      const normalRelativeY = dragEndAbsoluteY - (screen.height - BASE_BOTTOM - CHARACTER_SIZE);
      
      // 안전한 위치로 보정
      const safePosition = ensureSafePosition(normalRelativeX, normalRelativeY);
      
      // 즉시 상태 초기화 (클릭 가능하도록)
      setIsTransitioning(true);
      setTotalDragDistance(0); // 즉시 초기화
      setPosition(safePosition);
      onStateChange('normal');
      
      // 매우 짧은 시간 후 전환 완료
      setTimeout(() => {
        setIsTransitioning(false);
        console.log('✅ 빢→일반 전환 완료, 클릭 가능');
      }, 10);
      
    } else {
      // 짧은 드래그는 빢 위치만 이동
      const newX = peekPosition.x + info.offset.x;
      const newY = peekPosition.y + info.offset.y;
      
      const screen = getScreenDimensions();
      // 빢 상태에서는 화면 밖으로도 갈 수 있도록 허용 (좌우 45px 더)
      const clampedX = Math.max(-45, Math.min(screen.width - PEEK_SIZE + 45, newX));
      const clampedY = Math.max(0, Math.min(screen.height - PEEK_SIZE, newY));
      
      const newPosition = { x: clampedX, y: clampedY };
      setPeekPosition(newPosition);
      onStateChange(characterState, newPosition);
    }
  };

  // ========== 클릭 핸들러 ==========
  const handleClick = (event: React.MouseEvent) => {
    console.log('🖱️ 클릭 시도:', {
      isDragging,
      totalDragDistance,
      isTransitioning,
      clickThreshold: CLICK_THRESHOLD,
      characterState
    });
    
    // 드래그 중이면 클릭 무시
    if (isDragging) {
      console.log('🚫 드래그 중이므로 클릭 무시');
      return;
    }
    
    // 드래그 거리가 작으면 클릭으로 처리
    if (totalDragDistance <= CLICK_THRESHOLD) {
      if (characterState === 'congestion-alert' && onCongestionChatOpen) {
        console.log('🚨 혼잡 알림 클릭! 혼잡도 챗봇 열기');
        onCongestionChatOpen();
      } else {
        console.log('💬 일반 클릭 감지! 챗봇 열기 (드래그 거리:', totalDragDistance, ', 전환중:', isTransitioning, ')');
        onChatOpen();
      }
    } else {
      console.log('🚫 드래그 거리가 커서 클릭 무시 (드래그 거리:', totalDragDistance, ')');
    }
  };

  // 이미지 및 액세서리 함수들
  const getCharacterImage = () => {
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    return hasLabCoat ? kawouniLabCoatImage : kawouniImage;
  };

  const getPeekImage = () => {
    if (characterState === 'peek-left') {
      return kawouniPeekLeftImage;
    } else if (characterState === 'peek-right') {
      return kawouniPeekRightImage;
    }
    return kawouniImage;
  };

  const renderAccessories = () => {
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    if (hasLabCoat || (characterState !== 'normal' && characterState !== 'congestion-alert')) return null;

    const accessories = [];
    
    equippedItems.forEach(item => {
      if (item.type === 'hat') {
        accessories.push(
          <div key="hat" className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg">
            🎩
          </div>
        );
      }
      if (item.type === 'glasses') {
        accessories.push(
          <div key="glasses" className="absolute top-1/4 right-2 text-sm">
            🤓
          </div>
        );
      }
    });

    return accessories;
  };

  // 드래그 종료 후 클릭 가능하도록 초기화
  useEffect(() => {
    if (!isDragging) {
      // 드래그 종료 후 100ms 뒤에 드래그 거리 초기화
      const timer = setTimeout(() => {
        setTotalDragDistance(0);
        console.log('🔄 드래그 거리 초기화 완료');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  // ========== 혼잡 알림 상태 렌더링 ==========
  if (characterState === 'congestion-alert') {
    console.log('🚨 혼잡 알림 상태 렌더링:', {
      characterPosition,
      screenSize: { width: window.innerWidth, height: window.innerHeight }
    });

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        <motion.div
          key="congestion-alert-character"
          drag
          dragElastic={0.2}
          dragConstraints={{
            left: 50,
            right: Math.max(50, window.innerWidth - 146), // 96px 캐릭터 + 50px 마진
            top: 50,
            bottom: Math.max(50, window.innerHeight - 146)
          }}
          onDragStart={(event, info) => {
            setDragStartTime(Date.now());
            setTotalDragDistance(0);
            console.log('🚨 혼잡 알림 드래그 시작');
          }}
          onDrag={(event, info) => {
            const currentDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
            setTotalDragDistance(currentDistance);
          }}
          onDragEnd={handleCongestionDragEnd}
          initial={{ 
            opacity: 0, 
            scale: 0.5
          }}
          animate={{ 
            opacity: 1, 
            scale: 1.3, // 조금 더 큰 사이즈로 강조
            x: characterPosition.x,
            y: characterPosition.y
          }}
          transition={{ 
            duration: 0.5, 
            type: "spring", 
            stiffness: 300 
          }}
          className="absolute pointer-events-auto"
          style={{
            left: 0,
            top: 0
          }}
          onClick={handleClick}
        >
          <div className="relative">
            {/* 혼잡 알림 말풍선 - 너비 확장 */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 cursor-pointer"
              onClick={handleClick}
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl px-8 py-4 shadow-xl border-2 border-white relative w-80">
                <div className="text-lg font-gmarket-bold leading-relaxed text-center">
                  <div className="mb-2">🚨 사람이 너무 많네! 내 추천 들어볼래?</div>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 border-b-2 border-r-2 border-white transform rotate-45"></div>
              </div>
            </motion.div>

            {/* 캐릭터 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 cursor-pointer select-none relative"
              onClick={handleClick}
              animate={{ 
                y: [0, -8, 0],
                rotate: [-3, 3, -3]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              whileDrag={{ 
                scale: 1.4,
                zIndex: 60
              }}
            >
              <img 
                src={getCharacterImage()} 
                alt="까우니 혼잡 알림"
                className="w-full h-full object-contain drop-shadow-2xl"
                draggable={false}
              />
              
              {renderAccessories()}
              
              {/* 경고 표시 */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 text-2xl"
              >
                ⚠️
              </motion.div>

              {/* 혼잡도 표시 */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-1 -left-1 text-xl"
              >
                🚨
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== 빢 상태 렌더링 ==========
  if (characterState === 'peek-left' || characterState === 'peek-right') {
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        <motion.div
          key={`peek-character-${characterState}`}
          drag
          dragElastic={0.2}
          dragConstraints={{
            left: -45,
            right: Math.max(0, window.innerWidth - PEEK_SIZE + 45),
            top: 0,
            bottom: Math.max(0, window.innerHeight - PEEK_SIZE)
          }}
          onDragStart={handlePeekDragStart}
          onDrag={handlePeekDrag}
          onDragEnd={handlePeekDragEnd}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            x: peekPosition.x,
            y: peekPosition.y
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: peekPosition.x,
            y: peekPosition.y
          }}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            stiffness: 300 
          }}
          className="absolute pointer-events-auto"
          onClick={handleClick}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 cursor-pointer select-none relative"
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            whileDrag={{ 
              scale: 1.2,
              zIndex: 50
            }}
          >
            <img 
              src={getPeekImage()} 
              alt="까우니 빢"
              className="w-full h-full object-contain drop-shadow-lg"
              draggable={false}
            />
            
            {/* 채팅 힌트 */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1 text-lg"
            >
              💬
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ========== 일반 상태 렌더링 ==========
  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40">
      <motion.div
        key="normal-character"
        drag
        dragElastic={0.2}
        dragConstraints={{
          left: -BASE_LEFT + 20,
          right: Math.max(0, window.innerWidth - BASE_LEFT - CHARACTER_SIZE - 20),
          top: -(window.innerHeight - BASE_BOTTOM - CHARACTER_SIZE) + 30,
          bottom: BASE_BOTTOM - 30
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ 
          opacity: 0, 
          scale: 0 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1
        }}
        transition={{ 
          duration: isTransitioning ? 0 : 0.3,
          delay: isTransitioning ? 0 : 0.1
        }}
        className="absolute bottom-6 left-6 pointer-events-auto"
        style={{ x: position.x, y: position.y }}
      >
        <div className="relative">
          {/* 말풍선 */}
          {!isDragging && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-full left-4 mb-2 cursor-pointer"
              onClick={handleClick}
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border w-64 relative">
                <div className="text-sm text-gray-800 leading-relaxed">
                  <div className="mb-1">안녕! 나는 까우니야!</div>
                  <div className="mb-1">궁금한 게 있으면</div>
                  <div>언제든 물어봐! 💬✨</div>
                </div>
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
              </div>
            </motion.div>
          )}

          {/* 캐릭터 */}
          <motion.div
            whileHover={!isDragging ? { scale: 1.1 } : {}}
            whileTap={!isDragging ? { scale: 0.9 } : {}}
            className="w-20 h-20 cursor-pointer select-none relative"
            onClick={handleClick}
            animate={!isDragging && !isTransitioning ? { 
              y: [0, -5, 0],
            } : {}}
            transition={!isDragging && !isTransitioning ? { 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            } : {}}
            whileDrag={{ 
              scale: 1.2,
              rotate: 15,
              zIndex: 50
            }}
          >
            <img 
              src={getCharacterImage()} 
              alt="까우니 캐릭터"
              className="w-full h-full object-contain drop-shadow-lg"
              draggable={false}
            />
            
            {renderAccessories()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}