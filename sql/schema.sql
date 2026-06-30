-- ============================================================
-- Автошкола — Схема базы данных MySQL
-- Версия: 1.0
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── 1. Автошколы ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Schools (
  id      INT          NOT NULL AUTO_INCREMENT,
  name    VARCHAR(200) NOT NULL,
  address VARCHAR(300) NOT NULL,
  phone   VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. Инструкторы ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Instructors (
  id         INT          NOT NULL AUTO_INCREMENT,
  school_id  INT          NOT NULL,
  full_name  VARCHAR(200) NOT NULL,
  phone      VARCHAR(30)  NOT NULL,
  car_model  VARCHAR(100) NOT NULL,
  gear_type  ENUM('МКПП','АКПП') NOT NULL DEFAULT 'МКПП',
  rating     DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  photo      VARCHAR(300) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_school (school_id),
  CONSTRAINT fk_instructor_school FOREIGN KEY (school_id) REFERENCES Schools(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. Пользователи ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
  id            INT          NOT NULL AUTO_INCREMENT,
  school_id     INT          NOT NULL,
  instructor_id INT          DEFAULT NULL,
  full_name     VARCHAR(200) NOT NULL,
  phone         VARCHAR(30)  NOT NULL UNIQUE COMMENT 'Используется как логин',
  password_hash VARCHAR(255) NOT NULL,
  category      ENUM('A','B','C','D') NOT NULL DEFAULT 'B',
  gearbox       ENUM('МКПП','АКПП') NOT NULL DEFAULT 'МКПП',
  driving_hours INT          NOT NULL DEFAULT 0,
  streak_count  INT          NOT NULL DEFAULT 0,
  notifications TINYINT(1)   NOT NULL DEFAULT 1,
  biometrics    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_phone (phone),
  KEY idx_school (school_id),
  KEY idx_instructor (instructor_id),
  CONSTRAINT fk_user_school      FOREIGN KEY (school_id)     REFERENCES Schools(id)     ON DELETE RESTRICT,
  CONSTRAINT fk_user_instructor  FOREIGN KEY (instructor_id) REFERENCES Instructors(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. Теоретические модули ─────────────────────────────────
CREATE TABLE IF NOT EXISTS Theory_Modules (
  id             INT         NOT NULL AUTO_INCREMENT,
  title          VARCHAR(200) NOT NULL,
  total_lessons  INT         NOT NULL DEFAULT 0,
  estimated_time VARCHAR(50) NOT NULL,
  tag            VARCHAR(50) NOT NULL,
  sort_order     INT         NOT NULL DEFAULT 0,
  description    TEXT        NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. Прогресс по теории ──────────────────────────────────
CREATE TABLE IF NOT EXISTS User_Theory_Progress (
  id           INT      NOT NULL AUTO_INCREMENT,
  user_id      INT      NOT NULL,
  module_id    INT      NOT NULL,
  done         TINYINT(1) NOT NULL DEFAULT 0,
  completed_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_module (user_id, module_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_progress_user   FOREIGN KEY (user_id)   REFERENCES Users(id)          ON DELETE CASCADE,
  CONSTRAINT fk_progress_module FOREIGN KEY (module_id) REFERENCES Theory_Modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. Вопросы ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Questions (
  id             INT  NOT NULL AUTO_INCREMENT,
  module_id      INT  NOT NULL,
  text           TEXT NOT NULL,
  image_tag      VARCHAR(100) DEFAULT NULL,
  option_1       TEXT NOT NULL,
  option_2       TEXT NOT NULL,
  option_3       TEXT NOT NULL,
  correct_option TINYINT NOT NULL CHECK (correct_option IN (1,2,3)),
  explanation    TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_module (module_id),
  CONSTRAINT fk_question_module FOREIGN KEY (module_id) REFERENCES Theory_Modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 7. Экзаменационные сессии ──────────────────────────────
CREATE TABLE IF NOT EXISTS Exam_Sessions (
  id            INT      NOT NULL AUTO_INCREMENT,
  user_id       INT      NOT NULL,
  mode          ENUM('ticket','exam','marathon','random','errors') NOT NULL,
  score         INT      NOT NULL DEFAULT 0,
  total         INT      NOT NULL DEFAULT 0,
  passed        TINYINT(1) NOT NULL DEFAULT 0,
  ticket_number INT      DEFAULT NULL,
  started_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at   DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_user (user_id),
  KEY idx_started (started_at),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. Ответы на экзамене ───────────────────────────────────
CREATE TABLE IF NOT EXISTS Exam_Answers (
  id             INT      NOT NULL AUTO_INCREMENT,
  session_id     INT      NOT NULL,
  question_id    INT      NOT NULL,
  chosen_option  TINYINT  NOT NULL CHECK (chosen_option IN (1,2,3)),
  is_correct     TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_session  (session_id),
  KEY idx_question (question_id),
  CONSTRAINT fk_answer_session  FOREIGN KEY (session_id)  REFERENCES Exam_Sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES Questions(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 9. Занятия ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Lessons (
  id            INT         NOT NULL AUTO_INCREMENT,
  user_id       INT         NOT NULL,
  instructor_id INT         NOT NULL,
  lesson_type   ENUM('driving','theory') NOT NULL DEFAULT 'driving',
  scheduled_at  DATETIME    NOT NULL,
  duration_min  INT         NOT NULL DEFAULT 60,
  place         VARCHAR(300) NOT NULL,
  status        ENUM('soon','done','cancelled') NOT NULL DEFAULT 'soon',
  PRIMARY KEY (id),
  KEY idx_user       (user_id),
  KEY idx_instructor (instructor_id),
  KEY idx_scheduled  (scheduled_at),
  CONSTRAINT fk_lesson_user       FOREIGN KEY (user_id)       REFERENCES Users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_lesson_instructor FOREIGN KEY (instructor_id) REFERENCES Instructors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 10. Достижения ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Achievements (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(200) NOT NULL,
  description   TEXT         NOT NULL,
  icon          VARCHAR(10)  NOT NULL COMMENT 'Emoji',
  condition_key VARCHAR(50)  NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 11. Достижения пользователей ───────────────────────────
CREATE TABLE IF NOT EXISTS User_Achievements (
  id             INT      NOT NULL AUTO_INCREMENT,
  user_id        INT      NOT NULL,
  achievement_id INT      NOT NULL,
  unlocked_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_ach (user_id, achievement_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_ua_user FOREIGN KEY (user_id)        REFERENCES Users(id)        ON DELETE CASCADE,
  CONSTRAINT fk_ua_ach  FOREIGN KEY (achievement_id) REFERENCES Achievements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 12. Дорожные знаки ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS Signs (
  id          INT          NOT NULL AUTO_INCREMENT,
  category    VARCHAR(100) NOT NULL,
  name        VARCHAR(200) NOT NULL,
  code        VARCHAR(20)  NOT NULL UNIQUE,
  description TEXT         NOT NULL,
  image_url   VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 13. Закладки знаков ────────────────────────────────────
CREATE TABLE IF NOT EXISTS Sign_Bookmarks (
  id         INT      NOT NULL AUTO_INCREMENT,
  user_id    INT      NOT NULL,
  sign_id    INT      NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_sign (user_id, sign_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bm_sign FOREIGN KEY (sign_id) REFERENCES Signs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 14. Оплата ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Payments (
  id          INT            NOT NULL AUTO_INCREMENT,
  user_id     INT            NOT NULL,
  amount      DECIMAL(10,2)  NOT NULL COMMENT 'Сумма текущего платежа',
  total_cost  DECIMAL(10,2)  NOT NULL COMMENT 'Полная стоимость обучения',
  description VARCHAR(300)   NOT NULL,
  status      ENUM('pending','paid','overdue') NOT NULL DEFAULT 'pending',
  paid_at     DATETIME       DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_user   (user_id),
  KEY idx_status (status),
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
