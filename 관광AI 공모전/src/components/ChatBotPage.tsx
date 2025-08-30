import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Send, Sparkles, ShoppingBag, Award, Activity, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { PageType, WearableItem } from '../App';

// 까우니 이미지 (assets 폴더에서 가져오기)
const kawouniImage = '/src/assets/0f85bc5afb4ab9510756ee0578698ec79610af83.png';
const kawouniLabCoatImage = '/src/assets/ad33722c7c815572d1465ccf756f849ee774aa75.png';

interface ChatBotPageProps {
  onBack: () => void;
  onGusukTour: () => void;
  context: PageType | 'congestion'; // 혼잡도 컨텍스트 추가
  onNavigate?: (page: PageType) => void;
  equippedItems: WearableItem[];
}

interface Message {
  id: string;
  role: 'user' | 'character';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  botName: string;
  botDescription: string;
  specialties: string[];
  greeting: string;
  suggestions: string[];
  theme: {
    bg: string;
    bubble: string;
    accent: string;
    user: string;
  };
}

// 페이지별 챗봇 컨텍스트 설정
const getChatContext = (context: PageType | 'congestion'): ChatContext => {
  switch (context) {
    case 'congestion':
      return {
        botName: '까우니',
        botDescription: '혼잡도 안내 도우미',
        specialties: ['혼잡도 분석', '대체 장소 추천', '최적 시간 안내', '여행 코스 추천'],
        greeting: '안녕하세요! 까우니예요 🐧\n\n와! 지금 대전중앙시장에 사람이 정말 많네요! 😱\n\n🏃‍♀️ 현재 상황: 모든 구역이 혼잡합니다!\n\n💡 추천 방법:\n1️⃣ **시간 조정**: 저녁 8시 이후에 다시 방문\n2️⃣ **대체 장소**: 지금은 이런 곳이 좋아요!\n   • 🌳 한밭수목원 (조용한 산책)\n   • 🏛️ 대전 시립미술관 (문화체험)\n   • 🎡 엑스포과학공원 (넓은 공간)\n\n⏰ 약 2-3시간 후에 다시 오시면 훨씬 여유로워져요!\n\n📍 지금 가장 여유로운 곳은 홈커텐거리입니다!',
        suggestions: ['한밭수목원', '엑스포공원', '시립미술관', '여유시간대', '대체코스', '실시간상황'],
        theme: {
          bg: '#dc2626',
          bubble: '#991b1b',
          accent: '#ef4444',
          user: '#2563eb'
        }
      };

    case 'main':
      return {
        botName: '까우니',
        botDescription: '똑똑이 여행 친구',
        specialties: ['국립중앙과학관', '대전 관광', '맛집 추천', '교통 안내'],
        greeting: '안녕! 나는 까우니야! 🐧\n국립중앙과학관에서 함께 즐거운 시간을 보내자! 궁금한 게 있으면 뭐든 물어봐!',
        suggestions: ['인류관', '자연사관', '과학기술관', '천체관', '맛집', '교통'],
        theme: {
          bg: '#4b4a59',
          bubble: '#2b2a33',
          accent: '#3b82f6',
          user: '#2563eb'
        }
      };
    
    case 'daejeon-stamp':
      return {
        botName: '까우니',
        botDescription: '똑똑이 여행 친구',
        specialties: ['대전 관광지', '스탬프 미션', '맛집 추천', '교통 정보'],
        greeting: '안녕! 나는 까우니야! \n대전 곳곳을 함께 여행하면서 재밌는 스탬프들을 모아보자!',
        suggestions: ['한밭수목원', '엑스포공원', '중앙시장', '과학관', '맛집', '교통'],
        theme: {
          bg: '#16a34a',
          bubble: '#166534',
          accent: '#22c55e',
          user: '#2563eb'
        }
      };
    
    case 'gusuk-tour-daejeon':
    case 'tour-guide':
    default:
      return {
        botName: '까우니',
        botDescription: '똑똑이 여행 친구',
        specialties: ['대전 관광', '숨은 명소', '맛집 추천', '교통 안내'],
        greeting: '안녕! 나는 까우니야! \n대전의 숨겨진 보석같은 곳들을 함께 찾아보자! 뭐가 궁금해?',
        suggestions: ['관광지', '맛집', '카페', '쇼핑', '교통', '숙박'],
        theme: {
          bg: '#f59e0b',
          bubble: '#d97706',
          accent: '#f6b100',
          user: '#2563eb'
        }
      };
  }
};

