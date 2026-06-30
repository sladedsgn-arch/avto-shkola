import type {
  School, Instructor, TheoryModule, Achievement, Sign, Payment, Lesson
} from '../types'
import { seedQuestions } from './questions'

export { seedQuestions }

export const seedSchools: School[] = [
  { id: 1, name: 'Автошкола «Магистраль»', address: 'г. Москва, ул. Ленина, 42', phone: '+7 (495) 123-45-67' }
]

export const seedInstructors: Instructor[] = [
  { id: 1, school_id: 1, full_name: 'Александр Игоревич Петров', phone: '+7 (903) 111-22-33', car_model: 'Lada Granta', gear_type: 'МКПП', rating: 4.9 },
  { id: 2, school_id: 1, full_name: 'Наталья Сергеевна Иванова', phone: '+7 (903) 444-55-66', car_model: 'Hyundai Solaris', gear_type: 'АКПП', rating: 4.8 },
  { id: 3, school_id: 1, full_name: 'Дмитрий Олегович Сидоров', phone: '+7 (903) 777-88-99', car_model: 'Kia Rio', gear_type: 'МКПП', rating: 4.7 }
]

export const seedModules: TheoryModule[] = [
  { id: 1, title: 'Дорожные знаки', total_lessons: 8, estimated_time: '2 ч 30 мин', tag: 'знаки', sort_order: 1, description: 'Изучите все группы дорожных знаков: предупреждающие, запрещающие, предписывающие и информационные.' },
  { id: 2, title: 'Дорожная разметка', total_lessons: 5, estimated_time: '1 ч 20 мин', tag: 'разметка', sort_order: 2, description: 'Горизонтальная и вертикальная разметка, её значение и правила применения.' },
  { id: 3, title: 'Перекрёстки', total_lessons: 7, estimated_time: '2 ч 00 мин', tag: 'перекрёстки', sort_order: 3, description: 'Правила проезда регулируемых и нерегулируемых перекрёстков, круговое движение.' },
  { id: 4, title: 'Обгон и опережение', total_lessons: 5, estimated_time: '1 ч 30 мин', tag: 'обгон', sort_order: 4, description: 'Когда обгон разрешён, запрещён, и как его выполнять безопасно.' },
  { id: 5, title: 'Скорость движения', total_lessons: 4, estimated_time: '1 ч 00 мин', tag: 'скорость', sort_order: 5, description: 'Ограничения скорости на разных типах дорог, ответственность за превышение.' },
  { id: 6, title: 'Остановка и стоянка', total_lessons: 5, estimated_time: '1 ч 15 мин', tag: 'стоянка', sort_order: 6, description: 'Правила остановки и стоянки, запрещённые места, знаки.' }
]

export const seedAchievements: Achievement[] = [
  { id: 1, title: 'Первый экзамен', description: 'Сдайте первый экзамен ГИБДД', icon: '🏆', condition_key: 'first_exam_passed' },
  { id: 2, title: 'Недельная серия', description: 'Занимайтесь 7 дней подряд', icon: '🔥', condition_key: 'streak_7' },
  { id: 3, title: 'Коллекционер знаков', description: 'Добавьте 20 знаков в закладки', icon: '📚', condition_key: 'bookmarks_20' },
  { id: 4, title: '100 вопросов', description: 'Ответьте на 100 вопросов', icon: '💯', condition_key: 'questions_100' },
  { id: 5, title: 'Идеальный результат', description: 'Сдайте экзамен без ошибок (20/20)', icon: '⭐', condition_key: 'perfect_exam' },
  { id: 6, title: 'Почти готов', description: 'Достигните готовности 90%', icon: '🚗', condition_key: 'readiness_90' }
]

