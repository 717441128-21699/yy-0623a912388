import type { Project, HazardType, Scheme, ControlPoint, ConstructionStep, AcceptanceNode, Prohibition, QuizQuestion, Feedback } from '@/types'

export const projects: Project[] = [
  { id: 'p1', name: '北京朝阳综合体项目', address: '北京市朝阳区建国路88号', status: '进行中' },
  { id: 'p2', name: '上海浦东商业中心项目', address: '上海市浦东新区陆家嘴环路100号', status: '进行中' },
  { id: 'p3', name: '广州南沙港区项目', address: '广州市南沙区港前大道200号', status: '暂停' },
]

export const hazardTypes: HazardType[] = [
  { id: 'ht1', projectId: 'p1', name: '悬挑脚手架', icon: 'Scaffold', description: '外挑式脚手架搭设与使用' },
  { id: 'ht2', projectId: 'p1', name: '暗挖工程', icon: 'Pickaxe', description: '地下暗挖隧道施工作业' },
  { id: 'ht3', projectId: 'p1', name: '深基坑工程', icon: 'Construction', description: '开挖深度超过5m的基坑' },
  { id: 'ht4', projectId: 'p2', name: '高大模板', icon: 'LayoutGrid', description: '搭设高度8m及以上模板体系' },
  { id: 'ht5', projectId: 'p2', name: '吊装工程', icon: 'Crane', description: '大型构件起重吊装作业' },
  { id: 'ht6', projectId: 'p3', name: '脚手架拆除', icon: 'Hammer', description: '脚手架分段拆除作业' },
]

export const schemes: Scheme[] = [
  { id: 's1', typeId: 'ht1', title: '悬挑脚手架专项施工方案', description: '本方案适用于北京朝阳综合体项目外挑式脚手架搭设与使用，含型钢悬挑、钢丝绳卸载等关键环节。' },
  { id: 's2', typeId: 'ht2', title: '暗挖工程专项施工方案', description: '本方案适用于北京朝阳综合体项目地下暗挖隧道施工作业，含超前支护、开挖步序、监控量测等。' },
  { id: 's3', typeId: 'ht3', title: '深基坑工程专项施工方案', description: '本方案适用于北京朝阳综合体项目深基坑开挖与支护，含降水、支护、监测等关键工序。' },
  { id: 's4', typeId: 'ht4', title: '高大模板专项施工方案', description: '本方案适用于上海浦东商业中心项目高大模板支撑体系搭设与拆除。' },
  { id: 's5', typeId: 'ht5', title: '吊装工程专项施工方案', description: '本方案适用于上海浦东商业中心项目大型构件起重吊装作业。' },
  { id: 's6', typeId: 'ht6', title: '脚手架拆除专项施工方案', description: '本方案适用于广州南沙港区项目脚手架分段拆除作业。' },
]

