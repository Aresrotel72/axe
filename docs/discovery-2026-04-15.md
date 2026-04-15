# Axe Capital — Discovery Spec

**Дата:** 2026-04-15
**Статус:** draft, discovery in progress (финальная мысль от основателя ожидается)
**Фасилитатор:** Claude (senior dev, 20+ лет)

---

## 1. Executive Summary

**Axe Capital** — это **агрегатор и верификатор крипто-сигналов** с Billions-эстетикой. Продукт собирает высказывания крипто-блогеров, аналитиков и публичных личностей из Twitter/X, Telegram, YouTube и on-chain-данных, ранжирует их по достоверности и подаёт пользователю через трёх LLM-агентов: **Axe** (интуитивный разбор, conviction), **Taylor** (математика, холодный анализ, предсказания), **Wendy** (психология, защита от FOMO).

Это **не** просто чат с персонажами. Это **data product** — сигнальная биржа, где персонажи — это линза интерпретации.

---

## 2. Цель и мотивация

- **Сейчас:** персональный инструмент основателя + потенциальная коммерциализация
- **Будущее:** коммерческий SaaS продукт с монетизацией через Freemium + Telegram Premium Alerts

---

## 3. Аудитория

Широкая крипто-аудитория (новички с FOMO + активные трейдеры + долгосрочные инвесторы + русскоязычное TG-коммьюнити). **В MVP — фокус на ru-tg сегмент** как наиболее достижимый.

---

## 4. Суть продукта (Core Value Loop)

Пользователь получает **комбинированную ценность**:

1. **Дашборд** — постоянный мониторинг: что сейчас говорят достоверные источники
2. **Алерты** — пуш-уведомления на свежие сигналы с высоким credibility
3. **Чат для deep-dive** — три персонажа разбирают конкретную идею или монету

---

## 5. Источники данных (Ingestion)

| Источник | Приоритет | Сложность | Цена |
|---|---|---|---|
| Twitter / X | P0 | Высокая (API платный) | $100-200/мес или scrape/Apify |
| Telegram каналы | P0 | Средняя (Telethon user-bot) | $0 |
| YouTube транскрипты | P1 | Средняя (YT API + Whisper для без сабов) | ~$10/мес |
| On-chain (whale alerts) | P1 | Низкая (готовые API) | $0-50/мес |
| **Публичные личности-VIP** (Musk, Trump, CZ) | **P0** | Высокая (real-time) | — |

> **Важный инсайт от основателя:** публичные личности, которые одним высказыванием двигают биржу — отдельный VIP-тир с мгновенной обработкой.

---

## 6. Credibility Engine (главная фишка)

Скор достоверности = **взвешенная комбинация четырёх метрик**:

### 6.1. Исторический трек-рекорд (основа)
- Парсим каждое предсказание блогера
- Через N дней сверяем с фактом (цены, события)
- Считаем hit-rate, alpha vs BTC, max drawdown per call

### 6.2. "История личности" (anti-rug детектор)
- **Инсайт основателя:** если блогер "скинул свою аудиторию и начал новую собирать" — это rug-паттерн, минус к credibility
- Трекаем смены ников, удаления твитов, пивоты риторики, создание новых каналов после провала старых

### 6.3. Community voting (отзывы)
- Пользователи ставят 👍/👎 на источники
- Bayesian average чтобы защититься от накруток

### 6.4. LLM-анализ тона и логики
- Claude смотрит на аргументацию: есть цифры, on-chain метрики, конкретика → плюс
- Эмоции, clickbait, шилл без обоснований → минус

**Итог:** финальный скор 0-100, разбивка на три класса: **✅ Достоверно / ⚠️ Средне / ❌ Шум**.

---

## 7. Персонажи = LLM-агенты

**Решение:** каждый персонаж — **отдельный активный агент** с доступом к базе данных и tools. Не интерпретаторы готового скора.