// Fake streaming response with congestion support
async function* fakeStreamResponse(prompt: string, context: ChatContext): AsyncGenerator<string> {
  const input = prompt.toLowerCase();
  
  let response = '';
  
  // 혼잡도 컨텍스트 응답
  if (context.botDescription.includes('혼잡도 안내')) {
    if (input.includes('한밭수목원') || input.includes('수목원')) {
      response = '한밭수목원은 지금 같은 혼잡한 시간에 완벽한 대안이에요! 🌳\n\n✨ 추천 이유:\n• 넓은 공간으로 사람 밀도가 낮음\n• 야외 공간이라 답답함 없음\n• 산책하며 힐링 가능\n• 중앙시장에서 차로 15분 거리\n\n🚶‍♀️ 코스 추천:\n동원 → 열대식물원 → 약용식물원 순으로 둘러보세요!';
    } else if (input.includes('엑스포') || input.includes('과학공원')) {
      response = '엑스포과학공원도 지금 방문하기 좋은 곳이에요! 🎡\n\n✨ 혼잡 회피 포인트:\n• 넓은 야외 공간\n• 다양한 볼거리로 분산 효과\n• 한빛탑에서 대전 전망 감상\n• 중앙시장에서 20분 거리\n\n💡 팁: 한빛탑 전망대는 오후 시간대가 가장 아름다워요!';
    } else if (input.includes('시립미술관') || input.includes('미술관')) {
      response = '대전 시립미술관은 조용하고 문화적인 시간을 보내기 완벽해요! 🏛️\n\n✨ 혼잡 회피 장점:\n• 실내 전시라 쾌적함\n• 관람객 수 제한으로 여유로움\n• 문화적 경험 가능\n• 중앙시장에서 25분 거리\n\n🎨 현재 특별전도 진행 중이니 한 번 보세요!';
    } else if (input.includes('여유') || input.includes('시간대')) {
      response = '혼잡하지 않은 시간대를 알려드릴게요! ⏰\n\n🟢 여유로운 시간:\n• 오전 9-10시 (개장 직후)\n• 오후 2-4시 (점심 이후)\n• 저녁 7시 이후 (퇴근 이후)\n\n🔴 혼잡한 시간:\n• 점심시간 (11-13시)\n• 주말 오후 (13-17시)\n\n지금은 혼잡 시간이니 2-3시간 후 재방문을 추천해요!';
    } else if (input.includes('대체') || input.includes('코스')) {
      response = '혼잡 회피 대체 코스를 추천드릴게요! 🗺️\n\n📍 **2시간 대체 코스:**\n1️⃣ 한밭수목원 (1시간) 🌳\n2️⃣ 근처 카페에서 휴식 (30분) ☕\n3️⃣ 엑스포공원 전망대 (30분) 🌆\n\n📍 **3시간 여유 코스:**\n위 코스 + 시립미술관 (1시간) 🎨\n\n저녁 8시 이후에 중앙시장 재방문하면 완벽해요!';
    } else if (input.includes('실시간') || input.includes('상황')) {
      response = '현재 대전중앙시장 실시간 상황이에요! 📊\n\n🔴 **매우 혼잡:**\n• 중앙쇼핑타워 (94% 포화)\n• 먹자골목 (95% 포화)\n• 원동국제시장 (92% 포화)\n\n🟡 **보통:**\n• 홈커텐거리 (80% 포화)\n• 양키시장 (72% 포화)\n\n💡 홈커텐거리는 그나마 여유로우니 먼저 둘러보세요!';
    } else if (input.includes('안녕') || input.includes('처음')) {
      response = '혼잡한 상황에서 만나서 반가워요! 😊\n\n저는 실시간 혼잡도를 분석해서 최적의 대안을 제시하는 까우니예요!\n\n지금 같은 혼잡한 시간에는:\n🌳 한밭수목원\n🎡 엑스포과학공원\n🏛️ 시립미술관\n같은 곳들이 좋답니다!\n\n어떤 걸 도와드릴까요?';
    } else {
      response = `혼잡한 상황에서 ${input}에 대해 궁금하시는군요! 🤔\n\n저는 혼잡도 분석, 대체 장소 추천, 최적 시간 안내를 도와드릴 수 있어요!\n\n구체적으로 어떤 도움이 필요하신가요?`;
    }
  }
  // 기존 컨텍스트 응답들...
  else if (context.botDescription.includes('똑똑이 여행 친구')) {
    if (input.includes('인류관') || input.includes('인류')) {
      response = '인류관은 정말 흥미진진한 곳이야! 🧬\n\n인류의 진화 과정과 문명 발달을 한눈에 볼 수 있어.\n주요 전시로는 인류 진화 과정, 고고학 유물, 문명 발달사가 있지!\n\n지금 NFC 태그 미션도 하고 있어서 입구에서 태그하면 대전 시티투어 할인 쿠폰도 받을 수 있어!';
    } else if (input.includes('자연사관') || input.includes('공룡')) {
      response = '공룡 좋아해? 자연사관은 정말 멋져! 🦕\n\n공룡 화석 전시, 고생물 표본, 지구 역사를 다 볼 수 있어.\n공룡 퀴즈도 있는데 3문제만 맞히면 나랑 똑같은 모자를 받을 수 있어!\n\n티라노사우루스 화석이 진짜 압권이야!';
    } else if (input.includes('과학기술관') || input.includes('로봇')) {
      response = '로봇 체험은 진짜 신나! 🤖\n\n로봇 조작 체험, VR/AR 기술, 미래 기술 전시까지!\n체험존에서 로봇을 직접 조작해볼 수 있고, 완료하면 한밭수목원 입장권도 받을 수 있어.\n\n미래 기술 체험하러 함께 가자!';
    } else if (input.includes('천체관') || input.includes('플라네타리움')) {
      response = '우주는 정말 신비로워! 🌌\n\n플라네타리움 상영 시간:\n• 평일: 10:00, 14:00, 16:00\n• 주말: 10:00, 12:00, 14:00, 16:00\n\n천체 관측, 우주 과학 전시도 있고, 플라네타리움 끝까지 보면 나랑 똑같은 안경도 받을 수 있어!';
    } else if (input.includes('한밭수목원') || input.includes('수목원')) {
      response = '한밭수목원은 도심 속 힐링 스팟이야! 🌳\n\n동원 산책로, 열대식물원, 약용식물원이 있어.\n미션도 3개나 있지!\n• 동원 산책로 완주 (식물 도감)\n• 열대식물원 관람 (수목원 기념품)\n• 약용식물원 학습 (한방차 체험권)\n\n봄에 가면 꽃이 정말 예뻐!';
    } else if (input.includes('엑스포') || input.includes('과학공원')) {
      response = '엑스포 과학공원 완전 재밌어! 🎡\n\n한빛탑 전망대에서 대전 전체를 볼 수 있고,\n꿈돌이 랜드에는 신나는 놀이기구가 많아!\n엑스포 과학관 특별전도 볼 만해.\n\n미션 완료하면 전망대 기념 사진, 놀이공원 1회권, 과학 실험 키트도 받을 수 있어!';
    } else if (input.includes('중앙시장') || input.includes('시장')) {
      response = '대전중앙시장은 맛있는 천국이야! 🏪\n\n전통음식 5가지 맛보기 미션이 있는데,\n성심당 튀김소보로, 대전 칼국수, 순대국밥 등등 정말 맛있어!\n\n상인분들도 너무 친절하셔서 대화 나누는 것도 즐거워!';
    } else if (input.includes('맛집') || input.includes('음식')) {
      response = '대전 맛집 완전 많아! 🍽️\n\n• 성심당 - 대전하면 여기지!\n• 대전 칼국수 거리 - 진짜 맛있어\n• 은행동 먹자골목 - 다양한 음식\n• 중앙시장 전통음식 - 정통 맛\n\n어떤 음식이 먹고 싶어?';
    } else if (input.includes('교통') || input.includes('가는법')) {
      response = '대전 교통은 정말 편해! 🚊\n\n• 지하철 1호선 (판암↔반석)\n• KTX 대전역 - 서울에서 50분\n• 고속버스터미널 - 전국 어디든\n• 시내버스 - 시내 이동 편리\n\n어디로 가고 싶어?';
    } else if (input.includes('안녕') || input.includes('처음')) {
      response = `반가워! 나는 ${context.botName}이고 너와 함께 여행하는 똑똑이 친구야! ✨\n\n${context.specialties.join(', ')} 등등 뭐든 알고 있으니까 궁금한 게 있으면 언제든 물어봐!`;
    } else {
      response = `흥미로운 질문이네! 나는 ${context.specialties.join(', ')} 같은 것들에 대해 잘 알고 있어! 😊\n\n더 구체적으로 뭐가 궁금한지 알려줘!`;
    }
  }

  // 스트리밍 시뮬레이션
  const words = response.split(' ');
  const chunks = [];
  for (let i = 0; i < words.length; i += 3) {
    chunks.push(words.slice(i, i + 3).join(' ') + ' ');
  }
  
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    yield chunk;
  }
}

