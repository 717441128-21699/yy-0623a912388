import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Camera, Plus, User, Briefcase, CreditCard } from 'lucide-react'
import { useStore } from '@/store/useStore'
import PhotoUploader from '@/components/PhotoUploader'
import type { BriefingPhoto } from '@/types'
import { cn } from '@/lib/utils'

export default function BriefingDetail() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { briefingSessions, addBriefingPhoto, currentRole } = useStore()

  const session = briefingSessions.find(s => s.id === sessionId)
  const [localPhotos, setLocalPhotos] = useState<string[]>([])

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400">未找到交底记录</p>
      </div>
    )
  }

  const handleAddPhotos = () => {
    localPhotos.forEach(url => {
      const photo: BriefingPhoto = {
        id: `bp_${Date.now()}_${Math.random()}`,
        url,
        description: '',
      }
      addBriefingPhoto(session.id, photo)
    })
    setLocalPhotos([])
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/briefing')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">交底详情</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-100">交底时间</div>
              <div className="text-base font-semibold mt-0.5">{session.date}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-orange-100">地点</div>
              <div className="text-sm font-semibold mt-0.5">{session.location}</div>
            </div>
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-orange-100" />
              <span className="text-sm">{session.signRecords.length}人签到</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera size={14} className="text-orange-100" />
              <span className="text-sm">{session.photos.length + localPhotos.length}张照片</span>
            </div>
          </div>
        </div>

        {(currentRole === 'safety' || currentRole === 'teamLeader') && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-stone-900">补充现场照片</h3>
              {localPhotos.length > 0 && (
                <button
                  onClick={handleAddPhotos}
                  className="flex items-center gap-1 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium active:scale-[0.97] transition-transform"
                >
                  <Plus size={12} />
                  确认添加
                </button>
              )}
            </div>
            <PhotoUploader
              photos={localPhotos}
              onChange={setLocalPhotos}
              showLabel={false}
              maxPhotos={9}
            />
          </div>
        )}

        {session.photos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <Camera size={14} className="text-orange-500" />
              现场照片 <span className="text-stone-300 text-xs">({session.photos.length}张)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {session.photos.map(photo => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt="现场照片"
                  className={cn(
                    'w-full aspect-square object-cover rounded-xl',
                    'cursor-pointer hover:opacity-90 transition-opacity'
                  )}
                  onClick={() => {
                    const w = window.open()
                    if (w) {
                      w.document.write(`<img src="${photo.url}" style="max-width:100%;max-height:100vh;margin:auto;display:block;" />`)
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
            <Users size={14} className="text-orange-500" />
            签到人员 <span className="text-stone-300 text-xs">({session.signRecords.length}人)</span>
          </h3>
          {session.signRecords.length === 0 ? (
            <p className="text-stone-400 text-xs text-center py-4">暂无签到记录</p>
          ) : (
            <div className="space-y-3">
              {session.signRecords.map(sr => (
                <div key={sr.id} className="flex gap-3 items-center pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                  <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    {sr.signature ? (
                      <img src={sr.signature} alt={`${sr.name}的签名`} className="w-full h-full object-contain" />
                    ) : (
                      <User size={18} className="text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">{sr.name}</span>
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">{sr.trade}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
                      <CreditCard size={10} />
                      <span className="font-mono">
                        {sr.idCard.slice(0, 6)}****{sr.idCard.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-stone-300">签到时间</div>
                    <div className="text-xs text-stone-500 mt-0.5">{sr.signedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