### 7.1. Axe (Bobby Axelrod)
- **Роль:** чуйка рынка, интуитивный аналитик, conviction
- **Тон:** агрессивный, прямой, не терпит слабины
- **Входы:** on-chain + top-tier блогеры + sentiment
- **Выход:** высокоуверенный call с эмоциональным нарративом

### 7.2. Taylor (Taylor Mason)
- **Роль:** холодная математика, quant-анализ, предсказания
- **Тон:** precise, detached, бездушно-честный
- **Входы:** цены, волатильность, Fibonacci, liquidation zones, исторические паттерны
- **Выход:** probability + risk/reward + конкретные уровни

### 7.3. Wendy (Wendy Rhoades)
- **Роль:** performance coach, психолог
- **Тон:** grounding, sharp, без сентиментальности
- **Входы:** контекст пользователя, его история запросов, рыночный sentiment
- **Выход:** ego-check, FOMO-suppression, фокус на процессе

### 7.4. Wags (bonus) — onboarding и tutorial only

---

## 8. Платформа и UX

- **Main:** Mobile PWA (телефон-first)
- **Co-equal:** Telegram-bot
- **Secondary:** Desktop web (broker-terminal style — уже есть как прототип)

### Telegram-bot функции:
- ✅ Alert'ы по достоверным сигналам
- ✅ Чат с Axe/Taylor/Wendy
- ✅ Быстрый лукап по монете (`/btc`, `/sol`)
- ✅ Дневной дайджест (топ-5 сигналов за сутки)

---

## 9. Real-time требования

**Тиеровая модель:**
- **VIP (Musk, Trump, CZ, Vitalik, топ-инфлюенсеры)** → минуты, real-time
- **Обычные отслеживаемые** → 15-30 минут (batch-polling)
- **Long-tail / historical** → часы / сутки

---

## 10. Voice (ElevenLabs)

**Статус:** центр продукта, но **Pro-only** как monetization hook.
- Free tier — текст + browser TTS fallback
- Pro tier — клоны голосов Axe/Taylor/Wendy через ElevenLabs
- Работает как ключевой differentiation от других агрегаторов

---

## 11. Масштаб MVP

- **20-50 курированных топ-аккаунтов** (whitelist)
- Основатель примерно знает список, нужен research-этап для финализации (канон: Hayes, Cobie, Hsaka, Murad, Pentoshi, Willy Woo и др.)

---

## 12. Монетизация

**Рекомендованная модель:**
- **Freemium web** (3 запроса/день, текст, без voice)
- **Pro $29/мес** (unlimited + voice + full agent discussions)
- **Telegram Alerts $9-19/мес** (низкий порог, для push-first аудитории)
- **Bundle $35** (Web Pro + TG alerts)

**Cold start target:** 1000 free → 50 paid = ~$1500 MRR за 3-6 мес.

---

## 13. Бюджет MVP

| Сервис | Цена/мес | Комментарий |
|---|---|---|
| Vercel Hobby → Pro | $0-20 | Frontend + API routes |
| Supabase Free → Pro | $0-25 | Postgres + auth + realtime |
| Twitter data (Apify/scrape) | $30-100 | Обход дорогого X API |
| YouTube API + Whisper | ~$10 | Транскрипция без сабов |
| Claude Sonnet 4.6 | $80-200 | Credibility scoring + 3 агента |
| ElevenLabs Creator | $22 | Voice clones |
| Upstash Redis | $0 | Rate-limit, cache |
| **ИТОГО** | **$150-400/мес** | |

---

## 14. Инфраструктура (рекомендация senior dev)

**Стек: Vercel + Supabase + выделенный worker на Railway/Fly.io**

### Почему:
- **Vercel** — Next.js 16 идёт нативно, SSR + edge + API routes из коробки
- **Supabase** — Postgres + auth + realtime + pgvector (для semantic search по твитам) + storage в одном
- **Railway / Fly.io (1 node ~$5/мес)** — для **долгоживущих jobs**:
  - Telethon user-bot (требует постоянного коннекта)
  - Whisper-транскрипция YouTube (CPU-bound)
  - Cron-парсеры Twitter через Apify