// 백엔드 API 설정
const API_BASE_URL = 'http://localhost:8000/api';

// 백엔드 API를 호출하는 함수
async function* callBackendAPI(prompt: string, context: ChatContext): AsyncGenerator<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        context: context.botDescription
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.answer || '죄송합니다. 응답을 생성할 수 없습니다.';
    
    // 스트리밍 시뮬레이션
    const words = answer.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += 3) {
      chunks.push(words.slice(i, i + 3).join(' ') + ' ');
    }
    
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      yield chunk;
    }
  } catch (error) {
    console.error('백엔드 API 호출 오류:', error);
    
    // 오류 발생 시 기본 응답
    let fallbackResponse = '';
    if (context.botDescription.includes('혼잡도 안내')) {
      fallbackResponse = '죄송합니다. 서버와의 연결에 문제가 있습니다. 혼잡도 정보를 확인할 수 없어요. 잠시 후 다시 시도해주세요.';
    } else {
      fallbackResponse = '죄송합니다. 서버와의 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
    }
    
    const words = fallbackResponse.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += 3) {
      chunks.push(words.slice(i, i + 3).join(' ') + ' ');
    }
    
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      yield chunk;
    }
  }
}

async function streamFromAI(messages: Message[], context: ChatContext) {
  const lastMessage = messages[messages.length - 1];
  return callBackendAPI(lastMessage?.content || '', context);
}

