// Portfolio content — edit this file to personalize the site.
// Every section key maps to a hotspot inside the 3D café scene.

export type SectionId = "about" | "projects" | "shop" | "contact";

export const profile = {
  name: "Cấn Xuân Tùng",
  role: "Senior Full-Stack Developer",
  cafeName: "Brew & Code",
};

export type Experience = { company: string; title: string; period: string };

export const about = {
  title: "Giới thiệu",
  paragraphs: [
    "Xin chào! Mình là Cấn Xuân Tùng — Senior Full-Stack Developer với hơn 6 năm kinh nghiệm xây dựng hệ thống phân tán cho doanh nghiệp, kiến trúc cloud-native và ứng dụng web hiệu năng cao.",
    "Thế mạnh của mình là Java (Spring Boot, Spring Cloud), Angular, React/Next.js cùng Node.js và Go; thiết kế REST/GraphQL API và microservices, tối ưu tìm kiếm với Elasticsearch, triển khai hạ tầng trên AWS.",
    "Mình cũng tích hợp Generative AI & LLM (OpenAI, Azure OpenAI, Claude, RAG) vào sản phẩm và dùng các công cụ AI-assisted như Cursor, GitHub Copilot, Claude Code để tăng tốc cho team.",
  ],
  skills: [
    "Java / Spring Boot",
    "Spring Cloud",
    "Angular",
    "React / Next.js",
    "TypeScript",
    "Node.js / NestJS",
    "Go",
    "Elasticsearch",
    "PostgreSQL",
    "Oracle",
    "MongoDB",
    "Redis",
    "AWS",
    "Docker / K8s",
    "GenAI / LLM / RAG",
    "Web3 / Smart contract",
    "React Native / Flutter",
  ],
  experienceTitle: "Kinh nghiệm",
  experience: [
    { company: "Global Technology Solutions", title: "Senior Full-Stack Developer", period: "05/2025 – nay" },
    { company: "Binh Minh Group (BMG)", title: "Lead / Senior Full-Stack Developer", period: "12/2023 – 05/2025" },
    { company: "Navisoft (Nam Viet Software)", title: "Frontend Developer", period: "04/2021 – 10/2022" },
    { company: "FPT Software", title: "Backend / Java Software Engineer", period: "10/2020 – 04/2021" },
    { company: "Haedap JSC", title: "Software Developer", period: "04/2019 – 03/2022" },
  ] satisfies Experience[],
  educationTitle: "Học vấn",
  education: {
    school: "Đại học Công nghiệp Hà Nội (HaUI)",
    degree: "Cử nhân Kỹ thuật Phần mềm · GPA 3.96 / 4.0",
    period: "2018 – 2022",
  },
};

export type Project = {
  name: string;
  meta: string;
  description: string;
  tags: string[];
  href?: string;
};

