import type { AssistantPageContext } from "@/lib/assistant-types";
import { executeAssistantTool } from "@/server/services/assistant/assistant-tools";
import type { DataSourceInfo } from "@/server/services/reading-data";

function formatJsonBlock(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function formatJsonMarkdownSection(title: string, data: unknown): string {
  return `## ${title}\n\n\`\`\`json\n${formatJsonBlock(data)}\n\`\`\``;
}

/** Deterministic answers when DeepSeek is not configured. */
export async function runAssistantFallback(
  message: string,
  dataSource: DataSourceInfo,
  pageContext?: AssistantPageContext,
): Promise<{ reply: string; usedTools: string[] }> {
  const lower = message.toLowerCase();
  const usedTools: string[] = [];

  async function runTool(name: string, args = "{}"): Promise<unknown> {
    usedTools.push(name);
    return executeAssistantTool(name, args);
  }

  if (/同步|连接|数据源|演示/.test(message)) {
    const data = await runTool("get_data_source_info");
    const prefix =
      dataSource.mode === "live"
        ? "当前已使用同步快照。"
        : dataSource.hasApiKey
          ? "已配置微信读书 API Key，但尚未同步。"
          : "当前为演示数据。";
    return {
      reply: `## 数据状态\n\n${prefix}\n\n${formatJsonMarkdownSection("连接信息", data)}`,
      usedTools,
    };
  }

  if (/推荐/.test(message)) {
    const data = await runTool("get_recommendations");
    const label = dataSource.mode === "live" ? "同步数据" : "演示数据";
    return {
      reply: `## 推荐摘要\n\n基于**${label}**。\n\n${formatJsonMarkdownSection("推荐列表", data)}`,
      usedTools,
    };
  }

  if (/笔记|划线/.test(message)) {
    const args = JSON.stringify({
      bookId: pageContext?.bookId,
      range: /30/.test(message) ? "30d" : "all",
      q: "",
    });
    const data = await runTool("search_notes", args);
    return {
      reply: formatJsonMarkdownSection("笔记与划线", data),
      usedTools,
    };
  }

  if (pageContext?.bookId || /这本书|该书|重读|值不值得/.test(message)) {
    const bookId = pageContext?.bookId;
    if (bookId) {
      const data = await runTool("get_book_detail", JSON.stringify({ bookId }));
      return {
        reply: formatJsonMarkdownSection("单书数据", data),
        usedTools,
      };
    }
  }

  if (/书架|在读|想读|读完/.test(message)) {
    const data = await runTool("list_bookshelf", JSON.stringify({ status: "all", sort: "lastRead" }));
    return {
      reply: formatJsonMarkdownSection("书架", data),
      usedTools,
    };
  }

  if (/本月|这周|本周|本年|累计|统计|偏好|投入|时长/.test(message)) {
    let period = "monthly";
    if (/本周|这周/.test(message)) {
      period = "weekly";
    } else if (/本年|今年/.test(message)) {
      period = "annually";
    } else if (/累计|总共|一共/.test(message)) {
      period = "overall";
    }
    const data = await runTool("get_stats_by_period", JSON.stringify({ period }));
    return {
      reply: formatJsonMarkdownSection(`统计（${period}）`, data),
      usedTools,
    };
  }

  if (/怎么样|总览|最近/.test(message) || lower.includes("dashboard")) {
    const data = await runTool("get_dashboard_summary");
    return {
      reply: formatJsonMarkdownSection("阅读总览", data),
      usedTools,
    };
  }

  const data = await runTool("get_dashboard_summary");
  return {
    reply: [
      "## 简化模式",
      "",
      "未配置 **DEEPSEEK_API_KEY**，以下为工具原始结果（无模型润色）。在 `.env.local` 设置密钥并重启后可获得 Markdown 解读。",
      "",
      formatJsonMarkdownSection("阅读总览", data),
    ].join("\n"),
    usedTools,
  };
}