export const controlPoints: ControlPoint[] = [
  { id: 'cp1', schemeId: 's1', title: '悬挑型钢锚固', description: '型钢悬挑端锚固点必须设置在结构梁上，锚固长度不应小于悬挑长度的1.25倍', level: 'critical' },
  { id: 'cp2', schemeId: 's1', title: '钢丝绳卸载', description: '每层悬挑段必须设置钢丝绳卸载，钢丝绳夹头不少于3个', level: 'critical' },
  { id: 'cp3', schemeId: 's1', title: '连墙件设置', description: '两步三跨设置刚性连墙件，严禁柔性连墙', level: 'critical' },
  { id: 'cp4', schemeId: 's1', title: '脚手板铺设', description: '脚手板必须满铺，不得有探头板，搭接长度不小于200mm', level: 'important' },
  { id: 'cp5', schemeId: 's1', title: '防护栏杆', description: '操作层外侧设置1.2m高防护栏杆和18cm挡脚板', level: 'important' },
  { id: 'cp6', schemeId: 's2', title: '超前支护', description: '暗挖前必须完成超前小导管注浆支护，注浆压力不低于0.5MPa', level: 'critical' },
  { id: 'cp7', schemeId: 's2', title: '开挖步序', description: '严格遵循"管超前、严注浆、短开挖、强支护、早封闭、勤量测"十八字方针', level: 'critical' },
  { id: 'cp8', schemeId: 's2', title: '通风排烟', description: '洞内通风量不小于每人3m³/min，含尘量不超过2mg/m³', level: 'important' },
  { id: 'cp9', schemeId: 's2', title: '监控量测', description: '拱顶下沉和水平收敛每日量测，累计变形超过30mm须报警', level: 'critical' },
  { id: 'cp10', schemeId: 's2', title: '应急逃生', description: '作业面至洞口设置明显逃生指示标识，保持通道畅通', level: 'important' },
  { id: 'cp11', schemeId: 's3', title: '降水施工', description: '基坑开挖前地下水位须降至坑底以下0.5m，降水井间距不大于15m', level: 'critical' },
  { id: 'cp12', schemeId: 's3', title: '支护结构', description: '围护桩施工垂直度偏差不大于1%，桩身混凝土强度达设计要求后方可开挖', level: 'critical' },
  { id: 'cp13', schemeId: 's3', title: '监测预警', description: '周边建筑物沉降超过10mm、地下管线位移超过20mm须报警', level: 'critical' },
  { id: 'cp14', schemeId: 's3', title: '排水措施', description: '坑底设置排水沟和集水井，暴雨天气停止开挖作业', level: 'important' },
  { id: 'cp15', schemeId: 's4', title: '立杆间距', description: '立杆纵横向间距不大于900mm，扫地杆距地不大于200mm', level: 'critical' },
  { id: 'cp16', schemeId: 's4', title: '剪刀撑设置', description: '满堂架四边及中间每隔4排立杆设置竖向剪刀撑', level: 'important' },
  { id: 'cp17', schemeId: 's5', title: '吊装警戒', description: '吊装作业区域设置警戒线，非作业人员不得进入，警戒半径不小于构件长度1.5倍', level: 'critical' },
  { id: 'cp18', schemeId: 's5', title: '索具检查', description: '吊装前检查钢丝绳断丝、变形情况，达到报废标准严禁使用', level: 'critical' },
  { id: 'cp19', schemeId: 's6', title: '拆除顺序', description: '自上而下逐层拆除，严禁上下同时作业，连墙件随脚手架逐层拆除', level: 'critical' },
  { id: 'cp20', schemeId: 's6', title: '抛掷禁止', description: '拆下的构配件严禁抛掷，必须用绳索或滑轮缓慢放至地面', level: 'critical' },
]

