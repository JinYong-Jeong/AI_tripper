import React, { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import MapPage from './components/MapPage';
import StampPage from './components/StampPage';
import DaejeonStampPage from './components/DaejeonStampPage';
import ChatBotPage from './components/ChatBotPage';
import GusukTourDaejeonPage from './components/GusukTourDaejeonPage';
import GusukTourMainPage from './components/GusukTourMainPage';
import GusukShopPage from './components/GusukShopPage';
import TourGuidePage from './components/TourGuidePage';
import NationalScienceMuseumGuidePage from './components/NationalScienceMuseumGuidePage';
import DaejeonCentralMarketPage from './components/DaejeonCentralMarketPage';
import DaejeonCentralMarketGuidePage from './components/DaejeonCentralMarketGuidePage';
import NFCSuccessModal from './components/NFCSuccessModal';
import NFCComicModal from './components/NFCComicModal';

import CouponPage from './components/CouponPage';
import CharacterHelper from './components/CharacterHelper';

// 타입 정의
export type PageType = 'main' | 'map' | 'stamp' | 'national-stamp' | 'daejeon-stamp' | 'chatbot' | 'congestion-chat' | 'gusuk-tour-main' | 'gusuk-tour-daejeon' | 'gusuk-shop' | 'tour-guide' | 'national-science-museum-guide' | 'daejeon-central-market' | 'daejeon-central-market-guide' | 'daejeon-central-market-stamp' | 'coupon' | 'nfc-success' | 'nfc-comic';

export interface WearableItem {
  id: number;
  name: string;
  type: 'hat' | 'glasses' | 'labcoat' | 'accessory';
  equipped: boolean;
}

export type CharacterState = 'normal' | 'peek-left' | 'peek-right' | 'congestion-alert';

export interface CharacterPosition {
  x: number;
  y: number;
}

// 상수
const HIDDEN_CHARACTER_PAGES: PageType[] = ['chatbot', 'congestion-chat', 'gusuk-tour-main', 'nfc-success', 'nfc-comic'];

export default function App() {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState<PageType>('gusuk-tour-main'); // 원래대로 지역 선택 페이지부터 시작
  const [characterState, setCharacterState] = useState<CharacterState>('normal');
  const [characterPosition, setCharacterPosition] = useState<CharacterPosition>({ x: 0, y: 0 });
  const [previousPage, setPreviousPage] = useState<PageType>('gusuk-tour-main');
  const [chatbotContext, setChatbotContext] = useState<PageType>('gusuk-tour-main');
  const [stampContext, setStampContext] = useState<PageType>('main');
  const [equippedItems, setEquippedItems] = useState<WearableItem[]>([]);
  const [chatbotEntryState, setChatbotEntryState] = useState<{
    state: CharacterState;
    position: CharacterPosition;
  } | null>(null);
  // NFC 관련 상태
  const [shouldTriggerStampSuccess, setShouldTriggerStampSuccess] = useState(false);

  // 페이지 변경 시 캐릭터 상태 관리
  useEffect(() => {
    if (previousPage === currentPage) return;

    const wasCharacterHidden = HIDDEN_CHARACTER_PAGES.includes(previousPage);
    const isCharacterVisible = !HIDDEN_CHARACTER_PAGES.includes(currentPage);
    
    // 지역선택 완료 후 캐릭터 초기화
    if (previousPage === 'gusuk-tour-main' && isCharacterVisible) {
      setCharacterState('normal');
      setCharacterPosition({ x: 0, y: 0 });
      console.log('🎭 지역선택 완료 - 캐릭터 초기화');
    }
    // 챗봇에서 복귀 시 이전 상태로 복원
    else if ((previousPage === 'chatbot' || previousPage === 'congestion-chat') && isCharacterVisible) {
      if (chatbotEntryState) {
        // 챗봇 진입 전 상태로 복원
        setCharacterState(chatbotEntryState.state);
        setCharacterPosition(chatbotEntryState.position);
        console.log('🎭 챗봇 복귀 - 이전 상태 복원:', chatbotEntryState.state);
        setChatbotEntryState(null); // 복원 후 초기화
      } else {
        // 기본값: 왼쪽 빢꼼
        const screen = { width: window.innerWidth, height: window.innerHeight };
        const peekY = Math.max(50, Math.min(screen.height - 130, screen.height * 0.4));
        setCharacterState('peek-left');
        setCharacterPosition({ x: -45, y: peekY });
        console.log('🎭 챗봇 복귀 - 기본 왼쪽 빢꼼');
      }
    }
    // 페이지 간 이동 시 캐릭터 상태 유지 (오른쪽 빢꼼도 그대로 유지)
  }, [currentPage, previousPage]);

  // 커스텀 이벤트 리스너
  useEffect(() => {
    const handleNavigateEvent = (event: CustomEvent) => {
      handleNavigate(event.detail as PageType);
    };

    window.addEventListener('navigate', handleNavigateEvent as EventListener);
    return () => window.removeEventListener('navigate', handleNavigateEvent as EventListener);
  }, []);

  // 네비게이션 핸들러들
  const handleNavigate = (page: PageType) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  // NFC 관련 핸들러들
  const handleNFCDemo = () => {
    setPreviousPage(currentPage);
    setCurrentPage('nfc-success');
  };

  const handleNFCSuccessConfirm = () => {
    setPreviousPage(currentPage);
    setCurrentPage('nfc-comic');
  };

  const handleNFCComicClose = () => {
    // 인류관 스탬프 성공을 트리거하고 스탬프 페이지로 이동
    setShouldTriggerStampSuccess(true);
    setPreviousPage(currentPage);
    setCurrentPage('stamp');
  };

  const handleNFCComicSave = () => {
    alert('네컷 만화가 저장되었습니다! 📱✨');
  };

  const handleNFCComicShare = () => {
    alert('네컷 만화가 공유되었습니다! 📤🎉');
  };

  const handleChatOpen = () => {
    // 챗봇 진입 전 캐릭터 상태 저장
    setChatbotEntryState({
      state: characterState,
      position: characterPosition
    });
    console.log('💬 챗봇 진입 - 현재 상태 저장:', { state: characterState, position: characterPosition });
    
    setChatbotContext(currentPage);
    setPreviousPage(currentPage);
    setCurrentPage('chatbot');
  };

  const handleCongestionAlert = () => {
    // 현재 상태를 저장하고 혼잡 알림 상태로 변경
    setChatbotEntryState({
      state: characterState,
      position: characterPosition
    });
    console.log('🚨 혼잡 알림 - 현재 상태 저장:', { state: characterState, position: characterPosition });
    
    // 화면 정중앙 좌표 계산 (절대 위치)
    const screen = { width: window.innerWidth, height: window.innerHeight };
    const CHARACTER_SIZE = 96; // 혼잡 모드에서 더 큰 사이즈 (24*1.3*3 = 96px)
    
    // 화면 정중앙에 캐릭터가 위치하도록 절대 좌표 계산
    const centerX = (screen.width - CHARACTER_SIZE) / 2;
    const centerY = (screen.height - CHARACTER_SIZE) / 2;
    
    console.log('🎯 화면 정중앙 좌표 계산:', {
      screenSize: screen,
      characterSize: CHARACTER_SIZE,
      centerPosition: { x: centerX, y: centerY }
    });
    
    setCharacterState('congestion-alert');
    setCharacterPosition({ x: centerX, y: centerY });
  };

  const handleCongestionChatOpen = () => {
    // 혼잡도 챗봇 진입 (이미 상태는 저장되어 있음)
    console.log('🚨 혼잡도 챗봇 진입');
    
    setChatbotContext(currentPage);
    setPreviousPage(currentPage);
    setCurrentPage('congestion-chat');
  };

  const handleCongestionDismiss = () => {
    // 혼잡 알림 해제 - 이전 상태로 복원
    if (chatbotEntryState) {
      setCharacterState(chatbotEntryState.state);
      setCharacterPosition(chatbotEntryState.position);
      console.log('🚨 혼잡 알림 해제 - 이전 상태 복원:', chatbotEntryState.state);
      setChatbotEntryState(null);
    } else {
      // 기본값으로 복원
      setCharacterState('normal');
      setCharacterPosition({ x: 0, y: 0 });
      console.log('🚨 혼잡 알림 해제 - 기본 상태로 복원');
    }
  };

  const handleChatBack = () => {
    setPreviousPage(currentPage);
    setCurrentPage(chatbotContext);
  };

  const handleDaejeonToNationalStamp = () => {
    setStampContext('daejeon-stamp');
    setPreviousPage(currentPage);
    setCurrentPage('national-stamp');
  };

  const handleNationalStampBack = () => {
    setPreviousPage(currentPage);
    setCurrentPage(stampContext);
    setStampContext('main');
  };

  const handleToNationalStamp = (fromPage: PageType) => {
    setStampContext(fromPage);
    setPreviousPage(currentPage);
    setCurrentPage('national-stamp');
  };

  // 아이템 관리
  const handleItemEquip = (item: WearableItem, equip: boolean) => {
    setEquippedItems(prev => {
      if (equip) {
        const filtered = prev.filter(equipped => equipped.type !== item.type);
        return [...filtered, { ...item, equipped: true }];
      }
      return prev.filter(equipped => equipped.id !== item.id);
    });
  };

  // 캐릭터 상태 변경
  const handleCharacterStateChange = (state: CharacterState, position?: CharacterPosition) => {
    setCharacterState(state);
    if (position) setCharacterPosition(position);
  };

  // 페이지 렌더링
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapPage onBack={() => handleNavigate('main')} onGusukTour={() => handleNavigate('gusuk-tour-daejeon')} />;
      
      case 'stamp':
        return (
          <StampPage 
            onBack={() => handleNavigate('main')}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')}
            fromDaejeon={false}
            fromMenu={false}
            initialView="stamp"
            shouldTriggerStampSuccess={shouldTriggerStampSuccess}
            onStampSuccessComplete={() => setShouldTriggerStampSuccess(false)}
          />
        );
      
      case 'national-stamp':
        return (
          <StampPage 
            onBack={handleNationalStampBack}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')}
            fromDaejeon={stampContext === 'daejeon-stamp'}
            fromMenu={stampContext !== 'daejeon-stamp'}
            initialView="national"
          />
        );
      
      case 'daejeon-stamp':
        return (
          <DaejeonStampPage 
            onBack={() => handleNavigate('gusuk-tour-daejeon')} 
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')}
            onNationalView={handleDaejeonToNationalStamp}
          />
        );
      
      case 'chatbot':
        return (
          <ChatBotPage 
            onBack={handleChatBack}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')} 
            context={chatbotContext}
            onNavigate={handleNavigate}
            equippedItems={equippedItems}
          />
        );

      case 'congestion-chat':
        return (
          <ChatBotPage 
            onBack={handleChatBack}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')} 
            context="congestion"
            onNavigate={handleNavigate}
            equippedItems={equippedItems}
          />
        );
      
      case 'nfc-success':
        return (
          <NFCSuccessModal 
            onConfirm={handleNFCSuccessConfirm}
          />
        );
      
      case 'nfc-comic':
        return (
          <NFCComicModal 
            onClose={handleNFCComicClose}
            onSave={handleNFCComicSave}
            onShare={handleNFCComicShare}
          />
        );
      
      case 'gusuk-tour-main':
        return (
          <GusukTourMainPage 
            onNavigate={(page) => {
              if (page === 'national-stamp') {
                handleToNationalStamp('gusuk-tour-main');
              } else {
                handleNavigate(page);
              }
            }}
            onNFCDemo={handleNFCDemo} // NFC 데모 핸들러 추가
          />
        );
      
      case 'gusuk-tour-daejeon':
        return (
          <GusukTourDaejeonPage 
            onNavigate={(page) => {
              if (page === 'national-stamp') {
                handleToNationalStamp('gusuk-tour-daejeon');
              } else {
                handleNavigate(page);
              }
            }} 
          />
        );
      
      case 'gusuk-shop':
        return (
          <GusukShopPage 
            onBack={() => handleNavigate('gusuk-tour-main')} 
            equippedItems={equippedItems}
            onItemEquip={handleItemEquip}
          />
        );
      
      case 'tour-guide':
        return <TourGuidePage onBack={() => handleNavigate('gusuk-tour-daejeon')} />;
      
      case 'national-science-museum-guide':
        return <NationalScienceMuseumGuidePage onBack={() => handleNavigate(previousPage)} />;
      
      case 'daejeon-central-market':
        return (
          <DaejeonCentralMarketPage 
            onNavigate={handleNavigate}
            onNationalStamp={() => handleToNationalStamp('daejeon-central-market')}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')} 
          />
        );
      
      case 'daejeon-central-market-guide':
        return (
          <DaejeonCentralMarketGuidePage 
            onBack={() => handleNavigate('daejeon-central-market')}
            onCongestionAlert={handleCongestionAlert}
          />
        );
      
      case 'daejeon-central-market-stamp':
        return (
          <StampPage 
            onBack={() => handleNavigate('daejeon-central-market')}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')}
            fromDaejeon={false}
            fromMenu={false}
            initialView="market"
          />
        );
      
      case 'coupon':
        return <CouponPage onBack={() => handleNavigate(previousPage)} />;
      
      default:
        return (
          <MainPage 
            onNavigate={handleNavigate}
            onNationalStamp={() => handleToNationalStamp('main')}
            onGusukTour={() => handleNavigate('gusuk-tour-daejeon')}
          />
        );
    }
  };

  const shouldShowCharacter = !HIDDEN_CHARACTER_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-purple-300 relative overflow-hidden">
      {renderCurrentPage()}
      
      {shouldShowCharacter && (
        <CharacterHelper 
          onChatOpen={handleChatOpen}
          onStateChange={handleCharacterStateChange}
          characterState={characterState}
          characterPosition={characterPosition}
          equippedItems={equippedItems}
          onCongestionChatOpen={handleCongestionChatOpen}
          onCongestionDismiss={handleCongestionDismiss}
        />
      )}
    </div>
  );
}