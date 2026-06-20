import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, Users, Camera, Download, Share2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects, hazardTypes, schemes } from '@/data/mockData'

export default function BriefingExport() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { briefingSessions, currentRole } = useStore()

  const session = briefingSessions.find(s => s.id === sessionId)
  const project = projects.find(p => p.id === session?.projectId)
  const scheme = session?.schemeId ? schemes.find(s => s.id === session.schemeId) ?? null : null
  const hazardType = scheme
    ? hazardTypes.find(h => h.id === scheme.typeId)?.name ?? ''
    : ''

  const roleLabel = currentRole === 'safety' ? '安全员' : currentRole === 'construction' ? '施工员' : '班组长'

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-stone-400">未找到交底记录</p>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project?.name ?? '项目'} - ${hazardType}交底记录`,
          text: `交底时间：${session.date}\n交底位置：${session.location}\n签到人数：${session.signRecords.length}人\n现场照片：${session.photos.length}张`,
        })
      } catch {
        // ignore
      }
    } else {
      alert('当前浏览器不支持分享功能，请使用导出图片或打印功能')
    }
  }

  const tradeCount: Record<string, number> = {}
  session.signRecords.forEach(sr => {
    tradeCount[sr.trade] = (tradeCount[sr.trade] ?? 0) + 1
  })

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-stone-900">交底记录导出</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 bg-stone-100 text-stone-600 rounded-lg px-2.5 py-1.5 text-xs font-medium active:scale-[0.97]"
          >
            <Share2 size={13} />
            分享
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 bg-orange-500 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium active:scale-[0.97]"
          >
            <Printer size={13} />
            打印
          </button>
        </div>
      </div>

      <div id="briefing-report" className="px-5 py-6 print:py-4 max-w-xl mx-auto text-stone-800">
        <div className="text-center border-b-2 border-double border-stone-300 pb-4 mb-5">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Download size={12} />
            危大工程专项方案交底记录
          </div>
          <h1 className="text-xl font-bold text-stone-900 leading-tight">
            {hazardType || '危大工程'}专项方案交底
          </h1>
        </div>

        <section className="mb-5 bg-stone-50 rounded-xl p-4 print:border print:border-stone-200 print:bg-white">
          <h2 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-orange-500 rounded-full" />
            基本信息
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">项目名称</span>
              <span className="text-stone-900 font-medium">{project?.name ?? '-'}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">项目地址</span>
              <span className="text-stone-700">{project?.address ?? '-'}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">方案名称</span>
              <span className="text-stone-900 font-medium">{scheme?.title ?? session.location}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">工程类型</span>
              <span className="text-stone-700">{hazardType || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">交底时间</span>
              <span className="text-stone-700">{session.date}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">交底地点</span>
              <span className="text-stone-700">{session.location}</span>
            </div>
            <div className="flex">
              <span className="text-stone-500 w-16 flex-shrink-0">组织人</span>
              <span className="text-stone-700">{roleLabel}</span>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-orange-500 rounded-full" />
            <Users size={12} className="text-orange-500" />
            签到人员明细（共{session.signRecords.length}人）
          </h2>

          {Object.keys(tradeCount).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.entries(tradeCount).map(([t, c]) => (
                <span key={t} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                  {t} {c}人
                </span>
              ))}
            </div>
          )}

          {session.signRecords.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6 bg-stone-50 rounded-lg">暂无签到记录</p>
          ) : (
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 text-stone-600">
                  <tr>
                    <th className="py-2 px-2 text-left font-medium w-8">序</th>
                    <th className="py-2 px-2 text-left font-medium">姓名</th>
                    <th className="py-2 px-2 text-left font-medium">工种</th>
                    <th className="py-2 px-2 text-left font-medium">身份证号</th>
                    <th className="py-2 px-2 text-left font-medium w-16">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {session.signRecords.map((sr, i) => (
                    <tr key={sr.id} className={i % 2 ? 'bg-stone-50/50' : 'bg-white'}>
                      <td className="py-2 px-2 text-stone-400">{i + 1}</td>
                      <td className="py-2 px-2 text-stone-900 font-medium">{sr.name}</td>
                      <td className="py-2 px-2 text-stone-600">{sr.trade}</td>
                      <td className="py-2 px-2 text-stone-500 font-mono text-[10px]">
                        {sr.idCard.slice(0, 6)}****{sr.idCard.slice(-4)}
                      </td>
                      <td className="py-2 px-2 text-stone-500">{sr.signedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {session.signRecords.length > 0 && (
            <div className="mt-3 bg-stone-50 rounded-xl p-3 print:border print:border-stone-200 print:bg-white">
              <p className="text-[10px] text-stone-500 mb-2">电子签名</p>
              <div className="grid grid-cols-4 gap-2">
                {session.signRecords.slice(0, 8).map(sr => (
                  <div key={sr.id} className="bg-white border border-stone-100 rounded-lg p-1.5 aspect-[3/2] flex flex-col items-center justify-center">
                    {sr.signature ? (
                      <img src={sr.signature} alt={`${sr.name}签名`} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[8px] text-stone-300">无</span>
                    )}
                    <span className="text-[8px] text-stone-400 mt-0.5">{sr.name}</span>
                  </div>
                ))}
                {session.signRecords.length > 8 && (
                  <div className="bg-white border border-dashed border-stone-200 rounded-lg aspect-[3/2] flex items-center justify-center text-[10px] text-stone-400">
                    +{session.signRecords.length - 8}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {session.photos.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              <Camera size={12} className="text-orange-500" />
              现场照片（共{session.photos.length}张）
            </h2>
            <div className="grid grid-cols-3 gap-1.5">
              {session.photos.map((photo, index) => (
                <div key={`${photo.id}-${index}`} className="relative">
                  <img
                    src={photo.url}
                    alt={`现场照片${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-stone-100"
                  />
                  <span className="absolute bottom-1 left-1 text-[8px] text-white bg-black/40 px-1 rounded">
                    {index + 1}/{session.photos.length}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-4 mt-6 border-t border-dashed border-stone-300">
          <div className="grid grid-cols-2 gap-8 text-xs text-stone-500">
            <div>
              <p className="mb-1">安全员签字</p>
              <div className="border-b border-stone-400 h-8" />
            </div>
            <div>
              <p className="mb-1">日期</p>
              <div className="border-b border-stone-400 h-8" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-[10px] text-stone-300">
              本记录通过《危大工程交底》移动平台生成，具有电子签名和现场照片佐证
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { background: white; max-width: 100%; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:border { border-width: 1px !important; }
          .print\\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          #briefing-report { padding: 0 !important; }
        }
      `}</style>
    </div>
  )
}
