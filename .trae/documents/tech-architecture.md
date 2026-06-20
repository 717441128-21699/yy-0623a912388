## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        "React 18 + TypeScript"
        "Tailwind CSS"
        "Zustand 状态管理"
        "React Router DOM"
    end
    subgraph "数据层"
        "Mock 数据（方案/题目/记录）"
        "Zustand Store（运行时状态）"
        "LocalStorage（持久化）"
    end
    "前端层" --> "数据层"
```

## 2. 技术说明

- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init（react-ts 模板）
- 后端：无（纯前端，Mock 数据）
- 数据库：无（Zustand + LocalStorage 持久化）
- 状态管理：Zustand
- 路由：React Router DOM v6
- 图标：lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 角色选择页 |
| /projects | 项目选择页 |
| /projects/:projectId/types | 危大工程类型选择页 |
| /projects/:projectId/types/:typeId | 方案详情页 |
| /briefing | 交底签到页 |
| /briefing/sign | 签到表单+签名 |
| /briefing/quiz | 要点问答页 |
| /briefing/quiz/result | 问答结果页 |
| /feedback | 现场反馈页 |
| /feedback/new | 新建反馈 |
| /feedback/:id | 反馈详情 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    "Project" ||--o{ "HazardType" : "contains"
    "HazardType" ||--|| "Scheme" : "has"
    "Scheme" ||--o{ "ControlPoint" : "includes"
    "Scheme" ||--o{ "ConstructionStep" : "includes"
    "Scheme" ||--o{ "AcceptanceNode" : "includes"
    "Scheme" ||--o{ "Prohibition" : "includes"
    "Scheme" ||--o{ "QuizQuestion" : "includes"
    "BriefingSession" ||--o{ "SignRecord" : "has"
    "BriefingSession" ||--o{ "Photo" : "has"
    "Feedback" ||--|| "Project" : "belongs_to"

    "Project" {
        "string id PK"
        "string name"
        "string address"
        "string status"
    }
    "HazardType" {
        "string id PK"
        "string projectId FK"
        "string name"
        "string icon"
    }
    "Scheme" {
        "string id PK"
        "string typeId FK"
        "string title"
        "string description"
    }
    "ControlPoint" {
        "string id PK"
        "string schemeId FK"
        "string title"
        "string description"
        "string level"
    }
    "ConstructionStep" {
        "string id PK"
        "string schemeId FK"
        "number order"
        "string title"
        "string description"
    }
    "AcceptanceNode" {
        "string id PK"
        "string schemeId FK"
        "string title"
        "string type"
    }
    "Prohibition" {
        "string id PK"
        "string schemeId FK"
        "string title"
        "string description"
    }
    "QuizQuestion" {
        "string id PK"
        "string schemeId FK"
        "string question"
        "string[] options"
        "number answerIndex"
        "string explanation"
    }
    "BriefingSession" {
        "string id PK"
        "string schemeId FK"
        "string date"
        "string location"
    }
    "SignRecord" {
        "string id PK"
        "string sessionId FK"
        "string name"
        "string trade"
        "string idCard"
        "string signature"
    }
    "Photo" {
        "string id PK"
        "string sessionId FK"
        "string url"
        "string description"
    }
    "Feedback" {
        "string id PK"
        "string projectId FK"
        "string schemeId FK"
        "string description"
        "string location"
        "string[] photos"
        "string status"
        "string createdAt"
    }
```

### 4.2 Mock 数据

使用 TypeScript 接口定义数据结构，在 `src/data/` 目录下提供完整 Mock 数据，包含：
- 3 个项目（北京朝阳综合体、上海浦东商业中心、广州南沙港区）
- 6 种危大工程类型（悬挑脚手架、暗挖工程、深基坑、高大模板、吊装工程、脚手架拆除）
- 每种工程类型对应的完整方案数据（控制点、施工步骤、验收节点、禁止事项、问答题目）