export const projects: { title: string; items: Project[] } = {
  title: "Dự án",
  items: [
    {
      name: "Trustinfy",
      meta: "Sàn giao dịch sản phẩm số & dịch vụ · trustinfy.com",
      description:
        "Marketplace \"Mua tài nguyên bạn cần, thuê dịch vụ bạn muốn\": sản phẩm số, dịch vụ theo yêu cầu và freelance. Thanh toán tạm giữ (escrow) — tiền chỉ tới người bán khi người mua xác nhận, người bán xác minh eKYC, xử lý tranh chấp 24/7 và hoàn tiền minh bạch.",
      tags: ["Marketplace", "Escrow payment", "eKYC", "Dispute resolution", "SSL 256-bit"],
      href: "https://trustinfy.com",
    },
    {
      name: "VietNEST",
      meta: "07/2025 – 01/2026 · ASIF · Lead Fullstack & AI Systems",
      description:
        "Nền tảng học tập thích ứng dùng AI (LMS, gamification, chấm phát âm và hội thoại real-time) cho hàng nghìn học sinh khu vực Australasia. Tự thiết kế kiến trúc multi-app, Elasticsearch cho tìm kiếm bài học dưới 1 giây, tích hợp OpenAI, Azure Speech, ElevenLabs qua Kafka.",
      tags: ["React / Vite", "NestJS", "FastAPI", "Elasticsearch", "Kafka", "OpenAI", "AWS"],
      href: "https://vietnest.au",
    },
    {
      name: "Horae Digital Passport",
      meta: "05/2025 – 02/2026 · Horae · Fullstack",
      description:
        "Nền tảng Digital Product Passport gắn sản phẩm vật lý với danh tính số: B2B Brand Dashboard (ECharts, Mapbox) và B2C Claim App với quét QR, render sản phẩm 3D bằng Three.js, ví nhúng Privy và gasless meta-transactions.",
      tags: ["React", "NestJS", "MongoDB", "Redis / BullMQ", "Three.js", "Viem / Ethers.js"],
      href: "https://www.horae.io",
    },
    {
      name: "Terrafuse – EV Charging IoT",
      meta: "05/2025 – 02/2026 · Terrafuse · Senior Full-Stack & Backend Architecture",
      description:
        "Backend event-driven cho mạng sạc xe điện: 200.000 người dùng, 10.000 kết nối WebSocket OCPP đồng thời. Webhook ký HMAC, idempotency bằng Redis, retry + DLQ, ví trả trước và billing Stripe với ledger nguyên tử.",
      tags: ["Java / Node.js", "NestJS", "WebSocket", "Redis", "PostgreSQL", "Stripe", "AWS"],
    },
    {
      name: "AutoMT5",
      meta: "11/2024 – 03/2025 · Fintech Systems · Lead Backend & Automation",
      description:
        "Bot định tuyến lệnh độ trễ thấp: nhận webhook TradingView, xác thực payload và đặt lệnh trên MetaTrader 5. Hàng đợi Redis/BullMQ chịu tải lúc thị trường biến động, dashboard phân tích win-rate và drawdown.",
      tags: ["Node.js", "Python", "MetaTrader 5", "Redis / BullMQ", "WebSocket"],
      href: "https://github.com/cxtdev2000/automt5",
    },
    {
      name: "PleaseSpeak V2",
      meta: "07/2024 – 04/2025 · Binh Minh Group · Fullstack",
      description:
        "Nền tảng luyện giao tiếp tiếng Anh với AI chấm phát âm, độ trôi chảy, ngữ pháp (OpenAI, Azure AI, Prompt Engineering, RAG). Xây CMS API và Client API, phản hồi real-time qua SignalR, làm việc cùng chuyên gia ngôn ngữ để tinh chỉnh mô hình.",
      tags: ["React / shadcn", "Node.js", "MongoDB", "RabbitMQ", "OpenAI / Azure AI", "AWS"],
      href: "https://pleasespeak.vn",
    },
    {
      name: "Tokenmetrics",
      meta: "07/2024 – 10/2024 · Token Metrics · Fullstack",
      description:
        "Nền tảng phân tích crypto real-time: theo dõi danh mục, phân tích kỹ thuật, chat tích hợp. Elasticsearch cho tìm kiếm token và auto-complete, SSR Next.js cho SEO, triển khai và tối ưu trên AWS.",
      tags: ["Next.js", "Elasticsearch", "Firebase", "SignalR", "AWS"],
      href: "https://tokenmetrics.com",
    },
    {
      name: "Stack Trading",
      meta: "05/2024 – 11/2024 · Stack Trading LLC · Senior Full-Stack & Fintech",
      description:
        "Nền tảng đánh giá prop trading và engine quản lý rủi ro: nhận tín hiệu TradingView, route lệnh sang MT5, ledger giao dịch nguyên tử, dashboard nến real-time qua Redis Pub/Sub, uptime 99.99%.",
      tags: ["Java / Node.js", "Next.js", "Go", "PostgreSQL", "Redis Pub/Sub", "MT5 API"],
    },
    {
      name: "Golden Opportunities (GOALS)",
      meta: "11/2023 – 06/2024 · Alpha Bravo Development · Full-Stack Enterprise",
      description:
        "Hệ thống CRM và điều phối workflow: onboarding khách hàng, ký hợp đồng điện tử BoldSign, thanh toán Stripe, phân phối lead đa kênh, audit log và activity feed real-time.",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe", "BoldSign", "AWS"],
    },
    {
      name: "3D Model Marketplace",
      meta: "08/2023 – 02/2024 · Creative Digital Studio · Senior Full-Stack",
      description:
        "Marketplace trưng bày và giao dịch model 3D high-poly: viewer/showroom Three.js/WebGL với ánh sáng real-time, API catalog và chuyển đổi GLTF/OBJ/FBX, tải asset an toàn qua S3 presigned URL.",
      tags: ["React", "Three.js / WebGL", "Node.js", "PostgreSQL", "AWS S3", "Stripe"],
    },
    {
      name: "Kosenoba & Empower",
      meta: "08/2022 – 04/2024 · Zotek8 · Senior Full-Stack",
      description:
        "Hệ sinh thái quản lý phòng khám và telehealth: hồ sơ bệnh án điện tử chuẩn HIPAA, lịch khám tự động, thông báo real-time. Refactor sang Go và Next.js giảm 45% độ trễ API; mentor junior và dẫn dắt sprint.",
      tags: ["Next.js", "Go", "Flutter", "MySQL", "WebSocket", "Firebase"],
      href: "https://kosenoba.com",
    },
    {
      name: "Uniscore & Flashscore",
      meta: "04/2022 – 04/2023 · Vitex & Unity Sport · Senior Full-Stack",
      description:
        "Nền tảng tỉ số thể thao real-time cho hàng trăm nghìn người dùng đồng thời. Push engine SignalR/WebSocket/Redis Pub/Sub độ trễ dưới 1 giây; refactor sang Go và .NET tăng 2.5 lần throughput, giảm 50% CPU.",
      tags: ["Go", "Next.js", ".NET Core", "SignalR", "Redis", "SQL Server"],
      href: "https://www.flashscore.com",
    },
    {
      name: "SuperCore – SSI Securities",
      meta: "12/2021 – 10/2022 · SSI · Fullstack (Java & Frontend)",
      description:
        "Hệ thống chứng khoán cơ sở và phái sinh: dẫn dắt frontend BO web, microservices Java 17/Spring Boot/gRPC cho xử lý lệnh, Elasticsearch tìm kiếm dưới 1 giây trên log giao dịch, streaming ticker bằng RxJS.",
      tags: ["Java 17", "Spring Boot", "gRPC", "Elasticsearch", "Angular 14", "Oracle"],
      href: "https://iboard.ssi.com.vn",
    },
    {
      name: "VietinBank Capital",
      meta: "05/2021 – 12/2021 · Vietinbank · FO Developer (Fullstack)",
      description:
        "Ứng dụng quản lý chứng khoán, giao dịch ngân hàng và chứng chỉ quỹ tích hợp iPay. REST API Spring Boot với gRPC cho mảng lưu ký và giám sát, web front-office Angular & Next.js, Elasticsearch cho tra cứu giao dịch.",
      tags: ["Java", "Spring Boot", "gRPC", "Angular", "Next.js", "Elasticsearch", "Oracle"],
      href: "https://vietinbankcapital.vn",
    },
    {
      name: "Mobifone Analyse Home",
      meta: "10/2020 – 04/2021 · Dft JSC, Mobifone · Backend",
      description:
        "Web app theo dõi và phân tích số liệu mạng di động Mobifone: biểu đồ lưu lượng 4G/3G/2G bằng React, API C# .NET, bảo trì app mobile Angular 2.",
      tags: ["React", "Angular 2", "C# .NET", "Java", "MongoDB", "MySQL"],
    },
    {
      name: "HAEDAP SmartSpeaker",
      meta: "04/2020 – 03/2022 · HAEDAP, Mobifone · Fullstack (Freelancer)",
      description:
        "Web quản lý và điều khiển hệ sinh thái loa thông minh theo vị trí. Dẫn dắt kiến trúc full-stack (Laravel admin, Node.js backend), làm việc trực tiếp với khách hàng từ thu thập yêu cầu đến triển khai trên CentOS 7.",
      tags: ["PHP / Laravel", "Node.js", "MySQL", "Apache", "CentOS"],
    },
  ],
};