export const constructionSteps: ConstructionStep[] = [
  { id: 'cs1', schemeId: 's1', order: 1, title: '预埋锚固件', description: '在结构楼板预埋U型锚固环，间距不大于1.5m' },
  { id: 'cs2', schemeId: 's1', order: 2, title: '安装悬挑型钢', description: '穿入工字钢，固定端用锚固螺栓紧固，外挑长度不大于1.8m' },
  { id: 'cs3', schemeId: 's1', order: 3, title: '搭设底部架体', description: '在型钢上搭设扫地杆、立杆、大横杆，立杆对接接头错开' },
  { id: 'cs4', schemeId: 's1', order: 4, title: '安装钢丝绳', description: '每根立杆对应一根钢丝绳，上端锚固于上层结构' },
  { id: 'cs5', schemeId: 's1', order: 5, title: '铺设脚手板及防护', description: '满铺脚手板，安装防护栏杆、挡脚板和密目安全网' },
  { id: 'cs6', schemeId: 's1', order: 6, title: '验收合格后使用', description: '经安全员、施工员联合验收合格后方可投入使用' },
  { id: 'cs7', schemeId: 's2', order: 1, title: '超前小导管注浆', description: '沿拱部轮廓打入小导管并注浆加固前方围岩' },
  { id: 'cs8', schemeId: 's2', order: 2, title: '上部开挖支护', description: '开挖上台阶，安装格栅钢架并喷射混凝土' },
  { id: 'cs9', schemeId: 's2', order: 3, title: '下部开挖支护', description: '开挖下台阶，及时封闭成环' },
  { id: 'cs10', schemeId: 's2', order: 4, title: '二次衬砌', description: '铺设防水层后浇筑二次衬砌混凝土' },
  { id: 'cs11', schemeId: 's2', order: 5, title: '监控量测', description: '持续进行拱顶下沉和水平收敛量测，确保变形在控制范围内' },
  { id: 'cs12', schemeId: 's3', order: 1, title: '降水施工', description: '施工降水井，将地下水位降至坑底以下0.5m' },
  { id: 'cs13', schemeId: 's3', order: 2, title: '围护桩施工', description: '施工围护桩和冠梁，形成封闭止水帷幕' },
  { id: 'cs14', schemeId: 's3', order: 3, title: '分层开挖', description: '分层分段开挖，每层深度不超过3m，开挖后及时施工支撑' },
  { id: 'cs15', schemeId: 's3', order: 4, title: '底板施工', description: '开挖至设计标高后施工垫层和底板' },
  { id: 'cs16', schemeId: 's3', order: 5, title: '回填与监测', description: '结构施工完成后对称回填，持续监测周边变形' },
]

export const acceptanceNodes: AcceptanceNode[] = [
  { id: 'an1', schemeId: 's1', title: '型钢锚固验收', type: '必检', description: '检查锚固螺栓扭矩、锚固长度、型钢外挑长度' },
  { id: 'an2', schemeId: 's1', title: '架体搭设验收', type: '必检', description: '检查立杆间距、连墙件数量、剪刀撑设置' },
  { id: 'an3', schemeId: 's1', title: '防护设施验收', type: '必检', description: '检查脚手板铺设、栏杆高度、安全网封闭' },
  { id: 'an4', schemeId: 's1', title: '钢丝绳卸载验收', type: '抽检', description: '检查钢丝绳规格、夹头数量、锚固点位置' },
  { id: 'an5', schemeId: 's2', title: '超前支护验收', type: '必检', description: '检查小导管长度、间距、注浆量和注浆压力' },
  { id: 'an6', schemeId: 's2', title: '初期支护验收', type: '必检', description: '检查格栅钢架间距、喷射混凝土厚度、钢架连接质量' },
  { id: 'an7', schemeId: 's2', title: '防水层验收', type: '必检', description: '检查防水板焊接质量、搭接宽度' },
  { id: 'an8', schemeId: 's2', title: '二次衬砌验收', type: '抽检', description: '检查衬砌厚度、钢筋间距、混凝土强度' },
  { id: 'an9', schemeId: 's3', title: '降水验收', type: '必检', description: '确认地下水位已降至坑底以下0.5m' },
  { id: 'an10', schemeId: 's3', title: '围护结构验收', type: '必检', description: '检查围护桩垂直度、桩身完整性、冠梁连接' },
  { id: 'an11', schemeId: 's3', title: '支撑系统验收', type: '必检', description: '检查钢支撑安装位置、预加轴力、连接节点' },
  { id: 'an12', schemeId: 's3', title: '底板验收', type: '必检', description: '检查垫层厚度、底板钢筋、混凝土强度' },
]

