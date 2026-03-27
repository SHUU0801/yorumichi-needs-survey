# YORUMICHI Needs Survey - Project TODO

## Core Features
- [x] Mobile-optimized slide presentation viewer (5 slides)
- [x] Swipe gesture navigation (left/right swipe to change slides)
- [x] Tap navigation (next/prev buttons for accessibility)
- [x] Slide 1: Title slide - "夜道の「なんとなく怖い」をゼロにするプロジェクト"
- [x] Slide 2: Current app features - "今のヨルミチ：AIが「一番安全な帰り道」を案内"
- [x] Slide 3: Device explanation - "新機能1：持つだけで「つきまとい」の証拠を残す"
- [x] Slide 4: Coupon map feature - "新機能2：歩くだけで「クーポン」がもらえるマップ"
- [x] Slide 5: Survey form - "犯罪を未然に防ぐ未来へ" with 6 questions

## Survey Form Implementation
- [x] Question 1: "このアプリを使いたいですか？" (Yes/No)
- [x] Question 2: "それはなぜですか？" (Text)
- [x] Question 3: "このデバイスを使いたいですか？" (Yes/No)
- [x] Question 4: "それはなぜですか？" (Text)
- [x] Question 5: "いくらなら使いたいと思いますか？" (Text/Number)
- [x] Question 6: "クーポン連動マップは、帰り道を変えるきっかけになりますか？" (Text)
- [x] Form validation
- [x] Form submission handler

## Backend Features
- [x] Email sending to alisslab.jp@gmail.com
- [x] Survey response storage in database
- [x] tRPC procedure for form submission
- [x] Email template formatting

## Design & UX
- [x] Swiss minimalist design (white background, black text)
- [x] Mobile-first responsive layout
- [x] Smooth slide transitions
- [x] Touch-friendly navigation buttons
- [x] Loading states for form submission
- [x] Success/error feedback after submission

## Testing & Deployment
- [x] Unit tests for slide structure
- [x] Mobile browser testing (iOS Safari, Android Chrome)
- [x] Gesture navigation testing
- [x] Form submission testing
- [ ] Email delivery verification
- [x] Create checkpoint before delivery


## User Feedback Updates (Completed)
- [x] Slide 2: Update to "開発中のWebアプリ" positioning with illustration
- [x] Slide 3: Reframe as "こういうデバイスを開発しようとしてます!" with AirTag-like device illustration
- [x] Slide 4: Add coupon distribution explanation
- [x] Slide 5: Fix missing Q1 and Q2 labels, change Q5 to device price question
- [x] Generate illustrations for slides 2 and 3
- [x] Integrate illustrations into HTML


## UX Improvements (Completed)
- [x] Fix swipe functionality to work on survey form screen
- [x] Allow swiping back from survey to previous slides
- [x] Generate illustrations for slides 1, 4, and 5
- [x] Integrate all illustrations (5 total)
- [x] Fix text overflow and truncation issues
- [x] Optimize responsive design for mobile
- [x] Test all swipe gestures on mobile devices


## Bug Fixes (Completed)
- [x] Fix slide 3 mobile UI: top text not visible
- [x] Fix navigation buttons visibility after scrolling on slide 3
- [x] Ensure slide 1 title illustration displays correctly


## Current Bug Fixes (Completed)
- [x] Fix slide 3 scroll issue: navigation buttons disappear when scrolling to top


## Email Sending Bug Fix (Completed)
- [x] Fix survey submission error
- [x] Ensure email is sent to alisslab.jp@gmail.com
- [x] Add error logging for debugging
- [x] Test email delivery
