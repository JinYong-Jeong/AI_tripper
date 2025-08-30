// Supabase 클라이언트 설정
const supabaseUrl = 'https://tjegasrntxhldndtmzfb.supabase.co'
const supabaseAnonKey = 'your_anon_key_here' // 이 부분을 실제 anon key로 교체해야 합니다

// 환경변수에서 데이터베이스 연결 문자열 가져오기 (타입 단언 사용)
export const DATABASE_URL = (import.meta as any).env?.VITE_DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.tjegasrntxhldndtmzfb.supabase.co:5432/postgres'

// Supabase 클라이언트 활성화
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