export const seedSigns: Sign[] = [
  // 1. Предупреждающие
  { id: 1, category: 'Предупреждающие', name: 'Опасный поворот', code: '1.11.1', description: 'Закругление дороги малого радиуса вправо', image_url: '' },
  { id: 2, category: 'Предупреждающие', name: 'Опасный поворот', code: '1.11.2', description: 'Закругление дороги малого радиуса влево', image_url: '' },
  { id: 3, category: 'Предупреждающие', name: 'Крутой спуск', code: '1.13', description: 'Предупреждение о крутом спуске', image_url: '' },
  { id: 4, category: 'Предупреждающие', name: 'Крутой подъём', code: '1.14', description: 'Предупреждение о крутом подъёме', image_url: '' },
  { id: 5, category: 'Предупреждающие', name: 'Скользкая дорога', code: '1.15', description: 'Участок дороги с повышенной скользкостью', image_url: '' },
  { id: 6, category: 'Предупреждающие', name: 'Неровная дорога', code: '1.16', description: 'Участок дороги с неровностями', image_url: '' },
  { id: 7, category: 'Предупреждающие', name: 'Пешеходный переход', code: '1.22', description: 'Приближение к нерегулируемому пешеходному переходу', image_url: '' },
  { id: 8, category: 'Предупреждающие', name: 'Дети', code: '1.23', description: 'Участок вблизи школы или детского учреждения', image_url: '' },
  { id: 9, category: 'Предупреждающие', name: 'Железнодорожный переезд', code: '1.3.1', description: 'Однопутный железнодорожный переезд', image_url: '' },
  { id: 10, category: 'Предупреждающие', name: 'Пересечение с велодорожкой', code: '1.24', description: 'Пересечение с велосипедной дорожкой', image_url: '' },
  // 2. Запрещающие
  { id: 11, category: 'Запрещающие', name: 'Въезд запрещён', code: '3.1', description: 'Запрещает въезд всем транспортным средствам', image_url: '' },
  { id: 12, category: 'Запрещающие', name: 'Движение запрещено', code: '3.2', description: 'Запрещает движение всем ТС в обоих направлениях', image_url: '' },
  { id: 13, category: 'Запрещающие', name: 'Обгон запрещён', code: '3.20', description: 'Запрещает обгон всех ТС, кроме тихоходных', image_url: '' },
  { id: 14, category: 'Запрещающие', name: 'Остановка запрещена', code: '3.27', description: 'Запрещает остановку и стоянку', image_url: '' },
  { id: 15, category: 'Запрещающие', name: 'Стоянка запрещена', code: '3.28', description: 'Запрещает стоянку, остановка разрешена', image_url: '' },
  { id: 16, category: 'Запрещающие', name: 'Ограничение скорости', code: '3.24', description: 'Запрещает движение со скоростью выше указанной', image_url: '' },
  { id: 17, category: 'Запрещающие', name: 'Разворот запрещён', code: '3.19', description: 'Запрещает разворот', image_url: '' },
  { id: 18, category: 'Запрещающие', name: 'Поворот налево запрещён', code: '3.18.1', description: 'Запрещает поворот налево', image_url: '' },
  // 3. Предписывающие
  { id: 19, category: 'Предписывающие', name: 'Движение прямо', code: '4.1.1', description: 'Обязывает двигаться только прямо', image_url: '' },
  { id: 20, category: 'Предписывающие', name: 'Движение направо', code: '4.1.2', description: 'Обязывает двигаться только направо', image_url: '' },
  { id: 21, category: 'Предписывающие', name: 'Круговое движение', code: '4.3', description: 'Обязывает двигаться в направлении стрелок', image_url: '' },
  { id: 22, category: 'Предписывающие', name: 'Велосипедная дорожка', code: '4.4.1', description: 'Только для велосипедистов', image_url: '' },
  { id: 23, category: 'Предписывающие', name: 'Пешеходная дорожка', code: '4.5.1', description: 'Только для пешеходов', image_url: '' },
  // 4. Информационные
  { id: 24, category: 'Информационные', name: 'Автомагистраль', code: '5.1', description: 'Начало автомагистрали', image_url: '' },
  { id: 25, category: 'Информационные', name: 'Конец автомагистрали', code: '5.2', description: 'Конец автомагистрали', image_url: '' },
  { id: 26, category: 'Информационные', name: 'Дорога с односторонним движением', code: '5.5', description: 'Движение в одном направлении', image_url: '' },
  { id: 27, category: 'Информационные', name: 'Населённый пункт', code: '5.23.1', description: 'Начало населённого пункта', image_url: '' },
  { id: 28, category: 'Информационные', name: 'Конец населённого пункта', code: '5.24.1', description: 'Конец населённого пункта', image_url: '' },
  { id: 29, category: 'Информационные', name: 'Жилая зона', code: '5.21', description: 'Начало жилой зоны', image_url: '' },
  { id: 30, category: 'Информационные', name: 'Место стоянки', code: '6.4', description: 'Специально отведённое место для парковки', image_url: '' },
  // 5. Приоритета
  { id: 31, category: 'Приоритета', name: 'Главная дорога', code: '2.1', description: 'Водитель пользуется преимуществом на перекрёстках', image_url: '' },
  { id: 32, category: 'Приоритета', name: 'Конец главной дороги', code: '2.2', description: 'Конец главной дороги', image_url: '' },
  { id: 33, category: 'Приоритета', name: 'Уступите дорогу', code: '2.4', description: 'Водитель обязан уступить дорогу', image_url: '' },
  { id: 34, category: 'Приоритета', name: 'Движение без остановки запрещено', code: '2.5', description: 'Обязывает остановиться перед стоп-линией', image_url: '' }
]

export const seedLessons = (userId: number): Lesson[] => {
  const now = new Date()
  const d = (days: number, h = 10, m = 0) => {
    const dt = new Date(now)
    dt.setDate(dt.getDate() + days)
    dt.setHours(h, m, 0, 0)
    return dt.toISOString()
  }
  return [
    { id: 1, user_id: userId, instructor_id: 1, lesson_type: 'driving', scheduled_at: d(1, 10), duration_min: 60, place: 'Площадка №1, ул. Строителей', status: 'soon' },
    { id: 2, user_id: userId, instructor_id: 1, lesson_type: 'driving', scheduled_at: d(3, 14), duration_min: 60, place: 'Площадка №1, ул. Строителей', status: 'soon' },
    { id: 3, user_id: userId, instructor_id: 2, lesson_type: 'theory', scheduled_at: d(-1, 16), duration_min: 45, place: 'Учебный класс 3', status: 'done' },
    { id: 4, user_id: userId, instructor_id: 1, lesson_type: 'driving', scheduled_at: d(-3, 9), duration_min: 60, place: 'Городской маршрут', status: 'done' },
    { id: 5, user_id: userId, instructor_id: 3, lesson_type: 'driving', scheduled_at: d(7, 11), duration_min: 60, place: 'Городской маршрут', status: 'soon' }
  ]
}

export const seedPayment = (userId: number): Payment => ({
  id: 1,
  user_id: userId,
  amount: 15000,
  total_cost: 45000,
  paid_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'paid',
  description: 'Обучение категория B, пакет «Стандарт»'
})
