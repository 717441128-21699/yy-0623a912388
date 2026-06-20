import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function QuizResult() {
  const navigate = useNavigate()
  const { getQuizQuestions, quizAnswers, clearQuizAnswers } = useStore()
  const questions = getQuizQuestions()

  const correctCount = questions.filter(q => quizAnswers[q.id] === q.answerIndex).length
  const totalCount = questions.length
  const passThreshold = Math.ceil(totalCount * 0.6)
  const isPassed = correctCount >= passThreshold

  const wrongQuestions = questions.filter(q => quizAnswers[q.id] !== q.answerIndex)

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/briefing')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">答题结果</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isPassed ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isPassed ? (
              <CheckCircle size={40} className="text-emerald-500" />
            ) : (
              <XCircle size={40} className="text-red-500" />
            )}
          </div>
          <h2 className={`text-xl font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPassed ? '恭喜通过' : '需要重新学习'}
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            答对 {correctCount} / {totalCount} 题（通过线：{passThreshold}题）
          </p>
          <div className="w-48 bg-stone-100 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: `${(correctCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {wrongQuestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-stone-700 mb-3">错题回顾</h3>
            <div className="space-y-3">
              {wrongQuestions.map(q => (
                <div key={q.id} className="bg-red-50 rounded-2xl p-4 border border-red-100">
                  <p className="text-sm text-stone-800 font-medium">{q.question}</p>
                  <p className="text-xs text-red-600 mt-2">
                    正确答案：{String.fromCharCode(65 + q.answerIndex)}. {q.options[q.answerIndex]}
                  </p>
                  <p className="text-xs text-red-500/70 mt-1">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!isPassed && (
            <button
              onClick={() => {
                clearQuizAnswers()
                navigate('/briefing/quiz')
              }}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white rounded-xl py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              <RotateCcw size={16} />
              重新答题
            </button>
          )}
          <button
            onClick={() => navigate('/briefing')}
            className="w-full bg-white text-stone-600 rounded-xl py-3 text-sm font-medium border border-stone-200 active:scale-[0.98] transition-transform"
          >
            返回交底记录
          </button>
        </div>
      </div>
    </div>
  )
}