function useAutoScroll(dep: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [dep]);
  return ref;
}

function MessageBubble({ m, equippedItems }: { m: Message; equippedItems: WearableItem[] }) {
  const isUser = m.role === 'user';
  const side = isUser ? 'justify-end flex-row' : 'justify-start flex-row';
  const bubbleClass = isUser
    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
    : 'text-zinc-100 rounded-2xl rounded-bl-sm';

  // 착용된 아이템에 따라 이미지 결정
  const getBotImage = () => {
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    return hasLabCoat ? kawouniLabCoatImage : kawouniImage; // 이미지 대신 이모지 사용
  };

  return (
    <div className={`w-full flex ${side} gap-2 mb-3`}>
      <div className="shrink-0 mt-1">
        {isUser ? (
          <span className="w-8 h-8 grid place-items-center rounded-full bg-blue-600/15 text-blue-700">
            🧑🏻
          </span>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden grid place-items-center bg-amber-100 relative">
            <img src={getBotImage()} alt="까우니" className="w-full h-full object-cover" />
            {/* 액세서리 표시 (가운이 없을 때만) */}
            {!equippedItems.find(item => item.type === 'labcoat') && (
              <>
                {equippedItems.find(item => item.type === 'hat') && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs">🎩</div>
                )}
                {equippedItems.find(item => item.type === 'glasses') && (
                  <div className="absolute top-1 right-0 text-xs">🤓</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className={`max-w-[80%] px-3 py-2 shadow-sm ${bubbleClass}`} 
           style={isUser ? {} : { backgroundColor: '#2b2a33' }}>
        <div className="text-[10px] opacity-70 mb-1">
          {isUser ? 'You' : '까우니'}
        </div>
        <div className="whitespace-pre-wrap text-sm">{m.content}</div>
      </div>
    </div>
  );
}

export default function ChatBotPage({ onBack, onGusukTour, context, onNavigate, equippedItems }: ChatBotPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [scale, setScale] = useState(2);
  
  const chatContext = getChatContext(context);
  
  const canSend = input.trim().length > 0 && !loading;

  const phase = useMemo(() => {
    if (loading) return streamText ? 'speak' : 'think';
    if (input.trim()) return 'listen';
    return 'idle';
  }, [loading, streamText, input]);

  // 초기 인사말 설정
  useEffect(() => {
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      role: 'character',
      content: chatContext.greeting,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [context]);

  // 컨텍스트에 따른 스탬프 페이지 결정
  const getStampPage = (): PageType => {
    switch (context) {
      case 'main':
        return 'stamp'; // 국립중앙과학관 스탬프
      case 'gusuk-tour-daejeon':
      case 'tour-guide':
        return 'daejeon-stamp'; // 대전 전체 스탬프
      default:
        return 'stamp'; // 기본값
    }
  };

  const handleShopClick = () => {
    if (onNavigate) {
      onNavigate('gusuk-shop');
    }
  };

  const handleStampClick = () => {
    if (onNavigate) {
      onNavigate(getStampPage());
    }
  };

  async function handleSend(messageText?: string) {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;
    
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamText('');

    try {
      const stream = await streamFromAI([...messages, userMsg], chatContext);
      let acc = '';
      for await (const chunk of stream) {
        acc += chunk;
        setStreamText(acc);
      }
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'character', content: acc, timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
      setStreamText('');
    }
  }

  const base = 48;
  const size = Math.round(base * scale);

  const scroller = useAutoScroll(messages.length + (loading ? 1 : 0) + streamText.length);

  // 착용된 아이템에 따라 대화창 캐릭터 이미지 결정
  const getCharacterImage = () => {
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    return hasLabCoat ? kawouniLabCoatImage : kawouniImage; // 이미지 대신 이모지 사용
  };

  // 대화창 캐릭터의 액세서리 렌더링
  const renderCharacterAccessories = () => {
    const hasLabCoat = equippedItems.find(item => item.type === 'labcoat');
    if (hasLabCoat) return null; // 가운 착용 시 액세서리 숨김

    const accessories = [];
    
    equippedItems.forEach(item => {
      if (item.type === 'hat') {
        accessories.push(
          <div key="hat" className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xl">
            🎩
          </div>
        );
      }
      if (item.type === 'glasses') {
        accessories.push(
          <div key="glasses" className="absolute top-1/4 right-2 text-lg">
            🤓
          </div>
        );
      }
    });

    return accessories;
  };

  // 혼잡도 모드인지 확인
  const isCongestionMode = context === 'congestion';

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="px-4 py-2 flex items-center gap-3 justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              {isCongestionMode ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <Sparkles className="w-5 h-5 text-purple-600" />
              )}
              <span className="font-semibold text-gray-800">{chatContext.botName} Chat</span>
              {isCongestionMode && (
                <span className="ml-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-gmarket-medium">
                  혼잡모드
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">{chatContext.botDescription}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCongestionMode && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleShopClick}
                  className="p-2 border-gray-200 text-gray-700 hover:bg-gray-100"
                  title="상점"
                >
                  <ShoppingBag className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleStampClick}
                  className="p-2 border-gray-200 text-gray-700 hover:bg-gray-100"
                  title="스탬프"
                >
                  <Award className="w-4 h-4" />
                </Button>
              </>
            )}
            {isCongestionMode && (
              <div className="flex items-center gap-1 text-red-600">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-gmarket-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 캐릭터 영역 (심플하게) */}
      <div className="px-4 pt-6 pb-4">
        <div className="mx-auto grid place-items-center" style={{ height: size * 1.5 + 24 }}>
          <div
            className={`relative grid place-items-center select-none ${
              phase === 'idle' ? 'animate-[bob_3s_ease-in-out_infinite]' : 
              phase === 'listen' ? 'animate-[tilt_2.4s_ease-in-out_infinite]' : 
              phase === 'think' ? 'animate-[sway_1.6s_ease-in-out_infinite]' : 'animate-[speak_1s_ease-in-out_infinite]'
            } ${isCongestionMode ? 'animate-pulse' : ''}`}
            style={{ 
              width: size * 1.5, 
              height: size * 1.5
            }}
            aria-label={`character-stage ${phase}`}
          >
            <img src={getCharacterImage()} alt="까우니" className="w-full h-full object-cover" />
            {/* 착용 아이템 표시 */}
            {renderCharacterAccessories()}
            {/* 혼잡모드 경고 표시 */}
            {isCongestionMode && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                ⚠️
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <main className="flex-1 px-4 pb-2 overflow-hidden">
        <div 
          ref={scroller}
          className={`max-w-2xl mx-auto w-full h-full rounded-2xl border-2 p-4 shadow-inner overflow-y-auto ${
            isCongestionMode 
              ? 'border-red-200 bg-red-50/50' 
              : 'border-gray-200 bg-white'
          }`}
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} equippedItems={equippedItems} />
          ))}
          {loading && (
            <div className="w-full flex justify-start flex-row gap-2 mb-3">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full overflow-hidden grid place-items-center bg-amber-100 relative">
                  <img src={getCharacterImage()} alt="까우니" className="w-full h-full object-cover" />
                  {/* 로딩 중 액세서리 표시 */}
                  {!equippedItems.find(item => item.type === 'labcoat') && (
                    <>
                      {equippedItems.find(item => item.type === 'hat') && (
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs">🎩</div>
                      )}
                      {equippedItems.find(item => item.type === 'glasses') && (
                        <div className="absolute top-1 right-0 text-xs">🤓</div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div 
                className="max-w-[80%] px-3 py-2 shadow-sm text-zinc-100 rounded-2xl rounded-bl-sm" 
                style={{ backgroundColor: '#2b2a33' }}
              >
                <div className="text-[10px] opacity-70 mb-1">까우니</div>
                <div className="whitespace-pre-wrap text-sm">{streamText || '…'}</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 추천 질문 (입력창 바로 위) */}
      <div className="px-4 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {chatContext.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSend(suggestion)}
                disabled={loading}
                className={`px-2 py-1 text-xs rounded-lg transition-colors disabled:opacity-50 text-center font-gmarket-medium ${
                  isCongestionMode
                    ? 'bg-red-100 hover:bg-red-200 text-red-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className={`p-4 border-t bg-white/80 backdrop-blur-xl ${
        isCongestionMode ? 'border-red-200' : 'border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto grid grid-cols-[1fr_auto] gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isCongestionMode ? "혼잡도에 대해 물어보세요..." : "까우니에게 메시지를 보내줘…"}
            className="min-h-[48px] resize-y rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`px-5 rounded-2xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:scale-95 transition ${
              isCongestionMode ? 'font-gmarket-bold' : ''
            }`}
            style={{ backgroundColor: chatContext.theme.bg }}
          >
            보내기
          </button>
        </div>
      </div>

      {/* Global styles for keyframe animations */}
      <style>
        {`
          @keyframes bob { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-8px); } 
          }
          @keyframes tilt { 
            0%, 100% { transform: rotate(0deg); } 
            50% { transform: rotate(-3deg); } 
          }
          @keyframes sway { 
            0% { transform: translateX(-4px); } 
            50% { transform: translateX(4px); } 
            100% { transform: translateX(-4px); } 
          }
          @keyframes speak { 
            0%, 100% { transform: scale(1); } 
            50% { transform: scale(1.03); } 
          }
        `}
      </style>
    </div>
  );
}