- **Upstash Redis** — rate-limit, очередь задач, кеш

### Ядро архитектуры (диаграмма словами):

```
[Sources] → [Ingestion Workers: Railway] → [Supabase Postgres + pgvector]
                                              ↓
                              [Credibility Engine: Supabase Edge Functions]
                                              ↓
                              [Agent Layer: Vercel AI SDK + Claude]
                                              ↓
                        [Frontend: Next.js PWA]  ←→  [TG Bot: Vercel cron]
                                              ↓
                              [Alerts: Supabase Realtime → TG push]
```

---

## 15. Команда и процесс

- **Основатель** — direction, vision, code через диалог с Claude
- **Claude** — архитектура, ревью, код по итерациям
- **Solo-founder + AI-copilot** модель

---

## 16. Таймлайн

**Нет жёсткого дедлайна.** Фокус на качестве и мотивации.

**Рекомендованная итерация (senior dev):**
- **Фаза 1 (4 недели):** Починить текущий прототип + Supabase + auth + 1 источник (Telegram)
- **Фаза 2 (6 недель):** Credibility engine + 3-агента с реальным Claude + Twitter/YouTube
- **Фаза 3 (4 недели):** Telegram bot + Voice + монетизация
- **Фаза 4:** Polish, тесты, soft-launch для 50 beta-юзеров

---

## 17. Legal

**Отложено.** Основатель пометил "потом разберёмся". Риск: блокер для монетизации в некоторых юрисдикциях. Рекомендация: на этапе Фазы 3 проконсультироваться с юристом, добавить disclaimer "educational / entertainment" по образцу CoinBureau/Messari.

---

## 18. Открытые вопросы

1. **Финальная мысль основателя** — ожидается отдельным сообщением
2. Детальный whitelist блогеров (20-50 имён) — research-этап
3. Конкретные формулы credibility scoring (веса метрик)
4. UX mobile PWA vs текущий desktop view — нужен детальный редизайн
5. Legal стратегия к моменту Фазы 3

---

## 19. Что уже есть в текущем репозитории (на базе аудита)

**Можно оставить:**
- Визуальная система (color tokens, типографика, Framer Motion хореография)
- `StartupSequence`, `IdentityOnboarding` — UX-заделы
- Структура агентов в `lib/agents.ts` (prompts сохранить, логику переделать)
- TTS-роут `app/api/tts/route.ts` (нужен fix security + rate-limit)

**Надо переделать:**
- Распилить монолит `page.tsx` (674 строки)
- Мок-логику `generateDualIntel` → реальный LLM через AI SDK
- localStorage для API-ключей → httpOnly cookies + Supabase auth
- Добавить cyrillic subset для Geist шрифта
- Metadata, SEO, дефолты из create-next-app

**Надо построить с нуля:**
- Ingestion layer (X/TG/YT/on-chain workers)
- Credibility engine
- Agent orchestration (3 LLM с tools)
- Telegram bot
- Auth + billing (Supabase + Stripe)
- Mobile PWA optimization

---

## 20. Статус дискавери

- ✅ Phase 1: Orientation — готово
- ✅ Phase 2A: Problem & Goals — готово
- ✅ Phase 2B: UX & Journey — готово
- ✅ Phase 2C: Data & State — готово
- ✅ Phase 2D: Technical Landscape — готово
- ⏳ Phase 2E: Scale & Performance — частично (нужны цифры юзеров)
- ✅ Phase 2F: Integrations — готово
- ⚠️ Phase 2G: Security & Legal — отложено основателем
- ✅ Phase 2H: Deployment & Ops — готово
- ⏳ **Phase 3: Финальная мысль основателя** — ожидается
- ⏳ Phase 4: Completeness Check
- ⏳ Phase 5: Spec Finalization

---

*Документ сохранён для продолжения дискуссии после финальной мысли основателя.*
