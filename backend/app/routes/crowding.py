from fastapi import APIRouter, Query
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
from app.core.supabase_client import get_supabase_client

router = APIRouter()

# 임시 혼잡도 데이터 (실제로는 DB에서 가져와야 함)
def get_mock_crowding_data():
    """임시 혼잡도 데이터 생성 (실제로는 DB에서 가져와야 함)"""
    locations = [
        {
            "id": "science-museum",
            "name": "국립중앙과학관",
            "category": "museum",
            "areas": [
                {"id": "natural", "name": "자연사관", "max_capacity": 500},
                {"id": "human", "name": "인류관", "max_capacity": 400},
                {"id": "astronomy", "name": "천체관", "max_capacity": 200},
                {"id": "children", "name": "어린이과학관", "max_capacity": 300}
            ]
        },
        {
            "id": "central-market",
            "name": "대전중앙시장",
            "category": "market",
            "areas": [
                {"id": "area1", "name": "1구역", "max_capacity": 200},
                {"id": "area2", "name": "2구역", "max_capacity": 200},
                {"id": "area3", "name": "3구역", "max_capacity": 200},
                {"id": "area4", "name": "4구역", "max_capacity": 200},
                {"id": "area5", "name": "5구역", "max_capacity": 200},
                {"id": "area6", "name": "6구역", "max_capacity": 200}
            ]
        },
        {
            "id": "expo-park",
            "name": "엑스포과학공원",
            "category": "park",
            "areas": [
                {"id": "main", "name": "메인광장", "max_capacity": 1000},
                {"id": "garden", "name": "정원", "max_capacity": 500}
            ]
        }
    ]
    
    # 현재 시간 기준으로 혼잡도 시뮬레이션
    now = datetime.now()
    hour = now.hour
    
    # 시간대별 혼잡도 패턴 (오전 10-12시, 오후 2-6시가 혼잡)
    if 10 <= hour <= 12 or 14 <= hour <= 18:
        base_crowding = 0.7  # 70% 기본 혼잡도
    elif 12 <= hour <= 14:
        base_crowding = 0.9  # 점심시간 90%
    else:
        base_crowding = 0.3  # 그 외 시간 30%
    
    # 랜덤 변동 추가 (±20%)
    variation = random.uniform(-0.2, 0.2)
    current_crowding = max(0.1, min(0.95, base_crowding + variation))
    
    result = []
    for location in locations:
        location_data = {
            "id": location["id"],
            "name": location["name"],
            "category": location["category"],
            "total_visitors": 0,
            "total_capacity": 0,
            "congestion_level": "low",
            "areas": [],
            "updated_at": now.isoformat()
        }
        
        for area in location["areas"]:
            # 각 구역별로 약간 다른 혼잡도
            area_variation = random.uniform(-0.1, 0.1)
            area_crowding = max(0.05, min(0.95, current_crowding + area_variation))
            current_visitors = int(area["max_capacity"] * area_crowding)
            
            # 혼잡도 레벨 결정
            if area_crowding < 0.4:
                congestion_level = "low"
            elif area_crowding < 0.7:
                congestion_level = "medium"
            else:
                congestion_level = "high"
            
            area_data = {
                "id": area["id"],
                "name": area["name"],
                "current_visitors": current_visitors,
                "max_capacity": area["max_capacity"],
                "congestion_level": congestion_level,
                "crowding_ratio": round(area_crowding, 2)
            }
            
            location_data["areas"].append(area_data)
            location_data["total_visitors"] += current_visitors
            location_data["total_capacity"] += area["max_capacity"]
        
        # 전체 혼잡도 레벨 결정
        total_ratio = location_data["total_visitors"] / location_data["total_capacity"]
        if total_ratio < 0.4:
            location_data["congestion_level"] = "low"
        elif total_ratio < 0.7:
            location_data["congestion_level"] = "medium"
        else:
            location_data["congestion_level"] = "high"
        
        result.append(location_data)
    
    return result

@router.get("/crowding")
async def get_crowding_data(location_id: str = Query(None, description="특정 장소 ID (선택사항)")):
    """실시간 혼잡도 데이터 조회"""
    try:
        # 실제 DB 연동 시 여기서 Supabase에서 데이터 조회
        # sb = get_supabase_client()
        # result = sb.table("crowding_data").select("*").execute()
        
        # 임시로 목 데이터 반환
        all_data = get_mock_crowding_data()
        
        if location_id:
            # 특정 장소 필터링
            filtered_data = [loc for loc in all_data if loc["id"] == location_id]
            if not filtered_data:
                return {"error": f"Location {location_id} not found"}
            return {"data": filtered_data[0]}
        
        return {"data": all_data}
    
    except Exception as e:
        return {"error": str(e)}

@router.get("/crowding/{location_id}")
async def get_crowding_by_location(location_id: str):
    """특정 장소의 혼잡도 데이터 조회"""
    return await get_crowding_data(location_id=location_id)
