import type { Location } from '../types';

// Mock data matching the Django models for frontend-only development
export const MOCK_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'DeskSpace HQ',
    address: 'вул. Хрещатик, 1',
    city: 'Kyiv',
    country: 'Ukraine',
    floors: [
      {
        id: 1,
        location: 1,
        level: 1,
        name: '1-й поверх',
        map_image: null,
        spaces: [
          { id: 101, name: 'Стіл #1', description: 'Робоче місце біля вікна', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-1', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }], is_active: true, floor: 1, status: 'available' },
          { id: 102, name: 'Стіл #2', description: 'Стандартне робоче місце', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-2', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }], is_active: true, floor: 1, status: 'booked' },
          { id: 103, name: 'Стіл #3', description: 'Тихе місце', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-3', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }], is_active: true, floor: 1, status: 'available' },
          { id: 104, name: 'Стіл #4', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-4', amenities: [], is_active: true, floor: 1, status: 'available' },
          { id: 105, name: 'Стіл #5', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-5', amenities: [], is_active: false, floor: 1, status: 'closed' },
          { id: 106, name: 'Зона відпочинку', description: 'Лаунж зона', space_type: 'desk', space_type_display: 'Стіл', capacity: 4, price_per_hour: 50, svg_element_id: 'lounge-1', amenities: [{ id: 2, name: 'Кава', icon_name: 'coffee' }], is_active: true, floor: 1, status: 'available' },
        ],
      },
      {
        id: 2,
        location: 1,
        level: 2,
        name: '2-й поверх',
        map_image: null,
        spaces: [
          { id: 201, name: 'Стіл #21', description: 'Стандартне місце', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-21', amenities: [], is_active: true, floor: 2, status: 'available' },
          { id: 202, name: 'Стіл #22', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-22', amenities: [], is_active: true, floor: 2, status: 'booked' },
          { id: 203, name: 'Стіл #23', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-23', amenities: [], is_active: true, floor: 2, status: 'available' },
          { id: 204, name: 'Стіл #24', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-24', amenities: [], is_active: true, floor: 2, status: 'available' },
          { id: 211, name: 'Переговорна СИНІЙ КИТ', description: 'Велика переговорна з проектором', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 12, price_per_hour: 600, svg_element_id: 'room-blue', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 4, name: 'Дошка', icon_name: 'presentation' }, { id: 5, name: 'Відеозв\'язок', icon_name: 'video' }], is_active: true, floor: 2, status: 'available' },
          { id: 212, name: 'Переговорна ЯНТАР', description: 'Мала переговорна', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 4, price_per_hour: 280, svg_element_id: 'room-amber', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }], is_active: true, floor: 2, status: 'booked' },
        ],
      },
      {
        id: 3,
        location: 1,
        level: 3,
        name: '3-й поверх',
        map_image: null,
        spaces: [
          { id: 301, name: 'Стіл #31', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-31', amenities: [], is_active: true, floor: 3, status: 'available' },
          { id: 302, name: 'Стіл #32', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-32', amenities: [], is_active: true, floor: 3, status: 'available' },
          { id: 303, name: 'Стіл #33', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-33', amenities: [], is_active: true, floor: 3, status: 'booked' },
          { id: 304, name: 'Стіл #34', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-34', amenities: [], is_active: true, floor: 3, status: 'available' },
          { id: 305, name: 'Стіл #35', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-35', amenities: [], is_active: true, floor: 3, status: 'available' },
          { id: 311, name: 'Приватний офіс ПРЕМ\'ЄР', description: 'Закритий офіс на 3 особи', space_type: 'private_office', space_type_display: 'Приватний офіс', capacity: 3, price_per_hour: 450, svg_element_id: 'office-premier', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }, { id: 3, name: 'ТВ', icon_name: 'tv' }], is_active: true, floor: 3, status: 'available' },
          { id: 312, name: 'Приватний офіс ЛЮКС', description: 'Закритий офіс на 5 осіб', space_type: 'private_office', space_type_display: 'Приватний офіс', capacity: 5, price_per_hour: 700, svg_element_id: 'office-lux', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }, { id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 6, name: 'Камера', icon_name: 'camera' }], is_active: true, floor: 3, status: 'available' },
        ],
      },
      {
        id: 4,
        location: 1,
        level: 4,
        name: '4-й поверх',
        map_image: null,
        spaces: [
          // Open space desks
          { id: 401, name: 'Стіл #41', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-41', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 402, name: 'Стіл #42', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-42', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 403, name: 'Стіл #43', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-43', amenities: [], is_active: true, floor: 4, status: 'booked' },
          { id: 404, name: 'Стіл #44', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-44', amenities: [], is_active: true, floor: 4, status: 'booked' },
          { id: 405, name: 'Стіл #45', description: 'Місце з гарним виглядом', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 100, svg_element_id: 'desk-45', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }, { id: 7, name: 'Монітор', icon_name: 'monitor' }], is_active: true, floor: 4, status: 'available' },
          { id: 406, name: 'Стіл #46', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-46', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 407, name: 'Стіл #47', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-47', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 408, name: 'Стіл #48', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-48', amenities: [], is_active: true, floor: 4, status: 'booked' },
          { id: 409, name: 'Стіл #49', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 80, svg_element_id: 'desk-49', amenities: [], is_active: true, floor: 4, status: 'available' },
          // Meeting rooms
          { id: 411, name: 'Переговорна КАРПАТИ', description: 'Велика переговорна з панорамним видом', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 8, price_per_hour: 500, svg_element_id: 'room-karpaty', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 4, name: 'Дошка', icon_name: 'presentation' }, { id: 6, name: 'Камера', icon_name: 'camera' }], is_active: true, floor: 4, status: 'available' },
          { id: 412, name: 'Переговорна ДНІПРО', description: 'Середня переговорна', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 4, price_per_hour: 350, svg_element_id: 'room-dnipro', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 4, name: 'Дошка', icon_name: 'presentation' }], is_active: true, floor: 4, status: 'booked' },
          { id: 413, name: 'Переговорна АРІЯ', description: 'Мала переговорна', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 4, price_per_hour: 280, svg_element_id: 'room-aria', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }], is_active: true, floor: 4, status: 'available' },
          // Open-plan area
          { id: 421, name: 'Опен-плей Алея A1', description: 'Гнучке місце в опен-спейсі', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-a1', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 422, name: 'Опен-плей Алея A2', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-a2', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 423, name: 'Опен-плей Алея A3', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-a3', amenities: [], is_active: true, floor: 4, status: 'booked' },
          { id: 424, name: 'Опен-плей Алея A4', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-a4', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 425, name: 'Опен-плей Алея B1', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-b1', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 426, name: 'Опен-плей Алея B2', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-b2', amenities: [], is_active: false, floor: 4, status: 'closed' },
          { id: 427, name: 'Опен-плей Алея B3', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-b3', amenities: [], is_active: true, floor: 4, status: 'available' },
          { id: 428, name: 'Опен-плей Алея B4', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 70, svg_element_id: 'open-b4', amenities: [], is_active: true, floor: 4, status: 'available' },
        ],
      },
      {
        id: 5,
        location: 1,
        level: 5,
        name: '5-й поверх',
        map_image: null,
        spaces: [
          { id: 501, name: 'Стіл #51', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 90, svg_element_id: 'desk-51', amenities: [], is_active: true, floor: 5, status: 'available' },
          { id: 502, name: 'Стіл #52', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 90, svg_element_id: 'desk-52', amenities: [], is_active: true, floor: 5, status: 'available' },
          { id: 503, name: 'Стіл #53', description: '', space_type: 'desk', space_type_display: 'Стіл', capacity: 1, price_per_hour: 90, svg_element_id: 'desk-53', amenities: [], is_active: true, floor: 5, status: 'booked' },
          { id: 511, name: 'Конференц-зал ШЕВЧЕНКО', description: 'Великий конференц-зал', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 20, price_per_hour: 1500, svg_element_id: 'conf-shevchenko', amenities: [{ id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 4, name: 'Дошка', icon_name: 'presentation' }, { id: 5, name: 'Відеозв\'язок', icon_name: 'video' }, { id: 8, name: 'Проектор', icon_name: 'projector' }], is_active: true, floor: 5, status: 'available' },
          { id: 512, name: 'Приватний офіс ПРЕЗИДЕНТ', description: 'VIP офіс', space_type: 'private_office', space_type_display: 'Приватний офіс', capacity: 6, price_per_hour: 1200, svg_element_id: 'office-president', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }, { id: 3, name: 'ТВ', icon_name: 'tv' }, { id: 6, name: 'Камера', icon_name: 'camera' }, { id: 9, name: 'Кухня', icon_name: 'kitchen' }], is_active: true, floor: 5, status: 'available' },
        ],
      },
      {
        id: 6,
        location: 1,
        level: 6,
        name: '6-й поверх',
        map_image: null,
        spaces: [
          { id: 601, name: 'Терраса A', description: 'Відкрита тераса', space_type: 'desk', space_type_display: 'Стіл', capacity: 6, price_per_hour: 200, svg_element_id: 'terrace-a', amenities: [], is_active: true, floor: 6, status: 'available' },
          { id: 611, name: 'Sky Lounge', description: 'Преміум лаунж з видом на місто', space_type: 'private_office', space_type_display: 'Приватний офіс', capacity: 10, price_per_hour: 2000, svg_element_id: 'skylounge', amenities: [{ id: 1, name: 'Wi-Fi', icon_name: 'wifi' }, { id: 2, name: 'Кава', icon_name: 'coffee' }], is_active: true, floor: 6, status: 'available' },
        ],
      },
      {
        id: 7,
        location: 1,
        level: 7,
        name: '7-й поверх',
        map_image: null,
        spaces: [
          { id: 701, name: 'Дах / Rooftop', description: 'Подія на даху', space_type: 'meeting_room', space_type_display: 'Переговорна', capacity: 50, price_per_hour: 5000, svg_element_id: 'rooftop', amenities: [], is_active: true, floor: 7, status: 'available' },
        ],
      },
    ],
  },
];

export const USE_MOCK_DATA = true; // Toggle: false = use real API
