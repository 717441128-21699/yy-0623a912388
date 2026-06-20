import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Camera, Plus, User, Briefcase, CreditCard, Share2, Printer, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects, hazardTypes, schemes } from '@/data/mockData'
import PhotoUploader from '@/components/PhotoUploader'
import type { BriefingPhoto } from '@/types'
import { cn } from '@/lib/utils'

export default function BriefingDetail() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { briefingSessions, addBriefingPhoto, currentRole } = useStore()

  const session = briefingSessions.find(s => s.id === sessionId)
  const [localPhotos, setLocalPhotos] = useState<string[]>([])
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const project = projects.find(p => p.id === session?.projectId)
  const scheme = session?.schemeId ? schemes.find(s => s.id === session.schemeId) ?? null : null
  const hazardTypeName = scheme
    ? hazardTypes.find(h => h.id === scheme.typeId)?.name ?? ''
    : ''

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
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/briefing')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900 flex-1">交底详情</h1>
          <button
            onClick={() => navigate(`/briefing/${session.id}/export`)}
            className="flex items-center gap-1 text-orange-500 text-xs font-medium bg-orange-50 px-2.5 py-1.5 rounded-lg active:scale-[0.97]"
          >
            <Share2 size={12} />
            导出
          </button>
        </div>
        {(project || hazardTypeName) && (
          <p className="text-stone-400 text-xs">
            {project?.name}{hazardTypeName && ` · ${hazardTypeName}`}
          </p>
        )}
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
              {session.photos.map((photo, index) => (
                <div
                  key={`${photo.id}-${index}`}
                  className="aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer active:opacity-80 transition-opacity"
                  onClick={() => setPreviewIndex(index)}
                >
                  <img src={photo.url} alt={`现场照片${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
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

      {previewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={() => setPreviewIndex(null)}
          >
            <X size={20} />
          </button>
          <img
            src={session.photos[previewIndex].url}
            alt="预览"
            className="max-w-full max-h-full object-contain"
          />
          {session.photos.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {session.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPreviewIndex(i) }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === previewIndex ? 'bg-white' : 'bg-white/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