export const prohibitions: Prohibition[] = [
  { id: 'pr1', schemeId: 's1', title: '严禁拆除连墙件', description: '施工期间严禁擅自拆除任何连墙件，如需拆除必须经技术负责人批准并采取加固措施' },
  { id: 'pr2', schemeId: 's1', title: '严禁超载使用', description: '脚手架施工荷载不得超过2kN/m²，严禁集中堆放材料' },
  { id: 'pr3', schemeId: 's1', title: '严禁恶劣天气作业', description: '6级以上大风、雷雨、大雾等恶劣天气严禁脚手架上作业' },
  { id: 'pr4', schemeId: 's2', title: '严禁超挖', description: '每次进尺不得超过格栅钢架间距，严禁超挖后补支护' },
  { id: 'pr5', schemeId: 's2', title: '严禁单独作业', description: '洞内作业人员不得少于2人，必须有人在外监护' },
  { id: 'pr6', schemeId: 's2', title: '严禁停风作业', description: '通风系统故障时严禁入内作业，必须等恢复通风并检测合格后方可继续' },
  { id: 'pr7', schemeId: 's3', title: '严禁无支撑开挖', description: '必须先撑后挖，严禁超挖后补撑' },
  { id: 'pr8', schemeId: 's3', title: '严禁雨天施工', description: '中雨及以上天气严禁基坑开挖作业' },
  { id: 'pr9', schemeId: 's3', title: '严禁坑边堆载', description: '基坑边缘1.5m范围内严禁堆放材料，1.5m外堆载不超过15kPa' },
  { id: 'pr10', schemeId: 's4', title: '严禁早拆', description: '混凝土强度未达到设计要求严禁拆模，需留置同条件试块' },
  { id: 'pr11', schemeId: 's4', title: '严禁私自改动支撑', description: '模板支撑体系搭设后严禁私自改动，如需调整须技术负责人审批' },
  { id: 'pr12', schemeId: 's5', title: '严禁斜拉斜吊', description: '起重吊装严禁斜拉斜吊，吊物必须垂直起升' },
  { id: 'pr13', schemeId: 's5', title: '严禁风力超标作业', description: '风力6级及以上严禁吊装作业' },
  { id: 'pr14', schemeId: 's6', title: '严禁整体推倒', description: '脚手架严禁整体推倒拆除，必须自上而下逐层拆除' },
  { id: 'pr15', schemeId: 's6', title: '严禁交叉作业', description: '拆除区域下方严禁其他人员作业或通行，必须设置警戒区' },
]

