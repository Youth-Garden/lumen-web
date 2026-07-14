import { ToeicQuestionDto } from '@/services/toeic';

export interface ToeicScoreResult {
  totalScore: number;
  listeningScore: number;
  readingScore: number;
  correctAnswersCount: number;
  totalQuestions: number;
  partScores: Record<
    number,
    { correct: number; total: number; percentage: number }
  >;
  topicScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
}

const LISTENING_SCORE_MAPPING = [
  5, 5, 5, 5, 5, 5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
  80, 85, 90, 95, 100, 110, 115, 120, 125, 130, 135, 140, 145, 150, 160, 165,
  170, 175, 180, 185, 190, 195, 200, 210, 215, 220, 225, 230, 240, 245, 250,
  255, 260, 270, 275, 280, 290, 295, 300, 310, 315, 320, 325, 330, 340, 345,
  350, 360, 365, 370, 380, 385, 390, 395, 400, 405, 410, 420, 425, 430, 440,
  445, 450, 460, 465, 470, 475, 480, 485, 490, 495, 495, 495, 495, 495, 495,
  495, 495, 495, 495,
];

const READING_SCORE_MAPPING = [
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
  70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150,
  155, 160, 165, 170, 175, 180, 190, 195, 200, 205, 210, 215, 220, 225, 230,
  235, 240, 250, 255, 260, 265, 270, 280, 285, 290, 300, 305, 310, 320, 325,
  330, 335, 340, 350, 355, 360, 365, 370, 380, 385, 390, 395, 400, 405, 410,
  415, 420, 425, 430, 435, 445, 450, 455, 465, 470, 480, 485, 490, 495, 495,
  495, 495,
];

/**
 * Tính điểm TOEIC chính xác (Frontend mock).
 * TOEIC có bảng quy đổi điểm riêng biệt cho Reading và Listening (max 495 mỗi phần).
 * Đối với các đề thi rút gọn (Mini test, < 200 câu), hệ thống sẽ tự động scale
 * tỷ lệ phần trăm đúng sang thang 100 câu trước khi map vào bảng điểm.
 */
export const calculateToeicScore = (
  questions: ToeicQuestionDto[],
  userAnswers: Record<string, string>,
): ToeicScoreResult => {
  const partScores: Record<
    number,
    { correct: number; total: number; percentage: number }
  > = {};

  const topicScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  > = {};

  // Initialize parts 1 to 7
  for (let i = 1; i <= 7; i++) {
    partScores[i] = { correct: 0, total: 0, percentage: 0 };
  }

  let listeningCorrect = 0;
  let readingCorrect = 0;
  let totalListening = 0;
  let totalReading = 0;

  questions.forEach((question) => {
    const part = question.part || 1;
    const isListening = part <= 4;
    const isCorrect = userAnswers[question.id] === question.correctAnswer;

    // Safety check in case part is somehow out of 1-7 bounds
    if (partScores[part]) {
      partScores[part].total += 1;
      if (isCorrect) {
        partScores[part].correct += 1;
      }
    }

    if (isListening) {
      totalListening += 1;
      if (isCorrect) listeningCorrect += 1;
    } else {
      totalReading += 1;
      if (isCorrect) readingCorrect += 1;
    }

    // Topic calculation
    if (question.topic) {
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0, percentage: 0 };
      }
      topicScores[question.topic].total += 1;
      if (isCorrect) {
        topicScores[question.topic].correct += 1;
      }
    }
  });

  // Calculate percentages
  for (let i = 1; i <= 7; i++) {
    if (partScores[i].total > 0) {
      partScores[i].percentage = Math.round(
        (partScores[i].correct / partScores[i].total) * 100,
      );
    }
  }

  // Calculate percentages for topics
  Object.values(topicScores).forEach((stats) => {
    if (stats.total > 0) {
      stats.percentage = Math.round((stats.correct / stats.total) * 100);
    }
  });

  // Chuẩn hóa số câu đúng về thang 100 nếu đề thi không đủ 200 câu
  const normalizedListeningCorrect =
    totalListening > 0
      ? Math.round((listeningCorrect / totalListening) * 100)
      : 0;

  const normalizedReadingCorrect =
    totalReading > 0 ? Math.round((readingCorrect / totalReading) * 100) : 0;

  // Sử dụng bảng quy đổi chuẩn TOEIC
  const listeningScore =
    LISTENING_SCORE_MAPPING[Math.min(100, normalizedListeningCorrect)] || 0;
  const readingScore =
    READING_SCORE_MAPPING[Math.min(100, normalizedReadingCorrect)] || 0;

  return {
    totalScore: listeningScore + readingScore,
    listeningScore,
    readingScore,
    correctAnswersCount: listeningCorrect + readingCorrect,
    totalQuestions: questions.length,
    partScores,
    topicScores,
  };
};
