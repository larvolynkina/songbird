const content = {
  ru: {
    main: {
      logo: 'Певчая птичка',
      links: ['Главная', 'Викторина'],
      urls: ['./index.html', './quiz.html'],
      h1: 'Викторина певчих птиц',
      promoText: 'Сможете угадать, чей это голос?',
      buttonText: 'Играть',
    },
    quiz: {
      score: 'Очки: ',
      questions: [
        'Разминка',
        'Воробьиные',
        'Обитатели леса',
        'Певчие птицы',
        'Хищные птицы',
        'Морские птицы',
      ],
      manual: [
        'Прослушайте звуки пения и угадайте какая это птица.',
        'Выберите правильный ответ из шести вариантов.',
      ],
      buttonNext: 'Следующий вопрос',
      results: {
        h1: 'Поздравляем!!',
        text: 'Вы прошли викторину и набрали 13 из 30 возможных баллов!',
        buttonTryAgain: 'Попробовать еще раз',
      },
    },
  },
  en: {
    main: {
      logo: 'Songbird',
      links: ['Home', 'Quiz'],
      urls: ['./index.html', './quiz.html'],
      h1: 'Songbird quiz',
      promoText: 'Can you guess who is chirping?',
      buttonText: 'Start',
    },
    quiz: {
      score: 'Score: ',
      questions: [
        'Warmup',
        'Sparrows',
        'Forest birds',
        'Songbirds',
        'Birds of prey',
        'Seabirds',
      ],
      manual: [
        'Listen to the sounds of singing and guess who is chirping.',
        'Choose the correct answer from six variants leftward.',
      ],
      buttonNext: 'Next question',
      results: {
        h1: 'Congratulations!',
        text: 'You have passed the quiz and scored 13 out of 30 possible points!',
        buttonTryAgain: 'Try again',
      },
    },
  },
};

export default content;