export const quizQuestions: QuizQuestion[] = [
  { id: 'q1', schemeId: 's1', question: '悬挑脚手架型钢锚固长度不应小于悬挑长度的多少倍？', options: ['1.0倍', '1.25倍', '1.5倍', '2.0倍'], answerIndex: 1, explanation: '根据规范要求，型钢悬挑端锚固长度不应小于悬挑长度的1.25倍' },
  { id: 'q2', schemeId: 's1', question: '连墙件的设置要求是？', options: ['两步两跨', '两步三跨', '三步三跨', '三步四跨'], answerIndex: 1, explanation: '悬挑脚手架连墙件应按两步三跨设置' },
  { id: 'q3', schemeId: 's1', question: '脚手架施工荷载不得超过多少？', options: ['1kN/m²', '2kN/m²', '3kN/m²', '4kN/m²'], answerIndex: 1, explanation: '脚手架施工荷载不得超过2kN/m²' },
  { id: 'q4', schemeId: 's1', question: '几级以上大风严禁脚手架上作业？', options: ['4级', '5级', '6级', '7级'], answerIndex: 2, explanation: '6级以上大风严禁脚手架上作业' },
  { id: 'q5', schemeId: 's2', question: '暗挖工程的核心方针是？', options: ['先撑后挖、分层施工', '管超前、严注浆、短开挖、强支护、早封闭、勤量测', '边开挖、边支护、边监测', '快开挖、慢支护、早封闭'], answerIndex: 1, explanation: '暗挖工程遵循"管超前、严注浆、短开挖、强支护、早封闭、勤量测"十八字方针' },
  { id: 'q6', schemeId: 's2', question: '暗挖超前注浆压力不低于多少？', options: ['0.2MPa', '0.3MPa', '0.5MPa', '0.8MPa'], answerIndex: 2, explanation: '超前小导管注浆压力不低于0.5MPa' },
  { id: 'q7', schemeId: 's2', question: '洞内作业最少几人？', options: ['1人', '2人', '3人', '4人'], answerIndex: 1, explanation: '洞内作业人员不得少于2人，必须有人在外监护' },
  { id: 'q8', schemeId: 's3', question: '基坑开挖前地下水位应降至坑底以下多少？', options: ['0.3m', '0.5m', '0.8m', '1.0m'], answerIndex: 1, explanation: '地下水位须降至坑底以下0.5m方可开挖' },
  { id: 'q9', schemeId: 's3', question: '基坑边缘1.5m范围内能否堆放材料？', options: ['可以堆放轻型材料', '可以堆放但不超过1吨', '严禁堆放任何材料', '经批准可以堆放'], answerIndex: 2, explanation: '基坑边缘1.5m范围内严禁堆放材料' },
  { id: 'q10', schemeId: 's3', question: '基坑周边建筑物沉降报警值是多少？', options: ['5mm', '10mm', '20mm', '30mm'], answerIndex: 1, explanation: '周边建筑物沉降超过10mm须报警' },
  { id: 'q11', schemeId: 's4', question: '高大模板立杆纵横向间距不大于多少？', options: ['600mm', '800mm', '900mm', '1200mm'], answerIndex: 2, explanation: '立杆纵横向间距不大于900mm' },
  { id: 'q12', schemeId: 's4', question: '拆模时混凝土强度应达到多少？', options: ['50%', '75%', '设计要求', '100%'], answerIndex: 2, explanation: '混凝土强度未达到设计要求严禁拆模' },
  { id: 'q13', schemeId: 's5', question: '吊装警戒半径不小于构件长度的多少倍？', options: ['1.0倍', '1.2倍', '1.5倍', '2.0倍'], answerIndex: 2, explanation: '吊装警戒半径不小于构件长度1.5倍' },
  { id: 'q14', schemeId: 's5', question: '能否斜拉斜吊？', options: ['可以但需加固', '经批准可以', '严禁', '短距离可以'], answerIndex: 2, explanation: '起重吊装严禁斜拉斜吊' },
  { id: 'q15', schemeId: 's6', question: '脚手架拆除的正确顺序是？', options: ['自下而上', '自上而下逐层', '从中间向两端', '整体推倒'], answerIndex: 1, explanation: '脚手架必须自上而下逐层拆除' },
  { id: 'q16', schemeId: 's6', question: '拆下的构配件如何处理？', options: ['可直接抛掷', '用绳索缓慢放下', '推倒后捡拾', '随意放置'], answerIndex: 1, explanation: '拆下的构配件严禁抛掷，必须用绳索或滑轮缓慢放至地面' },
]

export const initialFeedbacks: Feedback[] = [
  {
    id: 'fb1',
    projectId: 'p1',
    schemeId: 's1',
    description: 'A栋3层悬挑型钢锚固点处混凝土有裂缝，可能影响锚固强度',
    location: 'A栋3层东侧悬挑锚固点',
    photos: [],
    status: '待处理',
    createdAt: '2026-06-18 09:30',
    reporterRole: 'teamLeader',
    reporterName: '王建国',
  },
  {
    id: 'fb2',
    projectId: 'p1',
    schemeId: 's2',
    description: 'DK1+200段掌子面渗水量增大，超出方案预估',
    location: '暗挖隧道DK1+200掌子面',
    photos: [],
    status: '已处理',
    createdAt: '2026-06-15 14:20',
    reporterRole: 'safety',
    reporterName: '张安全',
  },
  {
    id: 'fb3',
    projectId: 'p2',
    schemeId: 's5',
    description: '吊装区域警戒标识被风吹倒，需重新设置',
    location: 'B区吊装作业面',
    photos: [],
    status: '待处理',
    createdAt: '2026-06-20 08:15',
    reporterRole: 'construction',
    reporterName: '李施工',
  },
]
