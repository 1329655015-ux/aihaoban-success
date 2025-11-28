// AI工具数据库 - 整合版（60+款）
const aiTools = [
    // === 对话助手类 (12款) ===
    {
        id: 1,
        name: "ChatGPT",
        category: ["chat", "writing", "productivity", "code"],
        description: "OpenAI开发的对话AI，支持复杂问题解答、代码编写、创意写作，功能最全面",
        tags: ["global", "paid", "hot"],
        rating: 4.9,
        updated: "2024-01-15",
        features: ["多轮对话", "代码生成", "文件上传"],
        url: "https://chat.openai.com"
    },
    {
        id: 2,
        name: "Claude",
        category: ["chat", "writing"],
        description: "Anthropic的AI助手，擅长长文本处理和复杂推理任务，上下文理解强",
        tags: ["global", "free"],
        rating: 4.7,
        updated: "2024-01-12",
        features: ["长文本", "逻辑推理", "安全可靠"],
        url: "https://claude.ai"
    },
    {
        id: 3,
        name: "文心一言",
        category: ["chat", "writing"],
        description: "百度开发的对话AI，中文理解优秀，适合中文场景，集成百度生态",
        tags: ["china", "free"],
        rating: 4.5,
        updated: "2024-01-12",
        features: ["中文优化", "多模态", "百度集成"],
        url: "https://yiyan.baidu.com"
    },
    {
        id: 4,
        name: "通义千问",
        category: ["chat", "code"],
        description: "阿里云的大模型，在编程和数据分析方面表现突出，适合技术用户",
        tags: ["china", "free"],
        rating: 4.4,
        updated: "2024-01-08",
        features: ["编程辅助", "数据分析", "阿里生态"],
        url: "https://tongyi.aliyun.com"
    },
    {
        id: 5,
        name: "Gemini",
        category: ["chat", "search"],
        description: "谷歌最新大模型，多模态能力强，集成谷歌生态，支持图像理解",
        tags: ["global", "free"],
        rating: 4.7,
        updated: "2024-01-14",
        features: ["多模态", "谷歌集成", "实时搜索"],
        url: "https://gemini.google.com"
    },
    {
        id: 6,
        name: "Grok",
        category: ["chat"],
        description: "马斯克xAI开发，实时网络访问，回答风格幽默直接，信息更新快",
        tags: ["global", "paid"],
        rating: 4.3,
        updated: "2024-01-10",
        features: ["实时网络", "幽默风格", "快速响应"],
        url: "https://grok.x.ai"
    },
    {
        id: 7,
        name: "讯飞星火",
        category: ["chat", "education"],
        description: "科大讯飞大模型，语音交互能力强，在教育领域表现突出",
        tags: ["china", "free"],
        rating: 4.2,
        updated: "2024-01-09",
        features: ["语音交互", "教育场景", "多模态"],
        url: "https://xinghuo.xfyun.cn"
    },
    {
        id: 8,
        name: "智谱清言",
        category: ["chat", "code"],
        description: "智谱AI开发，代码能力突出，在数学和推理方面表现优秀",
        tags: ["china", "free"],
        rating: 4.3,
        updated: "2024-01-11",
        features: ["代码能力", "数学推理", "中英双语"],
        url: "https://chatglm.cn"
    },
    {
        id: 9,
        name: "腾讯混元",
        category: ["chat", "business"],
        description: "腾讯大模型，集成腾讯生态，在商业应用场景优化",
        tags: ["china", "free"],
        rating: 4.1,
        updated: "2024-01-07",
        features: ["腾讯生态", "商业应用", "多场景"],
        url: "https://hunyuan.tencent.com"
    },
    {
        id: 10,
        name: "字节豆包",
        category: ["chat", "writing"],
        description: "字节跳动大模型，创意写作能力强，适合内容创作",
        tags: ["china", "free"],
        rating: 4.2,
        updated: "2024-01-13",
        features: ["创意写作", "内容创作", "字节生态"],
        url: "https://www.doubao.com"
    },
    {
        id: 11,
        name: "Bing Chat",
        category: ["chat", "search"],
        description: "微软必应AI助手，集成搜索功能，信息实时更新",
        tags: ["global", "free"],
        rating: 4.4,
        updated: "2024-01-10",
        features: ["实时搜索", "多模态", "免费使用"],
        url: "https://bing.com/chat"
    },
    {
        id: 12,
        name: "Perplexity AI",
        category: ["chat", "search"],
        description: "AI搜索引擎，回答准确，引用来源，信息实时",
        tags: ["global", "freemium"],
        rating: 4.6,
        updated: "2024-01-12",
        features: ["准确回答", "引用来源", "实时信息"],
        url: "https://perplexity.ai"
    },

    // === 图像设计类 (10款) ===
    {
        id: 13,
        name: "Midjourney",
        category: ["design"],
        description: "艺术级AI图像生成，通过Discord使用，创意设计首选，艺术感强",
        tags: ["global", "paid", "hot"],
        rating: 4.8,
        updated: "2024-01-10",
        features: ["艺术创作", "风格多样", "社区活跃"],
        url: "https://midjourney.com"
    },
    {
        id: 14,
        name: "Stable Diffusion",
        category: ["design"],
        description: "开源图像生成模型，可本地部署，高度自定义，控制精度高",
        tags: ["global", "free"],
        rating: 4.6,
        updated: "2024-01-05",
        features: ["开源免费", "本地部署", "高度定制"],
        url: "https://stability.ai"
    },
    {
        id: 15,
        name: "DALL-E 3",
        category: ["design"],
        description: "OpenAI的图像生成器，文字理解准确，集成ChatGPT，易用性好",
        tags: ["global", "paid"],
        rating: 4.7,
        updated: "2024-01-08",
        features: ["文字理解", "ChatGPT集成", "易用性强"],
        url: "https://openai.com/dall-e-3"
    },
    {
        id: 16,
        name: "Adobe Firefly",
        category: ["design"],
        description: "集成在Photoshop中的AI功能，专业图像编辑，商业用途安全",
        tags: ["global", "paid"],
        rating: 4.5,
        updated: "2024-01-06",
        features: ["专业级", "商业安全", "Adobe生态"],
        url: "https://www.adobe.com/firefly"
    },
    {
        id: 17,
        name: "美图秀秀AI",
        category: ["design"],
        description: "国内用户量最大的修图工具，AI功能丰富，操作简单易上手",
        tags: ["china", "free"],
        rating: 4.2,
        updated: "2024-01-11",
        features: ["简单易用", "功能丰富", "手机优化"],
        url: "https://xiuxiu.meitu.com"
    },
    {
        id: 18,
        name: "醒图",
        category: ["design"],
        description: "字节跳动修图工具，AI滤镜和特效丰富，适合手机端使用",
        tags: ["china", "free"],
        rating: 4.3,
        updated: "2024-01-09",
        features: ["AI滤镜", "手机优化", "字节生态"],
        url: "https://www.xingtu.com"
    },
    {
        id: 19,
        name: "稿定设计",
        category: ["design", "business"],
        description: "在线设计平台，AI设计功能丰富，模板库庞大",
        tags: ["china", "freemium"],
        rating: 4.4,
        updated: "2024-01-12",
        features: ["模板丰富", "在线设计", "商用素材"],
        url: "https://www.gaoding.com"
    },
    {
        id: 20,
        name: "Leonardo AI",
        category: ["design"],
        description: "高质量的AI图像生成平台，控制选项丰富，适合专业创作",
        tags: ["global", "freemium"],
        rating: 4.5,
        updated: "2024-01-13",
        features: ["高质量", "控制丰富", "专业创作"],
        url: "https://leonardo.ai"
    },
    {
        id: 21,
        name: "Canva AI",
        category: ["design", "productivity"],
        description: "Canva的AI设计功能，模板丰富，设计流程智能化",
        tags: ["global", "freemium"],
        rating: 4.6,
        updated: "2024-01-14",
        features: ["模板丰富", "智能设计", "团队协作"],
        url: "https://www.canva.com"
    },
    {
        id: 22,
        name: "Remove.bg",
        category: ["design"],
        description: "AI背景去除工具，一键抠图，处理精准快速",
        tags: ["global", "freemium"],
        rating: 4.5,
        updated: "2024-01-12",
        features: ["背景去除", "一键抠图", "处理精准"],
        url: "https://remove.bg"
    },

    // === 视频制作类 (8款) ===
    {
        id: 23,
        name: "Runway",
        category: ["video"],
        description: "全流程视频AI工具，从生成到编辑，功能全面，效果专业",
        tags: ["global", "paid"],
        rating: 4.6,
        updated: "2024-01-09",
        features: ["全流程", "专业效果", "持续更新"],
        url: "https://runwayml.com"
    },
    {
        id: 24,
        name: "Pika Labs",
        category: ["video"],
        description: "文本生成视频工具，操作简单，生成速度快，适合短视频创作",
        tags: ["global", "free"],
        rating: 4.4,
        updated: "2024-01-07",
        features: ["简单易用", "快速生成", "质量优秀"],
        url: "https://pika.art"
    },
    {
        id: 25,
        name: "剪映AI",
        category: ["video"],
        description: "抖音官方剪辑工具，AI功能强大易用，模板丰富，移动端优化",
        tags: ["china", "free"],
        rating: 4.5,
        updated: "2024-01-13",
        features: ["移动优化", "模板丰富", "简单易用"],
        url: "https://capcut.com"
    },
    {
        id: 26,
        name: "腾讯智影",
        category: ["video"],
        description: "腾讯视频AI工具，数字人播报功能强大，适合企业宣传",
        tags: ["china", "freemium"],
        rating: 4.2,
        updated: "2024-01-10",
        features: ["数字人播报", "企业级", "腾讯生态"],
        url: "https://zenvideo.qq.com"
    },
    {
        id: 27,
        name: "HeyGen",
        category: ["video", "business"],
        description: "AI数字人视频生成，支持多语言口型同步，企业级应用",
        tags: ["global", "paid"],
        rating: 4.5,
        updated: "2024-01-11",
        features: ["数字人视频", "多语言", "企业级"],
        url: "https://www.heygen.com"
    },
    {
        id: 28,
        name: "Synthesia",
        category: ["video", "business"],
        description: "企业级AI视频生成平台，数字人表现自然，多语言支持",
        tags: ["global", "paid"],
        rating: 4.4,
        updated: "2024-01-09",
        features: ["企业级", "多语言", "表现自然"],
        url: "https://www.synthesia.io"
    },
    {
        id: 29,
        name: "Descript",
        category: ["video", "audio"],
        description: "革命性视频剪辑工具，通过文本编辑视频，操作直观",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-12",
        features: ["文本编辑", "操作直观", "音频处理"],
        url: "https://www.descript.com"
    },
    {
        id: 30,
        name: "Fliki",
        category: ["video", "audio"],
        description: "文本转视频工具，集成AI语音，适合内容创作",
        tags: ["global", "freemium"],
        rating: 4.2,
        updated: "2024-01-07",
        features: ["文本转视频", "AI语音", "内容创作"],
        url: "https://fliki.ai"
    },

    // === 写作创作类 (8款) ===
    {
        id: 31,
        name: "Notion AI",
        category: ["writing", "productivity"],
        description: "集成在Notion中的AI写作助手，适合笔记整理和内容创作",
        tags: ["global", "paid"],
        rating: 4.4,
        updated: "2024-01-08",
        features: ["笔记集成", "内容创作", "知识管理"],
        url: "https://notion.ai"
    },
    {
        id: 32,
        name: "Jasper",
        category: ["writing", "business"],
        description: "专业AI写作工具，营销文案生成能力强，模板丰富",
        tags: ["global", "paid"],
        rating: 4.3,
        updated: "2024-01-06",
        features: ["营销文案", "模板丰富", "团队协作"],
        url: "https://jasper.ai"
    },
    {
        id: 33,
        name: "Copy.ai",
        category: ["writing", "business"],
        description: "AI写作助手，营销文案生成优秀，工作流程优化",
        tags: ["global", "freemium"],
        rating: 4.2,
        updated: "2024-01-11",
        features: ["营销文案", "工作流", "团队协作"],
        url: "https://www.copy.ai"
    },
    {
        id: 34,
        name: "Grammarly",
        category: ["writing", "productivity"],
        description: "英文写作助手，语法检查和风格优化，提升写作质量",
        tags: ["global", "freemium"],
        rating: 4.7,
        updated: "2024-01-12",
        features: ["语法检查", "风格优化", "多平台"],
        url: "https://grammarly.com"
    },
    {
        id: 35,
        name: "QuillBot",
        category: ["writing"],
        description: "AI文本重写工具，paraphrasing能力强，学术写作友好",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-10",
        features: ["文本重写", "学术友好", "多模式"],
        url: "https://quillbot.com"
    },
    {
        id: 36,
        name: "Writesonic",
        category: ["writing", "business"],
        description: "AI写作平台，内容生成质量高，SEO优化功能强",
        tags: ["global", "freemium"],
        rating: 4.1,
        updated: "2024-01-09",
        features: ["高质量", "SEO优化", "多语言"],
        url: "https://writesonic.com"
    },
    {
        id: 37,
        name: "Wordtune",
        category: ["writing"],
        description: "AI写作助手，句子重写和优化，提升表达效果",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-08",
        features: ["句子优化", "表达提升", "多语言"],
        url: "https://www.wordtune.com"
    },
    {
        id: 38,
        name: "Jenni AI",
        category: ["writing", "education"],
        description: "学术写作助手，论文写作优化，引用格式自动处理",
        tags: ["global", "paid"],
        rating: 4.2,
        updated: "2024-01-07",
        features: ["学术写作", "引用处理", "论文优化"],
        url: "https://jenni.ai"
    },

    // === 编程开发类 (6款) ===
    {
        id: 39,
        name: "GitHub Copilot",
        category: ["code"],
        description: "AI代码助手，支持多种语言，智能代码补全，开发效率提升明显",
        tags: ["global", "paid"],
        rating: 4.8,
        updated: "2024-01-14",
        features: ["代码补全", "多语言", "IDE集成"],
        url: "https://github.com/features/copilot"
    },
    {
        id: 40,
        name: "Cursor",
        category: ["code"],
        description: "AI驱动的代码编辑器，内置对话编程功能，开发体验流畅",
        tags: ["global", "free"],
        rating: 4.6,
        updated: "2024-01-11",
        features: ["对话编程", "智能编辑", "免费使用"],
        url: "https://cursor.sh"
    },
    {
        id: 41,
        name: "通义灵码",
        category: ["code"],
        description: "阿里云代码助手，中文注释理解优秀，集成阿里开发工具",
        tags: ["china", "free"],
        rating: 4.4,
        updated: "2024-01-13",
        features: ["中文注释", "阿里集成", "智能提示"],
        url: "https://tongyi.aliyun.com/code"
    },
    {
        id: 42,
        name: "Replit AI",
        category: ["code"],
        description: "在线IDE的AI助手，代码生成和调试，协作开发友好",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-09",
        features: ["在线IDE", "代码调试", "协作开发"],
        url: "https://replit.com"
    },
    {
        id: 43,
        name: "Tabnine",
        category: ["code"],
        description: "AI代码补全工具，支持多种编辑器，本地模型可选",
        tags: ["global", "freemium"],
        rating: 4.2,
        updated: "2024-01-10",
        features: ["代码补全", "多编辑器", "本地模型"],
        url: "https://www.tabnine.com"
    },
    {
        id: 44,
        name: "Amazon CodeWhisperer",
        category: ["code"],
        description: "亚马逊代码助手，AWS集成优秀，安全扫描功能",
        tags: ["global", "free"],
        rating: 4.1,
        updated: "2024-01-08",
        features: ["AWS集成", "安全扫描", "免费使用"],
        url: "https://aws.amazon.com/codewhisperer"
    },

    // === 音乐音频类 (4款) ===
    {
        id: 45,
        name: "Suno AI",
        category: ["music"],
        description: "AI音乐生成平台，可生成完整歌曲，支持多种音乐风格",
        tags: ["global", "free"],
        rating: 4.5,
        updated: "2024-01-09",
        features: ["完整歌曲", "多风格", "简单易用"],
        url: "https://suno.ai"
    },
    {
        id: 46,
        name: "Udio",
        category: ["music"],
        description: "高质量AI音乐生成，音质优秀，风格多样，创作自由度大",
        tags: ["global", "free"],
        rating: 4.4,
        updated: "2024-01-07",
        features: ["高音质", "风格多样", "创作自由"],
        url: "https://udio.com"
    },
    {
        id: 47,
        name: "AIVA",
        category: ["music"],
        description: "专业古典音乐AI，适合电影配乐和游戏音乐创作",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-11",
        features: ["古典音乐", "专业配乐", "情感表达"],
        url: "https://www.aiva.ai"
    },
    {
        id: 48,
        name: "Boomy",
        category: ["music"],
        description: "快速AI音乐创作平台，简单点击即可生成音乐",
        tags: ["global", "freemium"],
        rating: 4.2,
        updated: "2024-01-08",
        features: ["快速创作", "简单易用", "多种风格"],
        url: "https://boomy.com"
    },

    // === 办公效率类 (4款) ===
    {
        id: 49,
        name: "WPS AI",
        category: ["productivity"],
        description: "国产Office套件AI功能，文档处理优秀，中文支持好",
        tags: ["china", "free"],
        rating: 4.2,
        updated: "2024-01-10",
        features: ["中文优化", "文档处理", "免费使用"],
        url: "https://wps.cn"
    },
    {
        id: 50,
        name: "飞书妙记",
        category: ["productivity"],
        description: "飞书AI会议助手，录音转文字，自动生成会议纪要",
        tags: ["china", "free"],
        rating: 4.4,
        updated: "2024-01-13",
        features: ["会议纪要", "语音转写", "飞书集成"],
        url: "https://feishu.cn"
    },
    {
        id: 51,
        name: "Microsoft 365 Copilot",
        category: ["productivity"],
        description: "微软Office全家桶AI助手，集成Word、Excel、PPT等",
        tags: ["global", "paid"],
        rating: 4.5,
        updated: "2024-01-14",
        features: ["Office集成", "企业级", "功能全面"],
        url: "https://www.microsoft.com"
    },
    {
        id: 52,
        name: "Gamma",
        category: ["productivity"],
        description: "AI演示文稿工具，快速生成精美PPT，设计感强",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-11",
        features: ["快速PPT", "设计感强", "简单易用"],
        url: "https://gamma.app"
    },

    // === 额外推荐 AI 工具 (53-60) ===
    {
        id: 53,
        name: "Hugging Face",
        category: ["ai", "ml", "code", "chat"],
        description: "开源AI平台，提供模型库、API和社区资源，支持多种AI任务",
        tags: ["global", "free", "open-source"],
        rating: 4.7,
        updated: "2024-01-15",
        features: ["开源模型", "社区共享", "API接口"],
        url: "https://huggingface.co"
    },
    {
        id: 54,
        name: "RunPod",
        category: ["cloud", "ml", "video"],
        description: "GPU云服务平台，适合AI训练和视频生成，弹性租用",
        tags: ["global", "paid"],
        rating: 4.5,
        updated: "2024-01-12",
        features: ["云GPU", "弹性租用", "AI训练"],
        url: "https://www.runpod.io"
    },
    {
        id: 55,
        name: "Otter.ai",
        category: ["productivity", "audio", "meeting"],
        description: "AI会议记录工具，自动转写语音生成文字，支持团队协作",
        tags: ["global", "freemium"],
        rating: 4.6,
        updated: "2024-01-14",
        features: ["语音转文字", "会议记录", "团队共享"],
        url: "https://otter.ai"
    },
    {
        id: 56,
        name: "Character.AI",
        category: ["chat", "entertainment"],
        description: "AI角色聊天平台，可以与虚拟角色互动，对话体验有趣",
        tags: ["global", "free"],
        rating: 4.4,
        updated: "2024-01-13",
        features: ["角色扮演", "多样化对话", "趣味性"],
        url: "https://beta.character.ai"
    },
    {
        id: 57,
        name: "Lensa AI",
        category: ["design", "photo"],
        description: "AI图片编辑与生成应用，特别适合个人肖像优化",
        tags: ["global", "paid"],
        rating: 4.5,
        updated: "2024-01-11",
        features: ["人像优化", "特效滤镜", "生成图片"],
        url: "https://www.lensa-ai.com"
    },
    {
        id: 58,
        name: "CopySmith",
        category: ["writing", "marketing"],
        description: "AI文案生成工具，适合电商、营销、广告文案快速生成",
        tags: ["global", "paid"],
        rating: 4.4,
        updated: "2024-01-10",
        features: ["营销文案", "电商内容", "模板丰富"],
        url: "https://copysmith.ai"
    },
    {
        id: 59,
        name: "Runway Gen-2",
        category: ["video", "ai"],
        description: "AI视频生成平台，支持文本到视频、多模态创作",
        tags: ["global", "paid"],
        rating: 4.6,
        updated: "2024-01-09",
        features: ["文本转视频", "多模态", "快速生成"],
        url: "https://runwayml.com/gen2"
    },
    {
        id: 60,
        name: "Reface",
        category: ["video", "entertainment"],
        description: "AI换脸视频制作工具，操作简单，娱乐性强",
        tags: ["global", "freemium"],
        rating: 4.3,
        updated: "2024-01-08",
        features: ["换脸视频", "短视频生成", "趣味性"],
        url: "https://reface.app"
    }
];
