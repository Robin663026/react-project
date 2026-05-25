## 目标

把"指标对标"Tab 重做成 **可拖拽配置的指标对比工作台**，并把左侧指标库扩展为 **上市公司公开可获取**（年报/季报/Wind/巨潮/同花顺）的标准指标体系。保留现有玻璃拟态 UI 风格（`glass`、`gradient-soft`、semantic tokens）。

---

## 一、新指标库（上市公司公开可获取）

替换 `src/lib/benchmark/metrics.ts` 的 `metricCatalog`，按 **5 大类 ~30 个标准财报指标** 重建。所有指标均来自定期报告或 Wind/同花顺，便于横向比较：

```text
1. 规模与成长
   营业总收入 / 归母净利润 / 扣非净利润 / 经营性现金流净额 /
   营收同比 / 净利润同比 / 三年营收 CAGR

2. 盈利能力
   毛利率 / 净利率 / 销售净利率 / ROE(摊薄) / ROA / EBITDA Margin

3. 运营效率
   存货周转天数 / 应收账款周转天数 / 应付账款周转天数 /
   总资产周转率 / 现金循环周期

4. 财务健康
   资产负债率 / 流动比率 / 速动比率 / 利息保障倍数 /
   有息负债率 / 货币资金占总资产

5. 投入与回报
   研发费用率 / 研发人员占比 / 资本开支/营收 /
   每股收益 EPS / 每股经营现金流 / 股息支付率
```

每个指标补充 `unit`、`better: 'high'|'low'`、`source` 字段（如"年报-利润表"），用于工作台显示口径与来源标签。`getMetricRows` 扩展对应 mock 数据。

---

## 二、对比工作台（替换 `MetricBenchmarkView`）

新组件 `MetricWorkbench`，三栏布局，所有卡片用现有 `Card`（glass 玻璃风格）：

```text
┌──────────────┬─────────────────────────────────┬──────────────┐
│ 指标库（左） │      对比画布（中，可拖拽）     │ 对比对象（右）│
│              │                                  │              │
│ 搜索框       │ ┌── 已选指标卡片（可拖动排序）──┐ │ 公司池       │
│ 5 大分组     │ │ [≡] 营业总收入  图表型: 条形▾ │ │ ☑ 本企业    │
│ • 30+ 指标   │ │     [删除]                    │ │ ☑ 行业龙头A │
│ ⌗ 拖拽到中间 │ ├──────────────────────────────┤ │ ☑ 同行 B    │
│              │ │ [≡] 毛利率      图表型: 热力▾ │ │ + 添加      │
│ 模板预设：   │ ├──────────────────────────────┤ │              │
│ • 盈利能力   │ │ [≡] ROE         图表型: 表格▾ │ │ 维度：      │
│ • 效率       │ └──────────────────────────────┘ │ ○ 公司      │
│ • 财务健康   │                                  │ ○ 区域      │
│              │ [+ 从指标库拖入 / 双击添加]      │ ○ 业务线    │
│              │                                  │ ○ 时间      │
└──────────────┴─────────────────────────────────┴──────────────┘
                  顶部工具栏：保存视图 ▸ 加载模板 ▸ 导出 ▸ 加入报告
                  底部：AI 综合洞察（基于全部已选指标自动总结）
```

### 交互
- **拖拽**：用 `@dnd-kit/core` + `@dnd-kit/sortable`（轻量、SSR 友好）。
  - 左侧指标项可拖到中间画布（添加）。
  - 中间已选卡片间拖动 = 排序。
  - 拖出画布 = 移除。
  - 双击左侧指标 = 快速添加（不会拖也能用）。
- **每张指标卡片**：标题 + 单位 + 来源 tag + 图表类型切换（条形/热力/表格/迷你线）+ 删除。图表复用现有 recharts 模式。
- **对比对象**：右栏复选公司（来自 `peers.ts`），切换维度（公司/区域/业务线/时间）。当前选择对所有指标卡片生效。
- **预设模板**：左侧底部"盈利能力 / 效率 / 财务健康"一键载入 3-5 个常用指标组合。
- **空画布**：显示拖拽提示和"加载预设"按钮。
- **保存视图**：localStorage 存当前指标 + 公司组合，可命名（如"vs 行业龙头"）。
- **AI 洞察**：画布底部 `AiSummaryCard`，依据当前所选指标 + 公司，输出对比结论（保留现有 mock 文案模式）。

### 风格守则
- 仍用 `glass` Card、`gradient-soft` 卡片、`gradient-primary` 主按钮、semantic 颜色（`text-success` / `text-destructive` / `bg-primary/15`）。
- 拖拽时的 ghost / drop 区用 `border-dashed border-primary/40 bg-primary/[0.04]`（已有 token 配合）。
- 不新增颜色变量，不改 `src/styles.css`。

---

## 三、文件改动

**新增：**
- `src/components/benchmark/workbench/MetricWorkbench.tsx`（主入口，替代旧 `MetricBenchmarkView` 在 Tab 中的位置）
- `src/components/benchmark/workbench/MetricLibrary.tsx`（左栏，搜索 + 分组 + 拖拽源 + 模板）
- `src/components/benchmark/workbench/MetricCanvas.tsx`（中栏，SortableContext + 已选指标渲染）
- `src/components/benchmark/workbench/MetricCard.tsx`（单个指标卡，含图表类型切换 + bar/heatmap/table 渲染）
- `src/components/benchmark/workbench/PeerSelector.tsx`（右栏，公司复选 + 维度切换）
- `src/components/benchmark/workbench/presets.ts`（指标模板定义）
- `src/components/benchmark/workbench/useWorkbenchState.ts`（状态 + localStorage 持久化）

**修改：**
- `src/lib/benchmark/metrics.ts`（重建指标库 + 扩展数据结构 + 补 mock 数据）
- `src/routes/benchmark.tsx`（`<MetricBenchmarkView />` → `<MetricWorkbench />`）

**删除（可选）：**
- `src/components/benchmark/MetricBenchmarkView.tsx` 旧组件（被替换）

**依赖：**
- `bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

---

## 四、技术细节

```ts
// useWorkbenchState
type ChartType = 'bar' | 'heatmap' | 'table' | 'spark';
type SelectedMetric = { key: string; chart: ChartType };
type ViewState = {
  metrics: SelectedMetric[];
  peerIds: string[];
  dim: Dimension;
};
```

- `DndContext` 包整个工作台；`useDraggable`（左栏指标）+ `useSortable`（中栏卡片）。
- 拖拽 `onDragEnd`：`over.id === 'canvas'` 时 push；`active` & `over` 都在 canvas 时 reorder；`over.id === 'trash'` 时移除。
- 数据缺失指标 → fallback 到 `revenue` 数据集（已有的 mock 行为）以保证视觉完整。

完成后，"指标对标"将变成一个真正的 **自助分析工作台**，且全部指标对外可获取。