export type ShopAisle = { icon: string; name: string; description: string };

export const shop: {
  title: string;
  intro: string;
  aisles: ShopAisle[];
  promisesTitle: string;
  promises: string[];
  cta: { label: string; href: string };
} = {
  title: "Cửa hàng",
  intro:
    "Brew & Code không chỉ bán cà phê. Mọi mặt hàng của quán — từ sản phẩm số tới dịch vụ làm theo yêu cầu — đều được bày bán trên Trustinfy, sàn giao dịch mình xây dựng.",
  aisles: [
    { icon: "📦", name: "Sản phẩm số", description: "Mã nguồn, template, tài liệu — mua xong nhận ngay." },
    { icon: "🛠️", name: "Dịch vụ theo yêu cầu", description: "Đặt làm riêng, trao đổi trực tiếp với người bán." },
    { icon: "🤝", name: "Thuê freelancer", description: "Tìm người phù hợp cho từng đầu việc." },
  ],
  promisesTitle: "Mua sắm yên tâm",
  promises: [
    "Tiền được tạm giữ, chỉ chuyển cho người bán khi bạn xác nhận",
    "Người bán đã xác minh danh tính eKYC",
    "Hỗ trợ tranh chấp 24/7, hoàn tiền minh bạch",
  ],
  cta: { label: "Ghé cửa hàng trên Trustinfy", href: "https://trustinfy.com" },
};

export type ContactLink = { label: string; value: string; href: string };

export const contact: { title: string; intro: string; links: ContactLink[] } = {
  title: "Liên hệ",
  intro:
    "Muốn cùng làm một dự án, trao đổi về kiến trúc hệ thống hay chỉ đơn giản là mời mình một ly cà phê ở Hà Nội? Hãy liên hệ nhé!",
  links: [
    { label: "Email", value: "cxtdev2000@gmail.com", href: "mailto:cxtdev2000@gmail.com" },
    { label: "Điện thoại", value: "(+84) 348 889 995", href: "tel:+84348889995" },
    { label: "GitHub", value: "github.com/cxtdev", href: "https://github.com/cxtdev" },
    { label: "Portfolio", value: "maverick.io.vn", href: "https://maverick.io.vn" },
    { label: "Địa điểm", value: "Hà Nội, Việt Nam", href: "https://maps.google.com/?q=Ha+Noi,+Vietnam" },
  ],
};
