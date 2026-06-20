import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function Quiz() {
  const navigate = useNavigate()
  const { getQuizQuestions, quizAnswers, setQuizAnswer, clearQuizAnswers } = useStore()
  const questions = getQuizQuestions()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/briefing')} className="text-stone-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-stone-900">要点问答</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-stone-400 text-sm">当前方案暂无问答题目</p>
            <button onClick={() => navigate('/briefing')} className="mt-3 text-orange-500 text-sm font-medium">
              返回
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900">要点问答</h2>
        <p className="text-stone-400 text-sm mt-2 text-center">
          共{questions.length}道题，答对{Math.ceil(questions.length * 0.6)}道及以上为通过
        </p>
        <button
          onClick={() => {
            clearQuizAnswers()
            setStarted(true)
          }}
          className="mt-6 bg-orange-500 text-white rounded-xl px-8 py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
        >
          开始答题
        </button>
      </div>
    )
  }

  const question = questions[currentIndex]
  const answered = quizAnswers[question.id]
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (index: number) => {
    if (answered !== undefined) return
    setQuizAnswer(question.id, index)
  }

  const handleNext = () => {
    if (isLast) {
      navigate('/briefing/quiz/result')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/briefing')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">要点问答</h1>
        </div>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i < currentIndex ? 'bg-orange-500' :
                i === currentIndex ? 'bg-orange-400' : 'bg-stone-200'
              )}
            />
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-2">
          第 {currentIndex + 1} / {questions.length} 题
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-900 leading-relaxed">{question.question}</h2>
        </div>

        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            const isSelected = answered === i
            const isCorrect = question.answerIndex === i
            const showResult = answered !== undefined

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered !== undefined}
                className={cn(
                  'w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all border',
                  showResult && isCorrect && 'bg-emerald-50 border-emerald-300 text-emerald-800',
                  showResult && isSelected && !isCorrect && 'bg-red-50 border-red-300 text-red-800',
                  showResult && !isCorrect && !isSelected && 'bg-white border-stone-200 text-stone-400',
                  !showResult && 'bg-white border-stone-200 text-stone-700 active:scale-[0.98]',
                  !showResult && isSelected && 'border-orange-400 bg-orange-50',
                )}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + i)}.
                </span>{' '}
                {opt}
                {showResult && isCorrect && ' ✓'}
                {showResult && isSelected && !isCorrect && ' ✗'}
              </button>
            )
          })}
        </div>

        {answered !== undefined && (
          <div className={cn(
            'rounded-xl p-4 text-xs leading-relaxed',
            answered === question.answerIndex
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          )}>
            <span className="font-semibold">
              {answered === question.answerIndex ? '回答正确！' : '回答错误。'}
            </span>{' '}
            {question.explanation}
          </div>
        )}

        {answered !== undefined && (
          <button
            onClick={handleNext}
            className="w-full bg-orange-500 text-white rounded-xl py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
          >
            {isLast ? '查看结果' : '下一题'}
          </button>
        )}
      </div>
    </div>
  )
}
