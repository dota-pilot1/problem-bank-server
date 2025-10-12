-- Math Test Sessions 테이블
CREATE TABLE IF NOT EXISTS math_test_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  test_set_id INTEGER NOT NULL REFERENCES math_test_sets(id),
  status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
  current_question_index INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Math User Answers 테이블
CREATE TABLE IF NOT EXISTS math_user_answers (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES math_test_sessions(id),
  problem_id INTEGER NOT NULL REFERENCES math_problems(id),
  user_answer VARCHAR(500) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_seconds INTEGER,
  answered_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- English Test Sessions 테이블
CREATE TABLE IF NOT EXISTS english_test_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  test_set_id INTEGER NOT NULL REFERENCES english_test_sets(id),
  status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
  current_question_index INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- English User Answers 테이블
CREATE TABLE IF NOT EXISTS english_user_answers (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES english_test_sessions(id),
  problem_id INTEGER NOT NULL REFERENCES english_problems(id),
  user_answer VARCHAR(500) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_seconds INTEGER,
  answered_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_math_test_sessions_user_id ON math_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_math_test_sessions_test_set_id ON math_test_sessions(test_set_id);
CREATE INDEX IF NOT EXISTS idx_math_user_answers_session_id ON math_user_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_english_test_sessions_user_id ON english_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_english_test_sessions_test_set_id ON english_test_sessions(test_set_id);
CREATE INDEX IF NOT EXISTS idx_english_user_answers_session_id ON english_user_answers(session_id);
